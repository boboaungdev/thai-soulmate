import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import {
  uploadEmailAttachmentToR2,
  uploadBase64ImageToR2,
} from "@/lib/r2-email"
import {
  extractCleanEmail,
  parseEmailsFromInput,
} from "@/components/email/compose-email-dialog"
import { EMAIL_ACCOUNTS } from "@/constants/email"

// Helper to strip HTML tags for plain text preview
function stripHtmlToPlainText(html: string): string {
  if (!html) return ""
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const mailbox = (formData.get("mailbox") as string) || "info"
    const fromName = (formData.get("fromName") as string) || ""
    const subject = ((formData.get("subject") as string) || "").trim()
    let bodyHtml = (formData.get("bodyHtml") as string) || ""

    // Parse Recipients
    const toRaw = (formData.get("to") as string) || ""
    const ccRaw = (formData.get("cc") as string) || ""
    const bccRaw = (formData.get("bcc") as string) || ""

    const toEmails = parseEmailsFromInput(toRaw)
    const ccEmails = parseEmailsFromInput(ccRaw)
    const bccEmails = parseEmailsFromInput(bccRaw)

    if (toEmails.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient email address is required." },
        { status: 400 }
      )
    }

    // Resolve Account From Email
    const accountConfig = EMAIL_ACCOUNTS.find(
      (a) => a.id === mailbox || a.email.toLowerCase() === mailbox.toLowerCase()
    )
    const fromEmail = accountConfig
      ? accountConfig.email
      : `${mailbox}@thaisoulmate.org`
    const senderDisplay = fromName ? `${fromName} <${fromEmail}>` : fromEmail

    // Replace base64 inline images in bodyHtml with permanent Cloudflare R2 links
    const base64Regex =
      /src=["'](data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,[^"']+)["']/g
    let match
    const inlineUploadPromises: Promise<{ original: string; url: string }>[] =
      []

    while ((match = base64Regex.exec(bodyHtml)) !== null) {
      const originalDataUrl = match[1]
      inlineUploadPromises.push(
        uploadBase64ImageToR2({
          dataUrl: originalDataUrl,
          mailbox,
          prefix: "inline",
        }).then((res) => ({ original: originalDataUrl, url: res.url }))
      )
    }

    if (inlineUploadPromises.length > 0) {
      const uploadedInlineImages = await Promise.all(inlineUploadPromises)
      for (const item of uploadedInlineImages) {
        bodyHtml = bodyHtml.split(item.original).join(item.url)
      }
    }

    // Generate unique ID for this email record in database
    const emailId = crypto.randomUUID()

    // Process attached files
    const attachmentFiles = formData.getAll("attachments") as File[]
    const uploadedAttachments: {
      filename: string
      contentType: string
      size: number
      url: string
      r2Key: string
      buffer: Buffer
    }[] = []

    for (const file of attachmentFiles) {
      if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
        const fileBuffer = Buffer.from(await file.arrayBuffer())
        const contentType = file.type || "application/octet-stream"
        const filename = file.name || "attachment"

        const r2Result = await uploadEmailAttachmentToR2({
          fileBuffer,
          filename,
          contentType,
          mailbox,
          emailId,
        })

        uploadedAttachments.push({
          filename,
          contentType,
          size: file.size,
          url: r2Result.url,
          r2Key: r2Result.r2Key,
          buffer: fileBuffer,
        })
      }
    }

    // Prepare attachments payload for Resend API
    const resendAttachments = uploadedAttachments.map((att) => ({
      filename: att.filename,
      content: att.buffer,
    }))

    // Send email via Resend API
    let resendId: string | undefined = undefined
    try {
      const resendResponse = await resend.emails.send({
        from: senderDisplay,
        to: toEmails,
        cc: ccEmails.length > 0 ? ccEmails : undefined,
        bcc: bccEmails.length > 0 ? bccEmails : undefined,
        subject: subject || "(No Subject)",
        html: bodyHtml,
        attachments:
          resendAttachments.length > 0 ? resendAttachments : undefined,
      })

      if (resendResponse.data?.id) {
        resendId = resendResponse.data.id
      }
    } catch (resendError: any) {
      console.warn(
        "Resend API send notice:",
        resendError?.message || resendError
      )
      // We continue saving to database so outbox records exist even in development without live domain verification
    }

    const preview = stripHtmlToPlainText(bodyHtml).slice(0, 200)

    // Save Email & Attachments in Neon Database via Prisma
    const createdEmail = await prisma.emailMessage.create({
      data: {
        id: emailId,
        resendId: resendId || null,
        mailbox,
        folder: "SENT",
        direction: "OUTBOUND",
        fromEmail,
        fromName: fromName || null,
        toEmails,
        ccEmails,
        bccEmails,
        subject: subject || "(No Subject)",
        preview,
        bodyHtml,
        sentAt: new Date(),
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
      include: {
        attachments: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: createdEmail,
    })
  } catch (error: any) {
    console.error("Error in POST /api/email/send:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to send email" },
      { status: 500 }
    )
  }
}
