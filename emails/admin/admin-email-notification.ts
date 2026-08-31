import { env } from "@/lib/env"

export interface AdminEmailNotificationProps {
  mailbox: string
  mailboxEmail: string
  senderName?: string | null
  toEmails: string[]
  ccEmails?: string[]
  bccEmails?: string[]
  subject: string
  bodyHtml: string
  attachments?: {
    filename: string
    size: number
    url: string
  }[]
  sentAt?: Date
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function generateAdminEmailNotificationHtml({
  mailbox,
  mailboxEmail,
  senderName,
  toEmails,
  ccEmails = [],
  bccEmails = [],
  subject,
  bodyHtml,
  attachments = [],
  sentAt = new Date(),
}: AdminEmailNotificationProps): string {
  const baseUrl = env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const dashboardLink = `${baseUrl}/dashboard/email/${mailbox}/sent`
  const formattedTime = sentAt.toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " (GMT+7)"

  const attachmentListHtml =
    attachments.length > 0
      ? `
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
          📎 Attachments (${attachments.length})
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          ${attachments
            .map(
              (att) => `
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 6px; display: block;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size: 13px; font-weight: 600; color: #1e293b;">
                      📄 ${att.filename} <span style="font-size: 11px; font-weight: normal; color: #64748b;">(${formatFileSize(att.size)})</span>
                    </td>
                    <td align="right">
                      ${
                        att.url
                          ? `<a href="${att.url}" target="_blank" style="font-size: 12px; font-weight: 600; color: #e11d48; text-decoration: none;">Download &rarr;</a>`
                          : ""
                      }
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `
            )
            .join("")}
        </table>
      </div>
    `
      : ""

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Notification - Outbound Email</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Top Header -->
    <tr>
      <td style="padding: 24px 28px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="display: inline-block; padding: 4px 10px; background: rgba(225, 29, 72, 0.25); border: 1px solid rgba(225, 29, 72, 0.4); border-radius: 9999px; font-size: 11px; font-weight: 700; color: #fda4af; text-transform: uppercase; letter-spacing: 0.5px;">
                Mailbox Activity Alert
              </span>
              <h1 style="margin: 10px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                Outbound Email Dispatched
              </h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Summary Details Meta Box -->
    <tr>
      <td style="padding: 20px 28px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.6;">
          <tr>
            <td width="120" style="color: #64748b; font-weight: 600; padding: 4px 0; vertical-align: top;">From Mailbox:</td>
            <td style="color: #0f172a; font-weight: 600; padding: 4px 0;">
              ${senderName ? `${senderName} &lt;${mailboxEmail}&gt;` : mailboxEmail}
            </td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 600; padding: 4px 0; vertical-align: top;">Sent To:</td>
            <td style="color: #0f172a; padding: 4px 0; font-weight: 500;">
              ${toEmails.join(", ")}
            </td>
          </tr>
          ${
            ccEmails.length > 0
              ? `
          <tr>
            <td style="color: #64748b; font-weight: 600; padding: 4px 0; vertical-align: top;">Cc:</td>
            <td style="color: #475569; padding: 4px 0;">${ccEmails.join(", ")}</td>
          </tr>
          `
              : ""
          }
          ${
            bccEmails.length > 0
              ? `
          <tr>
            <td style="color: #64748b; font-weight: 600; padding: 4px 0; vertical-align: top;">Bcc:</td>
            <td style="color: #475569; padding: 4px 0;">${bccEmails.join(", ")}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="color: #64748b; font-weight: 600; padding: 4px 0; vertical-align: top;">Subject:</td>
            <td style="color: #0f172a; font-weight: 700; padding: 4px 0;">
              ${subject || "(No Subject)"}
            </td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 600; padding: 4px 0; vertical-align: top;">Sent Time:</td>
            <td style="color: #64748b; padding: 4px 0;">
              ${formattedTime}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Message Body Container -->
    <tr>
      <td style="padding: 24px 28px;">
        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
          Message Body
        </p>
        <div style="padding: 18px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1e293b; max-height: 400px; overflow-y: auto;">
          ${bodyHtml}
        </div>

        ${attachmentListHtml}

        <!-- CTA Link to View in Dashboard -->
        <div style="margin-top: 24px; text-align: center;">
          <a href="${dashboardLink}" target="_blank" style="display: inline-block; padding: 10px 22px; background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 6px; box-shadow: 0 2px 4px rgba(225, 29, 72, 0.2);">
            View Outbox in Dashboard &rarr;
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 16px 28px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
        <p style="margin: 0 0 4px 0;">
          This is an automated administrative notification dispatched by <strong>notify@thaisoulmate.org</strong>.
        </p>
        <p style="margin: 0;">
          You received this message because this email address is listed in the notification forward settings for <strong>${mailboxEmail}</strong>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
