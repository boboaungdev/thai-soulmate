import * as React from "react"
import { env } from "@/lib/env"
import { AdminNotification } from "../components/admin-notification-card"

export interface AdminEmailNotificationProps {
  mailbox: string
  mailboxEmail: string
  senderName?: string | null
  toEmails: string[]
  ccEmails?: string[]
  bccEmails?: string[]
  subject: string
  bodyHtml?: string
  bodyText?: string
  attachments?: {
    filename: string
    size: number
    url: string
  }[]
  sentAt?: Date
}

function stripHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export const AdminEmailNotificationEmail = ({
  mailbox,
  mailboxEmail,
  senderName,
  toEmails,
  subject,
  bodyHtml = "",
  bodyText,
}: AdminEmailNotificationProps) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const rawPreview = bodyText || stripHtml(bodyHtml)
  const shortSnippet =
    rawPreview.length > 250 ? `${rawPreview.slice(0, 250)}...` : rawPreview

  return (
    <AdminNotification
      previewText={`[Mailbox Alert] ${subject || "(No Subject)"}`}
      category="Mailbox Activity"
      title={subject || "(No Subject)"}
      description={`New email received for ${mailboxEmail}.`}
      fields={[
        {
          label: "From",
          value: senderName ? `${senderName} <${mailboxEmail}>` : mailboxEmail,
        },
        { label: "To", value: toEmails.join(", ") },
      ]}
      messagePreview={shortSnippet || undefined}
      buttonText="View in Email Inbox"
      buttonUrl={`${baseUrl}/dashboard/email/${mailbox}/inbox`}
    />
  )
}

export default AdminEmailNotificationEmail
