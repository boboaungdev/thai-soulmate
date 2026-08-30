import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { uploadBufferToR2 } from "@/lib/r2-email"
import { extractCleanEmail, parseSenderNameAndEmail } from "@/lib/email-utils"
import { EMAIL_ACCOUNTS } from "@/constants/email"
import { EmailFolder, EmailDirection } from "@/lib/generated/prisma/client"

function stripHtmlToPlainText(html: string): string {
  if (!html) return ""
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function parseNameAndEmail(str?: string | null): {
  name: string | null
  email: string
} {
  if (!str) return { name: null, email: "unknown@example.com" }
  const match = str.match(/(.*?)\s*<(.+)>/)
  if (match) {
    const name = match[1].trim().replace(/^["']|["']$/g, "") || null
    const email = match[2].trim()
    return { name, email }
  }
  return { name: null, email: str.trim() }
}

function matchMailbox(
  fromEmail: string,
  toEmails: string[]
): { mailboxId: string; folder: EmailFolder; direction: EmailDirection } {
  const cleanFrom = extractCleanEmail(fromEmail).toLowerCase()
  const cleanToList = toEmails.map((t) => extractCleanEmail(t).toLowerCase())

  // Check if sent by one of our mailboxes
  const foundFromAccount = EMAIL_ACCOUNTS.find(
    (a) =>
      a.email.toLowerCase() === cleanFrom ||
      a.id.toLowerCase() === cleanFrom.split("@")[0]
  )

  // Check if received by one of our mailboxes
  const foundToAccount = EMAIL_ACCOUNTS.find((a) =>
    cleanToList.some(
      (to) =>
        to === a.email.toLowerCase() || to.split("@")[0] === a.id.toLowerCase()
    )
  )

  if (foundToAccount && !foundFromAccount) {
    return {
      mailboxId: foundToAccount.id,
      folder: EmailFolder.INBOX,
      direction: EmailDirection.INBOUND,
    }
  }

  if (foundFromAccount) {
    return {
      mailboxId: foundFromAccount.id,
      folder: EmailFolder.SENT,
      direction: EmailDirection.OUTBOUND,
    }
  }

  if (foundToAccount) {
    return {
      mailboxId: foundToAccount.id,
      folder: EmailFolder.INBOX,
      direction: EmailDirection.INBOUND,
    }
  }

  const fallback = cleanToList[0] ? cleanToList[0].split("@")[0] : "contact"
  return {
    mailboxId: fallback,
    folder: EmailFolder.INBOX,
    direction: EmailDirection.INBOUND,
  }
}

/**
 * Synchronizes emails from Resend API directly into the Neon database.
 */
export async function syncEmailsFromResend(
  _targetMailbox?: string
): Promise<{ syncedCount: number }> {
  try {
    const resendList = await resend.emails.list()
    const emailItems = resendList.data?.data || []

    if (emailItems.length === 0) {
      return { syncedCount: 0 }
    }

    // Get existing emails from DB
    const resendIds = emailItems.map((e) => e.id)
    const existingMessages = await prisma.emailMessage.findMany({
      where: {
        resendId: { in: resendIds },
      },
      include: { attachments: true },
    })

    const existingMap = new Map(existingMessages.map((m) => [m.resendId, m]))

    let syncedCount = 0

    // Fetch and sync each email if missing or if content is empty
    for (const item of emailItems) {
      try {
        const existing = existingMap.get(item.id)
        const needsUpdate =
          existing &&
          (existing.bodyHtml === "<p>(No content)</p>" || !existing.bodyHtml)

        if (existing && !needsUpdate) {
          continue
        }

        const detailRes = await resend.emails.get(item.id)
        const d = detailRes.data
        if (!d) continue
        const dAny = d as any

        const fromRaw = d.from || item.from || "unknown@thaisoulmate.org"
        const { name: fromName, email: fromEmail } = parseSenderNameAndEmail(
          fromRaw,
          dAny.headers?.from
        )

        const rawTo = d.to || item.to || []
        const toEmails = (Array.isArray(rawTo) ? rawTo : [rawTo])
          .map(extractCleanEmail)
          .filter(Boolean)

        const rawCc = d.cc || item.cc || []
        const ccEmails = (Array.isArray(rawCc) ? rawCc : [rawCc])
          .map(extractCleanEmail)
          .filter(Boolean)

        const rawBcc = d.bcc || item.bcc || []
        const bccEmails = (Array.isArray(rawBcc) ? rawBcc : [rawBcc])
          .map(extractCleanEmail)
          .filter(Boolean)

        const { mailboxId, folder, direction } = matchMailbox(
          fromEmail,
          toEmails
        )

        const subject = d.subject || item.subject || "(No Subject)"
        const bodyHtml =
          d.html ||
          (d.text
            ? `<p style="white-space: pre-wrap;">${d.text}</p>`
            : dAny.body
              ? `<p style="white-space: pre-wrap;">${dAny.body}</p>`
              : "<p>(No content)</p>")
        const bodyText = d.text || dAny.body || stripHtmlToPlainText(bodyHtml)
        const preview = (bodyText || stripHtmlToPlainText(bodyHtml)).slice(
          0,
          200
        )
        const emailDate =
          d.created_at || item.created_at
            ? new Date(d.created_at || item.created_at)
            : new Date()
        const emailId = existing ? existing.id : crypto.randomUUID()

        // Process attachments
        const uploadedAttachments: {
          filename: string
          contentType: string
          size: number
          url: string
          r2Key: string
        }[] = []

        const attachmentsToProcess = Array.isArray(dAny.attachments)
          ? dAny.attachments
          : []
        for (const att of attachmentsToProcess) {
          try {
            const filename = att.filename || "attachment"
            const contentType =
              att.content_type || att.contentType || "application/octet-stream"
            let fileBuffer: Buffer | null = null

            if (att.content) {
              fileBuffer = Buffer.from(att.content, "base64")
            } else if (att.data) {
              fileBuffer = Buffer.from(att.data)
            } else if (att.download_url || att.url) {
              const fileRes = await fetch(att.download_url || att.url)
              if (fileRes.ok) {
                fileBuffer = Buffer.from(await fileRes.arrayBuffer())
              }
            }

            if (fileBuffer && fileBuffer.length > 0) {
              const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
              const r2Key = `emails/${mailboxId}/${emailId}/attachments/${Date.now()}_${cleanFilename}`
              const r2Result = await uploadBufferToR2({
                buffer: fileBuffer,
                r2Key,
                contentType,
              })

              uploadedAttachments.push({
                filename,
                contentType,
                size: fileBuffer.length,
                url: r2Result.url,
                r2Key: r2Result.r2Key,
              })
            }
          } catch (attErr) {
            console.warn("Failed to process attachment in sync:", attErr)
          }
        }

        if (existing) {
          await prisma.emailMessage.update({
            where: { id: existing.id },
            data: {
              mailbox: mailboxId,
              fromEmail,
              fromName,
              toEmails,
              ccEmails,
              bccEmails,
              subject,
              preview,
              bodyText,
              bodyHtml,
              attachments: {
                create: uploadedAttachments.map((att) => ({
                  filename: att.filename,
                  contentType: att.contentType,
                  size: att.size,
                  url: att.url,
                  r2Key: att.r2Key,
                  isInline: false,
                })),
              },
            },
          })
        } else {
          await prisma.emailMessage.create({
            data: {
              id: emailId,
              resendId: item.id,
              mailbox: mailboxId,
              folder,
              direction,
              fromEmail,
              fromName,
              toEmails,
              ccEmails,
              bccEmails,
              subject,
              preview,
              bodyText,
              bodyHtml,
              isRead: folder === EmailFolder.SENT,
              isStarred: false,
              isArchived: false,
              isTrash: false,
              sentAt: folder === EmailFolder.SENT ? emailDate : null,
              receivedAt: folder === EmailFolder.INBOX ? emailDate : null,
              createdAt: emailDate,
              attachments: {
                create: uploadedAttachments.map((att) => ({
                  filename: att.filename,
                  contentType: att.contentType,
                  size: att.size,
                  url: att.url,
                  r2Key: att.r2Key,
                  isInline: false,
                })),
              },
            },
          })
        }

        syncedCount++
      } catch (itemErr) {
        console.warn(`Failed to sync email ${item.id}:`, itemErr)
      }
    }

    return { syncedCount }
  } catch (err) {
    console.error("Failed to sync emails from Resend:", err)
    return { syncedCount: 0 }
  }
}
