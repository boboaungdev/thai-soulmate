import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractCleanEmail, parseEmailsFromInput } from "@/lib/email-utils"
import { EMAIL_ACCOUNTS } from "@/constants/email"
import {
  uploadEmailAttachmentToR2,
  uploadBase64ImageToR2,
  deleteEmailR2Assets,
} from "@/lib/r2-email"

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
    let id: string | undefined
    let mailbox = "contact"
    let fromName = ""
    let explicitFromEmail = ""
    let toEmails: string[] = []
    let ccEmails: string[] = []
    let bccEmails: string[] = []
    let subject = ""
    let bodyHtml = ""
    let bodyText = ""
    let existingAttachments: Array<{
      id?: string
      filename: string
      contentType: string
      size: number
      url: string
      r2Key: string
    }> = []
    let newFiles: File[] = []

    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      id =
        (formData.get("id") as string) ||
        (formData.get("draftId") as string) ||
        undefined
      mailbox = (formData.get("mailbox") as string) || "contact"
      fromName = (formData.get("fromName") as string) || ""
      explicitFromEmail = (formData.get("fromEmail") as string) || ""
      subject = (formData.get("subject") as string) || ""
      bodyHtml = (formData.get("bodyHtml") as string) || ""
      bodyText = (formData.get("bodyText") as string) || ""

      const rawTo = formData.get("toEmails") as string
      const rawCc = formData.get("ccEmails") as string
      const rawBcc = formData.get("bccEmails") as string

      try {
        toEmails = rawTo
          ? rawTo.startsWith("[")
            ? JSON.parse(rawTo)
            : parseEmailsFromInput(rawTo)
          : []
      } catch {
        toEmails = parseEmailsFromInput(rawTo || "")
      }

      try {
        ccEmails = rawCc
          ? rawCc.startsWith("[")
            ? JSON.parse(rawCc)
            : parseEmailsFromInput(rawCc)
          : []
      } catch {
        ccEmails = parseEmailsFromInput(rawCc || "")
      }

      try {
        bccEmails = rawBcc
          ? rawBcc.startsWith("[")
            ? JSON.parse(rawBcc)
            : parseEmailsFromInput(rawBcc)
          : []
      } catch {
        bccEmails = parseEmailsFromInput(rawBcc || "")
      }

      const rawExistingAtt = formData.get("existingAttachments") as string
      if (rawExistingAtt) {
        try {
          existingAttachments = JSON.parse(rawExistingAtt)
        } catch {
          existingAttachments = []
        }
      }

      newFiles = formData.getAll("attachments") as File[]
    } else {
      const json = await req.json()
      id = json.id || json.draftId || undefined
      mailbox = json.mailbox || "contact"
      fromName = json.fromName || ""
      explicitFromEmail = json.fromEmail || ""
      toEmails = Array.isArray(json.toEmails)
        ? json.toEmails
        : parseEmailsFromInput(String(json.toEmails || ""))
      ccEmails = Array.isArray(json.ccEmails)
        ? json.ccEmails
        : parseEmailsFromInput(String(json.ccEmails || ""))
      bccEmails = Array.isArray(json.bccEmails)
        ? json.bccEmails
        : parseEmailsFromInput(String(json.bccEmails || ""))
      subject = json.subject || ""
      bodyHtml = json.bodyHtml || ""
      bodyText = json.bodyText || ""
      existingAttachments = Array.isArray(json.existingAttachments)
        ? json.existingAttachments
        : []
    }

    const accountConfig = EMAIL_ACCOUNTS.find(
      (a) => a.id === mailbox || a.email.toLowerCase() === mailbox.toLowerCase()
    )
    const cleanFrom = extractCleanEmail(explicitFromEmail)
    const fromEmail =
      cleanFrom && cleanFrom.includes("@")
        ? cleanFrom
        : accountConfig
          ? accountConfig.email
          : `${mailbox}@thaisoulmate.org`

    // Replace base64 inline images with permanent Cloudflare R2 links
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
          prefix: "draft-inline",
        }).then((res) => ({ original: originalDataUrl, url: res.url }))
      )
    }

    if (inlineUploadPromises.length > 0) {
      const uploadedInlineImages = await Promise.all(inlineUploadPromises)
      for (const item of uploadedInlineImages) {
        bodyHtml = bodyHtml.split(item.original).join(item.url)
      }
    }

    const preview = (bodyText || stripHtmlToPlainText(bodyHtml)).slice(0, 200)
    const draftId = id || crypto.randomUUID()

    // Upload newly attached files to Cloudflare R2
    const uploadedNewAttachments: {
      filename: string
      contentType: string
      size: number
      url: string
      r2Key: string
    }[] = []

    for (const file of newFiles) {
      if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
        const fileBuffer = Buffer.from(await file.arrayBuffer())
        const fileContentType = file.type || "application/octet-stream"
        const filename = file.name || "attachment"

        const r2Result = await uploadEmailAttachmentToR2({
          fileBuffer,
          filename,
          contentType: fileContentType,
          mailbox,
          emailId: draftId,
        })

        uploadedNewAttachments.push({
          filename,
          contentType: fileContentType,
          size: file.size,
          url: r2Result.url,
          r2Key: r2Result.r2Key,
        })
      }
    }

    // Update or Create Draft
    if (id) {
      const existing = await prisma.emailMessage.findUnique({
        where: { id },
        include: { attachments: true },
      })

      if (existing) {
        // Sync attachments: remove records no longer in existingAttachments
        const existingIdsToKeep = new Set(
          existingAttachments.map((a) => a.id).filter(Boolean)
        )
        const attachmentsToDelete = existing.attachments.filter(
          (a) => !existingIdsToKeep.has(a.id)
        )

        if (attachmentsToDelete.length > 0) {
          // Delete from Cloudflare R2 storage
          await deleteEmailR2Assets({ attachments: attachmentsToDelete })

          await prisma.emailAttachment.deleteMany({
            where: { id: { in: attachmentsToDelete.map((a) => a.id) } },
          })
        }

        // Add newly uploaded attachments
        if (uploadedNewAttachments.length > 0) {
          await prisma.emailAttachment.createMany({
            data: uploadedNewAttachments.map((att) => ({
              emailId: id!,
              filename: att.filename,
              contentType: att.contentType,
              size: att.size,
              url: att.url,
              r2Key: att.r2Key,
              isInline: false,
            })),
          })
        }

        const updated = await prisma.emailMessage.update({
          where: { id },
          data: {
            mailbox,
            folder: "DRAFT",
            fromEmail,
            fromName: fromName || null,
            toEmails,
            ccEmails,
            bccEmails,
            subject: subject || "(Draft)",
            preview,
            bodyHtml,
            bodyText: bodyText || preview,
            isRead: true,
            isTrash: false,
            isArchived: false,
          },
          include: {
            attachments: true,
          },
        })

        return NextResponse.json({ success: true, data: updated })
      }
    }

    // Create brand new draft with all attachments
    const allAttachmentsToCreate = [
      ...existingAttachments.map((att) => ({
        filename: att.filename,
        contentType: att.contentType || "application/octet-stream",
        size: att.size || 0,
        url: att.url,
        r2Key: att.r2Key || "",
        isInline: false,
      })),
      ...uploadedNewAttachments.map((att) => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
        url: att.url,
        r2Key: att.r2Key,
        isInline: false,
      })),
    ]

    const draft = await prisma.emailMessage.create({
      data: {
        id: draftId,
        mailbox,
        folder: "DRAFT",
        direction: "OUTBOUND",
        fromEmail,
        fromName: fromName || null,
        toEmails,
        ccEmails,
        bccEmails,
        subject: subject || "(Draft)",
        preview,
        bodyHtml,
        bodyText: bodyText || preview,
        isRead: true,
        isTrash: false,
        isArchived: false,
        attachments: {
          create: allAttachmentsToCreate,
        },
      },
      include: {
        attachments: true,
      },
    })

    return NextResponse.json({ success: true, data: draft })
  } catch (error: any) {
    console.error("Error saving draft in POST /api/email/draft:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to save draft" },
      { status: 500 }
    )
  }
}
