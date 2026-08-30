import { PutObjectCommand } from "@aws-sdk/client-s3"
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

  const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/)
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
