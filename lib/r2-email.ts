import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3"
import { r2 } from "./r2"
import { env } from "./env"

export interface R2UploadResult {
  url: string
  r2Key: string
  size: number
}

/**
 * Uploads a Buffer/Uint8Array to Cloudflare R2 bucket.
 */
export async function uploadBufferToR2({
  buffer,
  r2Key,
  contentType,
}: {
  buffer: Buffer | Uint8Array
  r2Key: string
  contentType: string
}): Promise<R2UploadResult> {
  const bucketName = env.R2.BUCKET || "thai-soulmate"

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: r2Key,
    Body: buffer,
    ContentType: contentType,
  })

  await r2.send(command)

  const publicBaseUrl = env.R2.PUBLIC_URL?.replace(/\/+$/, "") || ""
  const url = publicBaseUrl ? `${publicBaseUrl}/${r2Key}` : `/${r2Key}`

  return {
    url,
    r2Key,
    size: buffer.length,
  }
}

/**
 * Uploads an email attachment to Cloudflare R2.
 */
export async function uploadEmailAttachmentToR2({
  fileBuffer,
  filename,
  contentType,
  mailbox,
  emailId,
}: {
  fileBuffer: Buffer
  filename: string
  contentType: string
  mailbox: string
  emailId: string
}): Promise<R2UploadResult> {
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  const timestamp = Date.now()
  const r2Key = `emails/${mailbox}/${emailId}/attachments/${timestamp}_${cleanFilename}`

  return uploadBufferToR2({
    buffer: fileBuffer,
    r2Key,
    contentType,
  })
}

/**
 * Converts dataUrl (e.g. "data:image/png;base64,...") to buffer and uploads to Cloudflare R2.
 */
export async function uploadBase64ImageToR2({
  dataUrl,
  mailbox,
  prefix = "signatures",
}: {
  dataUrl: string
  mailbox: string
  prefix?: string
}): Promise<{ url: string; r2Key: string }> {
  // If it's already an HTTP/R2 link, return directly
  if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
    return { url: dataUrl, r2Key: "" }
  }

  const match = dataUrl.match(
    /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/
  )
  if (!match) {
    throw new Error("Invalid base64 image data URL")
  }

  const contentType = match[1]
  const base64Data = match[2]
  const buffer = Buffer.from(base64Data, "base64")

  const ext = contentType.split("/")[1] || "png"
  const timestamp = Date.now()
  const r2Key = `emails/${mailbox}/${prefix}/${timestamp}_img.${ext}`

  const result = await uploadBufferToR2({
    buffer,
    r2Key,
    contentType,
  })

  return {
    url: result.url,
    r2Key: result.r2Key,
  }
}

/**
 * Deletes a single object from Cloudflare R2 by key.
 */
export async function deleteObjectFromR2(r2Key: string): Promise<boolean> {
  if (!r2Key) return false
  try {
    const bucketName = env.R2.BUCKET || "thai-soulmate"
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
    })
    await r2.send(command)
    return true
  } catch (error) {
    console.error(`Failed to delete object ${r2Key} from R2:`, error)
    return false
  }
}

/**
 * Deletes multiple objects from Cloudflare R2 by keys.
 */
export async function deleteObjectsFromR2(r2Keys: string[]): Promise<number> {
  const validKeys = r2Keys.filter(Boolean)
  if (validKeys.length === 0) return 0

  try {
    const bucketName = env.R2.BUCKET || "thai-soulmate"
    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: validKeys.map((Key) => ({ Key })),
        Quiet: true,
      },
    })
    await r2.send(command)
    return validKeys.length
  } catch (error) {
    let count = 0
    for (const key of validKeys) {
      const ok = await deleteObjectFromR2(key)
      if (ok) count++
    }
    return count
  }
}

/**
 * Extracts the storage R2 key from a public URL or path.
 */
export function extractR2KeyFromUrl(url: string): string | null {
  if (!url) return null
  const publicBaseUrl = env.R2.PUBLIC_URL?.replace(/\/+$/, "") || ""
  if (publicBaseUrl && url.startsWith(publicBaseUrl)) {
    return url.replace(`${publicBaseUrl}/`, "").replace(/^\/+/, "")
  }
  const match = url.match(/emails\/[^\s"'>]+/i)
  if (match) {
    return match[0]
  }
  return null
}

/**
 * Deletes all R2 attachments and inline images for an email or draft.
 */
export async function deleteEmailR2Assets({
  bodyHtml,
  attachments = [],
}: {
  bodyHtml?: string | null
  attachments?: Array<{ r2Key?: string | null; url?: string | null }>
}) {
  const keysToDelete: string[] = []

  for (const att of attachments) {
    if (att.r2Key) {
      keysToDelete.push(att.r2Key)
    } else if (att.url) {
      const key = extractR2KeyFromUrl(att.url)
      if (key) keysToDelete.push(key)
    }
  }

  if (bodyHtml) {
    const regex = /src=["']([^"']+)["']/g
    let match
    while ((match = regex.exec(bodyHtml)) !== null) {
      const src = match[1]
      const key = extractR2KeyFromUrl(src)
      if (key && !keysToDelete.includes(key)) {
        keysToDelete.push(key)
      }
    }
  }

  if (keysToDelete.length > 0) {
    await deleteObjectsFromR2(keysToDelete)
  }
}
