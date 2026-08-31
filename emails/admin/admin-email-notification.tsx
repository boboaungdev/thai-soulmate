import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email"
import * as React from "react"

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

export const AdminEmailNotificationEmail = ({
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
}: AdminEmailNotificationProps) => {
  const formattedTime =
    new Date(sentAt).toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
      dateStyle: "medium",
      timeStyle: "short",
    }) + " (GMT+7)"

  return (
    <Html>
      <Head />
      <Preview>{`[Mailbox Alert] ${subject || "(No Subject)"}`}</Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Category Badge */}
          <Section style={badgeSection}>
            <Text style={badgeText}>MAILBOX ACTIVITY NOTIFICATION</Text>
          </Section>

          {/* Subject Heading */}
          <Text style={headingText}>{subject || "(No Subject)"}</Text>

          {/* Metadata Box */}
          <Section style={infoSection}>
            <Text style={infoText}>
              <strong>Mailbox:</strong>{" "}
              {senderName ? `${senderName} <${mailboxEmail}>` : mailboxEmail}
            </Text>
            <Text style={infoText}>
              <strong>To:</strong> {toEmails.join(", ")}
            </Text>
            {ccEmails.length > 0 && (
              <Text style={infoText}>
                <strong>Cc:</strong> {ccEmails.join(", ")}
              </Text>
            )}
            {bccEmails.length > 0 && (
              <Text style={infoText}>
                <strong>Bcc:</strong> {bccEmails.join(", ")}
              </Text>
            )}
            <Text style={timeText}>
              <strong>Time:</strong> {formattedTime}
            </Text>
          </Section>

          {/* Message Body Section */}
          <Section style={bodySection}>
            <Text style={bodyHeader}>MESSAGE CONTENT</Text>
            <div
              style={bodyBox}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </Section>

          {/* Attachments */}
          {attachments.length > 0 && (
            <Section style={attachmentSection}>
              <Text style={attachmentHeader}>
                ATTACHMENTS ({attachments.length})
              </Text>
              {attachments.map((att, idx) => (
                <div key={idx} style={attachmentItem}>
                  <Text style={attachmentText}>
                    📄 <strong>{att.filename}</strong>{" "}
                    <span style={attachmentSize}>
                      ({formatFileSize(att.size)})
                    </span>
                  </Text>
                  {att.url && (
                    <Link href={att.url} style={downloadLink} target="_blank">
                      Download &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </Section>
          )}

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={noReplyText}>
              Please do not reply directly to this automated notification email.
            </Text>
            <Text style={copyrightText}>Thai Soulmate Admin Notifications</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default AdminEmailNotificationEmail

const main = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  padding: "24px 0",
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "28px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  maxWidth: "560px",
}

const badgeSection = {
  marginBottom: "12px",
}

const badgeText = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  color: "#6366f1",
  margin: "0",
}

const headingText = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#0f172a",
  margin: "0 0 16px 0",
  lineHeight: "24px",
}

const infoSection = {
  backgroundColor: "#f8fafc",
  padding: "12px 16px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  marginBottom: "20px",
}

const infoText = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#475569",
  margin: "2px 0",
}

const timeText = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#64748b",
  margin: "2px 0",
}

const bodySection = {
  marginBottom: "20px",
}

const bodyHeader = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.05em",
  color: "#64748b",
  margin: "0 0 8px 0",
}

const bodyBox = {
  padding: "14px 16px",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  fontSize: "14px",
  lineHeight: "22px",
  color: "#334155",
  maxHeight: "350px",
  overflowY: "auto" as const,
}

const attachmentSection = {
  marginTop: "16px",
  paddingTop: "12px",
  borderTop: "1px solid #e2e8f0",
}

const attachmentHeader = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.05em",
  color: "#64748b",
  margin: "0 0 8px 0",
}

const attachmentItem = {
  padding: "8px 12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  marginBottom: "6px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const attachmentText = {
  fontSize: "13px",
  color: "#334155",
  margin: "0",
}

const attachmentSize = {
  fontSize: "11px",
  color: "#64748b",
  fontWeight: "normal",
}

const downloadLink = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6366f1",
  textDecoration: "none",
}

const hr = {
  borderColor: "#e2e8f0",
  margin: "20px 0 14px 0",
}

const footerSection = {
  textAlign: "center" as const,
}

const noReplyText = {
  fontSize: "12px",
  color: "#e11d48",
  margin: "0 0 4px 0",
  fontWeight: "500",
}

const copyrightText = {
  fontSize: "11px",
  color: "#94a3b8",
  margin: "0",
}
