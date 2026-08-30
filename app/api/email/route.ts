import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { uploadBufferToR2 } from "@/lib/r2-email"
import { EmailFolder } from "@/lib/generated/prisma/client"
import { EMAIL_ACCOUNTS } from "@/constants/email"
import { syncEmailsFromResend } from "@/lib/email-sync"
import {
  getReceivedEmail,
  downloadAndUploadAttachment,
} from "@/lib/resend-inbound"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const mailbox = searchParams.get("mailbox") || "info"
    const folderParam = (searchParams.get("folder") || "inbox").toUpperCase()
    const query = (searchParams.get("q") || "").trim()

    // Automatically sync missing emails from Resend into Database
    try {
      await syncEmailsFromResend(mailbox)
    } catch (syncErr) {
      console.warn("Background Resend sync note:", syncErr)
    }

    let folder: EmailFolder = EmailFolder.INBOX
    if (folderParam === "SENT") folder = EmailFolder.SENT
    else if (folderParam === "TRASH") folder = EmailFolder.TRASH
    else if (folderParam === "ARCHIVE") folder = EmailFolder.ARCHIVE
    else if (folderParam === "DRAFT") folder = EmailFolder.DRAFT
    else if (folderParam === "SPAM") folder = EmailFolder.SPAM

    const userEmail = (searchParams.get("userEmail") || "").trim().toLowerCase()
    const isPersonal = mailbox.toLowerCase() === "personal"
    const accountConfig = EMAIL_ACCOUNTS.find(
      (a) =>
        a.id.toLowerCase() === mailbox.toLowerCase() ||
        a.email.toLowerCase() === mailbox.toLowerCase()
    )
    const mailboxEmail = isPersonal
      ? userEmail
      : accountConfig
        ? accountConfig.email.toLowerCase()
        : `${mailbox.toLowerCase()}@thaisoulmate.org`

    const mailboxFilter = {
      OR: [
        { mailbox },
        { mailbox: mailbox.toLowerCase() },
        ...(mailboxEmail ? [{ mailbox: mailboxEmail }] : []),
        ...(folder === EmailFolder.SENT
          ? [
              ...(mailboxEmail
                ? [
                    {
                      fromEmail: {
                        contains: mailboxEmail,
                        mode: "insensitive" as const,
                      },
                    },
                  ]
                : []),
              {
                fromEmail: { contains: mailbox, mode: "insensitive" as const },
              },
            ]
          : [
              ...(mailboxEmail ? [{ toEmails: { has: mailboxEmail } }] : []),
              ...(accountConfig
                ? [{ toEmails: { has: accountConfig.email } }]
                : []),
              ...(isPersonal ? [{ mailbox: "personal" }] : []),
            ]),
      ],
    }

    const whereClause: any = {
      ...mailboxFilter,
      folder,
      isTrash: folder === EmailFolder.TRASH,
    }

    if (query) {
      whereClause.AND = [
        mailboxFilter,
        {
          OR: [
            { subject: { contains: query, mode: "insensitive" } },
            { preview: { contains: query, mode: "insensitive" } },
            { fromEmail: { contains: query, mode: "insensitive" } },
            { fromName: { contains: query, mode: "insensitive" } },
            { toEmails: { has: query } },
          ],
        },
      ]
      delete whereClause.OR
    }

    const rawEmails = await prisma.emailMessage.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        attachments: true,
      },
    })

    // Auto-repair any emails that were previously saved with empty content
    const emails = await Promise.all(
      rawEmails.map(async (email) => {
        if (
          email.resendId &&
          (email.bodyHtml === "<p>(No content)</p>" ||
            !email.bodyHtml ||
            email.bodyHtml.trim() === "")
        ) {
          try {
            // First attempt to fetch from Inbound Received Emails API
            let d: any = await getReceivedEmail(email.resendId)

            // If not found in receiving API (e.g. outbound email), fetch from regular emails API
            if (!d) {
              const detailRes = await resend.emails.get(email.resendId)
              d = detailRes.data as any
            }

            if (d && (d.html || d.text || d.body)) {
              const bodyHtml =
                d.html ||
                (d.text
                  ? `<p style="white-space: pre-wrap;">${d.text}</p>`
                  : d.body
                    ? `<p style="white-space: pre-wrap;">${d.body}</p>`
                    : "<p>(No content)</p>")
              const bodyText = d.text || d.body || ""
              const preview = (bodyText || bodyHtml.replace(/<[^>]+>/g, " "))
                .slice(0, 200)
                .trim()

              // Process any missing attachments
              const newAttachments: {
                filename: string
                contentType: string
                size: number
                url: string
                r2Key: string
                isInline: boolean
              }[] = []

              if (
                Array.isArray(d.attachments) &&
                d.attachments.length > 0 &&
                email.attachments.length === 0
              ) {
                for (const att of d.attachments) {
                  try {
                    const uploaded = await downloadAndUploadAttachment({
                      emailId: email.resendId,
                      mailboxId: email.mailbox,
                      dbEmailId: email.id,
                      attachment: att,
                    })
                    if (uploaded) {
                      newAttachments.push({
                        ...uploaded,
                        isInline: false,
                      })
                    }
                  } catch (attErr) {
                    console.warn("Failed to repair attachment:", attErr)
                  }
                }
              }

              const updated = await prisma.emailMessage.update({
                where: { id: email.id },
                data: {
                  bodyHtml,
                  bodyText,
                  preview,
                  ...(newAttachments.length > 0
                    ? {
                        attachments: {
                          create: newAttachments,
                        },
                      }
                    : {}),
                },
                include: {
                  attachments: true,
                },
              })

              return updated
            }
          } catch (repairErr) {
            console.warn(`Failed to auto-repair email ${email.id}:`, repairErr)
          }
        }
        return email
      })
    )

    return NextResponse.json({
      success: true,
      data: emails,
    })
  } catch (error: any) {
    console.error("Error in GET /api/email:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch emails" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, isStarred, isRead, isArchived, isTrash, folder } = body

    if (!id) {
      return NextResponse.json(
        { error: "Email ID is required" },
        { status: 400 }
      )
    }

    const dataToUpdate: any = {}
    if (typeof isStarred === "boolean") dataToUpdate.isStarred = isStarred
    if (typeof isRead === "boolean") dataToUpdate.isRead = isRead
    if (typeof isArchived === "boolean") dataToUpdate.isArchived = isArchived
    if (typeof isTrash === "boolean") dataToUpdate.isTrash = isTrash
    if (folder) dataToUpdate.folder = folder

    const updated = await prisma.emailMessage.update({
      where: { id },
      data: dataToUpdate,
      include: {
        attachments: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error("Error in PATCH /api/email:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update email" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Email ID is required" },
        { status: 400 }
      )
    }

    await prisma.emailMessage.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Email deleted successfully",
    })
  } catch (error: any) {
    console.error("Error in DELETE /api/email:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to delete email" },
      { status: 500 }
    )
  }
}
