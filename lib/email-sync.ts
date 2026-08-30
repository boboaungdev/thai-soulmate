import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { extractCleanEmail } from "@/lib/email-utils"
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

function parseNameAndEmail(str?: string | null): { name: string | null; email: string } {
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
    (a) => a.email.toLowerCase() === cleanFrom || a.id.toLowerCase() === cleanFrom.split("@")[0]
  )

  // Check if received by one of our mailboxes
  const foundToAccount = EMAIL_ACCOUNTS.find((a) =>
    cleanToList.some((to) => to === a.email.toLowerCase() || to.split("@")[0] === a.id.toLowerCase())
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
export async function syncEmailsFromResend(targetMailbox?: string): Promise<{ syncedCount: number }> {
  try {
    const resendList = await resend.emails.list()
    const emailItems = resendList.data?.data || []

    if (emailItems.length === 0) {
      return { syncedCount: 0 }
    }

    // Get existing resendIds already in DB
    const resendIds = emailItems.map((e) => e.id)
    const existingMessages = await prisma.emailMessage.findMany({
      where: {
        resendId: { in: resendIds },
      },
      select: { resendId: true },
    })

    const existingIdSet = new Set(existingMessages.map((m) => m.resendId).filter(Boolean))
    const missingEmails = emailItems.filter((e) => !existingIdSet.has(e.id))

    let syncedCount = 0

    // Fetch and sync each missing email
    for (const item of missingEmails) {
      try {
        const detailRes = await resend.emails.get(item.id)
        const d = detailRes.data
        if (!d) continue

        const fromRaw = d.from || item.from || "unknown@thaisoulmate.org"
        const { name: fromName, email: fromEmail } = parseNameAndEmail(fromRaw)

        const rawTo = d.to || item.to || []
        const toEmails = (Array.isArray(rawTo) ? rawTo : [rawTo]).map(extractCleanEmail).filter(Boolean)

        const rawCc = d.cc || item.cc || []
        const ccEmails = (Array.isArray(rawCc) ? rawCc : [rawCc]).map(extractCleanEmail).filter(Boolean)

        const rawBcc = d.bcc || item.bcc || []
        const bccEmails = (Array.isArray(rawBcc) ? rawBcc : [rawBcc]).map(extractCleanEmail).filter(Boolean)

        const { mailboxId, folder, direction } = matchMailbox(fromEmail, toEmails)

        const subject = d.subject || item.subject || "(No Subject)"
        const bodyHtml = d.html || (d.text ? `<p style="white-space: pre-wrap;">${d.text}</p>` : "<p>(No content)</p>")
        const bodyText = d.text || stripHtmlToPlainText(bodyHtml)
        const preview = stripHtmlToPlainText(bodyHtml).slice(0, 200)
        const emailDate = d.created_at || item.created_at ? new Date(d.created_at || item.created_at) : new Date()

        await prisma.emailMessage.create({
          data: {
            id: crypto.randomUUID(),
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
          },
        })

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
