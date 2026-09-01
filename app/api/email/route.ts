import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { EmailFolder } from "@/lib/generated/prisma/client"
import { EMAIL_ACCOUNTS } from "@/constants/email"
import { deleteEmailR2Assets } from "@/lib/r2-email"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const mailbox = searchParams.get("mailbox") || "info"
    const folderParam = (searchParams.get("folder") || "inbox").toUpperCase()
    const query = (searchParams.get("q") || "").trim()

    let folder: EmailFolder = EmailFolder.INBOX
    if (folderParam === "SENT") folder = EmailFolder.SENT
    else if (folderParam === "TRASH") folder = EmailFolder.TRASH
    else if (folderParam === "ARCHIVE") folder = EmailFolder.ARCHIVE
    else if (folderParam === "DRAFT") folder = EmailFolder.DRAFT
    else if (folderParam === "SPAM") folder = EmailFolder.SPAM

    const userEmail = (searchParams.get("userEmail") || "").trim().toLowerCase()
    const isPersonal = mailbox.toLowerCase() === "personal"

    let whereClause: any = {}

    if (isPersonal) {
      if (!userEmail) {
        return NextResponse.json({ success: true, data: [] })
      }

      if (folderParam === "STARRED") {
        whereClause = {
          OR: [
            { fromEmail: { equals: userEmail, mode: "insensitive" } },
            { toEmails: { has: userEmail } },
            { ccEmails: { has: userEmail } },
            { bccEmails: { has: userEmail } },
          ],
          isStarred: true,
          isTrash: false,
        }
      } else if (folder === EmailFolder.TRASH) {
        whereClause = {
          OR: [
            { fromEmail: { equals: userEmail, mode: "insensitive" } },
            { toEmails: { has: userEmail } },
            { ccEmails: { has: userEmail } },
            { bccEmails: { has: userEmail } },
          ],
          isTrash: true,
        }
      } else if (folder === EmailFolder.ARCHIVE) {
        whereClause = {
          OR: [
            { fromEmail: { equals: userEmail, mode: "insensitive" } },
            { toEmails: { has: userEmail } },
            { ccEmails: { has: userEmail } },
            { bccEmails: { has: userEmail } },
          ],
          isArchived: true,
          isTrash: false,
        }
      } else if (folder === EmailFolder.SPAM) {
        whereClause = {
          OR: [
            { fromEmail: { equals: userEmail, mode: "insensitive" } },
            { toEmails: { has: userEmail } },
            { ccEmails: { has: userEmail } },
            { bccEmails: { has: userEmail } },
          ],
          folder: EmailFolder.SPAM,
          isTrash: false,
        }
      } else if (folder === EmailFolder.DRAFT) {
        whereClause = {
          fromEmail: { equals: userEmail, mode: "insensitive" },
          folder: EmailFolder.DRAFT,
          isTrash: false,
        }
      } else if (folder === EmailFolder.SENT) {
        whereClause = {
          fromEmail: { equals: userEmail, mode: "insensitive" },
          isTrash: false,
          folder: {
            notIn: [EmailFolder.TRASH, EmailFolder.DRAFT, EmailFolder.SPAM],
          },
        }
      } else {
        // INBOX (Personal)
        whereClause = {
          OR: [
            { toEmails: { has: userEmail } },
            { ccEmails: { has: userEmail } },
            { bccEmails: { has: userEmail } },
          ],
          folder: {
            notIn: [
              EmailFolder.TRASH,
              EmailFolder.ARCHIVE,
              EmailFolder.SPAM,
              EmailFolder.SENT,
              EmailFolder.DRAFT,
            ],
          },
          isArchived: false,
          isTrash: false,
        }
      }
    } else {
      // Shared work account (contact, admin, payments, socials)
      const accountConfig = EMAIL_ACCOUNTS.find(
        (a) =>
          a.id.toLowerCase() === mailbox.toLowerCase() ||
          a.email.toLowerCase() === mailbox.toLowerCase()
      )
      const mailboxEmail = accountConfig
        ? accountConfig.email.toLowerCase()
        : `${mailbox.toLowerCase()}@thaisoulmate.org`
      const mailboxNames = [mailbox, mailbox.toLowerCase(), mailboxEmail]
      const mbMatch = { in: mailboxNames }

      if (folderParam === "STARRED") {
        whereClause = {
          OR: [
            { mailbox: mbMatch },
            { toEmails: { has: mailboxEmail } },
            { ccEmails: { has: mailboxEmail } },
            { fromEmail: { contains: mailboxEmail, mode: "insensitive" } },
          ],
          isStarred: true,
          isTrash: false,
        }
      } else if (folder === EmailFolder.TRASH) {
        whereClause = {
          OR: [
            { mailbox: mbMatch },
            { toEmails: { has: mailboxEmail } },
            { ccEmails: { has: mailboxEmail } },
            { fromEmail: { contains: mailboxEmail, mode: "insensitive" } },
          ],
          isTrash: true,
        }
      } else if (folder === EmailFolder.ARCHIVE) {
        whereClause = {
          OR: [
            { mailbox: mbMatch },
            { toEmails: { has: mailboxEmail } },
            { ccEmails: { has: mailboxEmail } },
            { fromEmail: { contains: mailboxEmail, mode: "insensitive" } },
          ],
          isArchived: true,
          isTrash: false,
        }
      } else if (folder === EmailFolder.SPAM) {
        whereClause = {
          OR: [
            { mailbox: mbMatch },
            { toEmails: { has: mailboxEmail } },
            { ccEmails: { has: mailboxEmail } },
            { fromEmail: { contains: mailboxEmail, mode: "insensitive" } },
          ],
          folder: EmailFolder.SPAM,
          isTrash: false,
        }
      } else if (folder === EmailFolder.DRAFT) {
        whereClause = {
          OR: [
            { mailbox: mbMatch },
            { fromEmail: { contains: mailboxEmail, mode: "insensitive" } },
          ],
          folder: EmailFolder.DRAFT,
          isTrash: false,
        }
      } else if (folder === EmailFolder.SENT) {
        whereClause = {
          OR: [
            { mailbox: mbMatch, folder: EmailFolder.SENT },
            {
              mailbox: mbMatch,
              direction: "OUTBOUND" as const,
            },
            { fromEmail: { contains: mailboxEmail, mode: "insensitive" } },
          ],
          isTrash: false,
          folder: {
            notIn: [EmailFolder.TRASH, EmailFolder.DRAFT, EmailFolder.SPAM],
          },
        }
      } else {
        // INBOX (Work)
        whereClause = {
          OR: [
            { mailbox: mbMatch },
            { toEmails: { has: mailboxEmail } },
            { ccEmails: { has: mailboxEmail } },
          ],
          folder: {
            notIn: [
              EmailFolder.TRASH,
              EmailFolder.ARCHIVE,
              EmailFolder.SPAM,
              EmailFolder.SENT,
              EmailFolder.DRAFT,
            ],
          },
          direction: { not: "OUTBOUND" },
          isArchived: false,
          isTrash: false,
        }
      }
    }

    if (query) {
      whereClause = {
        AND: [
          whereClause,
          {
            OR: [
              { subject: { contains: query, mode: "insensitive" } },
              { preview: { contains: query, mode: "insensitive" } },
              { fromEmail: { contains: query, mode: "insensitive" } },
              { fromName: { contains: query, mode: "insensitive" } },
              { toEmails: { has: query } },
            ],
          },
        ],
      }
    }

    const emails = await prisma.emailMessage.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        attachments: true,
      },
    })

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

    const existing = await prisma.emailMessage.findUnique({
      where: { id },
      include: { attachments: true },
    })

    if (existing) {
      // Clean up all Cloudflare R2 files (attachments + inline images)
      await deleteEmailR2Assets({
        bodyHtml: existing.bodyHtml,
        attachments: existing.attachments,
      })

      await prisma.emailMessage.delete({
        where: { id },
      })
    }

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
