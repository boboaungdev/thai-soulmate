import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { EmailFolder } from "@/lib/generated/prisma/client"
import { EMAIL_ACCOUNTS } from "@/constants/email"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = (searchParams.get("userEmail") || "").trim().toLowerCase()

    const allAccountIds = [
      "personal",
      ...EMAIL_ACCOUNTS.map((acc) => acc.id.toLowerCase()),
    ]

    const counts: Record<string, Record<string, number>> = {}

    await Promise.all(
      allAccountIds.map(async (accId) => {
        if (accId === "personal") {
          if (!userEmail) {
            counts["personal"] = {
              inbox: 0,
              starred: 0,
              sent: 0,
              draft: 0,
              archive: 0,
              spam: 0,
              trash: 0,
            }
            return
          }

          const userOr = [
            { toEmails: { has: userEmail } },
            { ccEmails: { has: userEmail } },
            { bccEmails: { has: userEmail } },
            { fromEmail: { equals: userEmail, mode: "insensitive" as const } },
          ]

          const [
            inboxCount,
            starredCount,
            sentCount,
            draftCount,
            archiveCount,
            spamCount,
            trashCount,
          ] = await Promise.all([
            // Inbox: UNREAD messages from others sent TO the user
            prisma.emailMessage.count({
              where: {
                OR: [
                  { toEmails: { has: userEmail } },
                  { ccEmails: { has: userEmail } },
                  { bccEmails: { has: userEmail } },
                ],
                NOT: {
                  fromEmail: {
                    equals: userEmail,
                    mode: "insensitive" as const,
                  },
                },
                direction: { not: "OUTBOUND" },
                isRead: false,
                isTrash: false,
                isArchived: false,
                folder: {
                  notIn: [
                    EmailFolder.TRASH,
                    EmailFolder.ARCHIVE,
                    EmailFolder.SPAM,
                    EmailFolder.SENT,
                    EmailFolder.DRAFT,
                  ],
                },
              },
            }),
            // Starred: Total
            prisma.emailMessage.count({
              where: {
                OR: userOr,
                isStarred: true,
                isTrash: false,
              },
            }),
            // Sent: Total
            prisma.emailMessage.count({
              where: {
                fromEmail: { equals: userEmail, mode: "insensitive" as const },
                isTrash: false,
              },
            }),
            // Draft: Total
            prisma.emailMessage.count({
              where: {
                fromEmail: { equals: userEmail, mode: "insensitive" as const },
                folder: EmailFolder.DRAFT,
                isTrash: false,
              },
            }),
            // Archive: Total
            prisma.emailMessage.count({
              where: {
                OR: userOr,
                isArchived: true,
                isTrash: false,
              },
            }),
            // Spam: Total
            prisma.emailMessage.count({
              where: {
                OR: userOr,
                folder: EmailFolder.SPAM,
                isTrash: false,
              },
            }),
            // Trash: Total
            prisma.emailMessage.count({
              where: {
                OR: userOr,
                isTrash: true,
              },
            }),
          ])

          counts["personal"] = {
            inbox: inboxCount,
            starred: starredCount,
            sent: sentCount,
            draft: draftCount,
            archive: archiveCount,
            spam: spamCount,
            trash: trashCount,
          }
        } else {
          // Work mailboxes
          const mbMatch = { equals: accId, mode: "insensitive" as const }

          const [
            inboxCount,
            starredCount,
            sentCount,
            draftCount,
            archiveCount,
            spamCount,
            trashCount,
          ] = await Promise.all([
            // Inbox: UNREAD only from other users (inbound messages)
            prisma.emailMessage.count({
              where: {
                mailbox: mbMatch,
                direction: { not: "OUTBOUND" },
                isRead: false,
                isTrash: false,
                isArchived: false,
                folder: {
                  notIn: [
                    EmailFolder.TRASH,
                    EmailFolder.ARCHIVE,
                    EmailFolder.SPAM,
                    EmailFolder.SENT,
                    EmailFolder.DRAFT,
                  ],
                },
              },
            }),
            // Starred: Total
            prisma.emailMessage.count({
              where: {
                mailbox: mbMatch,
                isStarred: true,
                isTrash: false,
              },
            }),
            // Sent: Total
            prisma.emailMessage.count({
              where: {
                mailbox: mbMatch,
                isTrash: false,
                OR: [
                  { folder: EmailFolder.SENT },
                  { direction: "OUTBOUND" as const },
                ],
              },
            }),
            // Draft: Total
            prisma.emailMessage.count({
              where: {
                mailbox: mbMatch,
                folder: EmailFolder.DRAFT,
                isTrash: false,
              },
            }),
            // Archive: Total
            prisma.emailMessage.count({
              where: {
                mailbox: mbMatch,
                isTrash: false,
                OR: [{ folder: EmailFolder.ARCHIVE }, { isArchived: true }],
              },
            }),
            // Spam: Total
            prisma.emailMessage.count({
              where: {
                mailbox: mbMatch,
                folder: EmailFolder.SPAM,
                isTrash: false,
              },
            }),
            // Trash: Total
            prisma.emailMessage.count({
              where: {
                mailbox: mbMatch,
                OR: [{ folder: EmailFolder.TRASH }, { isTrash: true }],
              },
            }),
          ])

          counts[accId] = {
            inbox: inboxCount,
            starred: starredCount,
            sent: sentCount,
            draft: draftCount,
            archive: archiveCount,
            spam: spamCount,
            trash: trashCount,
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      counts,
    })
  } catch (error: any) {
    console.error("Error in GET /api/email/counts:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch email counts" },
      { status: 500 }
    )
  }
}
