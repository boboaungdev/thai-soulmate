import { env } from "@/lib/env"
import { uploadBufferToR2 } from "@/lib/r2-email"

export interface ResendReceivedAttachment {
  id: string
  filename: string
  content_type: string
  content_id?: string
  content_disposition?: string
  size: number
  download_url?: string
}

export interface ResendReceivedEmail {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  reply_to?: string[]
  subject: string
  html?: string
  text?: string
  created_at: string
  headers?: Record<string, any>
  attachments?: ResendReceivedAttachment[]
}

/**
 * Fetch received (inbound) email details by ID from Resend API
 */
export async function getReceivedEmail(
  emailId: string
): Promise<ResendReceivedEmail | null> {
  try {
    const res = await fetch(
      `https://api.resend.com/emails/receiving/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
        },
      }
    )
    if (!res.ok) {
      console.warn(`Resend receiving API returned ${res.status} for ${emailId}`)
      return null
    }
    const data = await res.json()
    return data as ResendReceivedEmail
  } catch (err) {
    console.error(`Failed to fetch received email ${emailId} from Resend:`, err)
    return null
  }
}

/**
 * Fetch download URL and upload attachment to Cloudflare R2
 */
export async function downloadAndUploadAttachment({
  emailId,
  mailboxId,
  dbEmailId,
  attachment,
}: {
  emailId: string
  mailboxId: string
  dbEmailId: string
  attachment: ResendReceivedAttachment
}): Promise<{
  filename: string
  contentType: string
  size: number
  url: string
  r2Key: string
} | null> {
  try {
    let downloadUrl = attachment.download_url

    if (!downloadUrl && attachment.id) {
      const attRes = await fetch(
        `https://api.resend.com/emails/receiving/${emailId}/attachments/${attachment.id}`,
        {
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
          },
        }
      )
      if (attRes.ok) {
        const attData = await attRes.json()
        downloadUrl = attData.download_url
      }
    }

    if (!downloadUrl) {
      console.warn(
        `No download_url found for attachment ${attachment.filename}`
      )
      return null
    }

    const fileRes = await fetch(downloadUrl)
    if (!fileRes.ok) {
      console.warn(
        `Failed to download attachment file from CDN: ${fileRes.status}`
      )
      return null
    }

    const buffer = Buffer.from(await fileRes.arrayBuffer())
    const filename = attachment.filename || "attachment.pdf"
    const contentType = attachment.content_type || "application/octet-stream"
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
    const r2Key = `emails/${mailboxId}/${dbEmailId}/attachments/${Date.now()}_${cleanFilename}`

    const r2Result = await uploadBufferToR2({
      buffer,
      r2Key,
      contentType,
    })

    return {
      filename,
      contentType,
      size: buffer.length,
      url: r2Result.url,
      r2Key: r2Result.r2Key,
    }
  } catch (err) {
    console.error(`Failed to process attachment ${attachment.filename}:`, err)
    return null
  }
}

/**
 * List all received emails from Resend
 */
export async function listReceivedEmails(): Promise<ResendReceivedEmail[]> {
  try {
    const res = await fetch("https://api.resend.com/emails/receiving", {
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.data || []) as ResendReceivedEmail[]
  } catch (err) {
    console.error("Failed to list received emails from Resend:", err)
    return []
  }
}
