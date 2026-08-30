import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { uploadBufferToR2 } from "@/lib/r2-email"
import { extractCleanEmail } from "@/lib/email-utils"
import { EMAIL_ACCOUNTS } from "@/constants/email"
import { generateAdminEmailNotificationHtml } from "@/emails/admin-email-notification"

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

function matchMailboxFromEmails(toEmails: string[]): { mailboxId: string; mailboxEmail: string } {
  for (const rawTo of toEmails) {
    const cleanTo = extractCleanEmail(rawTo).toLowerCase()
    const found = EMAIL_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === cleanTo || a.id.toLowerCase() === cleanTo.split("@")[0]
    )
    if (found) {
      return { mailboxId: found.id, mailboxEmail: found.email }
    }
  }

  const first = toEmails[0] ? extractCleanEmail(toEmails[0]).toLowerCase() : "contact@thaisoulmate.org"
  const prefix = first.split("@")[0] || "contact"
  return { mailboxId: prefix, mailboxEmail: first }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    let emailData = payload.data || payload

    if (emailData.email_id && (!emailData.html && !emailData.text && !emailData.from)) {
      try {
        const fetched = await resend.emails.get(emailData.email_id)
        if (fetched.data) {
          emailData = { ...emailData, ...fetched.data }
        }
      } catch (fetchErr) {
        console.warn("Failed to fetch email details by email_id from Resend:", fetchErr)
      }
    }

    const resendId = emailData.email_id || emailData.id || crypto.randomUUID()
    const fromRaw = emailData.from || "sender@example.com"
    const { name: fromName, email: fromEmail } = parseNameAndEmail(fromRaw)

    const rawTo = emailData.to || []
    const toEmails: string[] = (Array.isArray(rawTo) ? rawTo : [rawTo]).map(extractCleanEmail).filter(Boolean)

    const rawCc = emailData.cc || []
    const ccEmails: string[] = (Array.isArray(rawCc) ? rawCc : [rawCc]).map(extractCleanEmail).filter(Boolean)

    const rawBcc = emailData.bcc || []
    const bccEmails: string[] = (Array.isArray(rawBcc) ? rawBcc : [rawBcc]).map(extractCleanEmail).filter(Boolean)

    const subject = emailData.subject || "(No Subject)"
    const bodyHtml = emailData.html || (emailData.text ? `<p style="white-space: pre-wrap;">${emailData.text}</p>` : "<p>(No content)</p>")
    const bodyText = emailData.text || stripHtmlToPlainText(bodyHtml)
    const preview = stripHtmlToPlainText(bodyHtml).slice(0, 200)

    const { mailboxId, mailboxEmail } = matchMailboxFromEmails(toEmails)
    const emailId = crypto.randomUUID()

    const uploadedAttachments: {
      filename: string
      contentType: string
      size: number
      url: string
      r2Key: string
    }[] = []

    if (Array.isArray(emailData.attachments) && emailData.attachments.length > 0) {
      for (const att of emailData.attachments) {
        try {
          const filename = att.filename || "attachment"
          const contentType = att.content_type || "application/octet-stream"
          let fileBuffer: Buffer | null = null

          if (att.content) {
            fileBuffer = Buffer.from(att.content, "base64")
          } else if (att.data) {
            fileBuffer = Buffer.from(att.data)
          }

          if (fileBuffer) {
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
          console.warn("Failed to upload inbound attachment to R2:", attErr)
        }
      }
    }

    const createdEmail = await prisma.emailMessage.create({
      data: {
        id: emailId,
        resendId,
        mailbox: mailboxId,
        folder: "INBOX",
        direction: "INBOUND",
        fromEmail,
        fromName,
        toEmails,
        ccEmails,
        bccEmails,
        replyTo: emailData.reply_to ? (Array.isArray(emailData.reply_to) ? emailData.reply_to.join(", ") : emailData.reply_to) : null,
        subject,
        preview,
        bodyText,
        bodyHtml,
        isRead: false,
        isStarred: false,
        isArchived: false,
        isTrash: false,
        receivedAt: emailData.created_at ? new Date(emailData.created_at) : new Date(),
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

    // Check if notification recipients are configured for this mailbox
    try {
      const mailboxSetting = await prisma.mailboxSetting.findUnique({
        where: { mailbox: mailboxId },
      })

      const notificationRecipients = (mailboxSetting?.notificationEmails || [])
        .map((e) => e.trim())
        .filter((e) => e && e.toLowerCase() !== mailboxEmail.toLowerCase())

      if (notificationRecipients.length > 0) {
        const adminNotificationHtml = generateAdminEmailNotificationHtml({
          mailbox: mailboxId,
          mailboxEmail: fromEmail,
          senderName: fromName || null,
          toEmails,
          ccEmails,
          bccEmails,
          subject: `[New Inbound Email] from ${fromEmail}: ${subject}`,
          bodyHtml,
          attachments: uploadedAttachments.map((a) => ({
            filename: a.filename,
            size: a.size,
            url: a.url,
          })),
          sentAt: createdEmail.receivedAt || new Date(),
        })

        await resend.emails.send({
          from: "Thai Soulmate Notifications <notify@thaisoulmate.org>",
          to: notificationRecipients,
          subject: `[Inbound Alert] New email for ${mailboxEmail} from ${fromEmail}: ${subject}`,
          html: adminNotificationHtml,
        })
      }
    } catch (notifErr: any) {
      console.warn("Failed to dispatch incoming email alert:", notifErr?.message || notifErr)
    }

    return NextResponse.json({
      success: true,
      data: createdEmail,
    })
  } catch (error: any) {
    console.error("Error in POST /api/email/webhook:", error)
    return NextResponse.json(
      { error: error?.message || "Webhook processing failed" },
      { status: 500 }
    )
  }
}
