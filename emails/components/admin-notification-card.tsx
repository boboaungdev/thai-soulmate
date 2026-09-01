import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Img,
} from "react-email"
import * as React from "react"
import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"

export interface AdminNotificationField {
  label: string
  value: React.ReactNode
}

export interface AdminNotificationProps {
  previewText: string
  /** e.g. "Register Interest", "Contact Form", "Mailbox Activity" */
  category: string
  /** Bold headline e.g. "New Interest Registration" */
  title: string
  /** Subtitle under title */
  description?: string
  /** Key-value rows shown in the detail card */
  fields: AdminNotificationField[]
  /** Optional message preview block */
  messagePreview?: string
  /** CTA button label */
  buttonText: string
  /** CTA button URL */
  buttonUrl: string
}

const currentYear = new Date().getFullYear()

export const AdminNotification = ({
  previewText,
  category,
  title,
  description,
  fields = [],
  messagePreview,
  buttonText,
  buttonUrl,
}: AdminNotificationProps) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const logoUrl = `${baseUrl}/logo.png`

  return (
    <Html>
      <Head />

      <Body style={main}>
        <Preview>{previewText}</Preview>
        <Container style={wrapper}>
          {/* Header (Minimal logo & title) */}
          <Section style={headerSection}>
            <Row>
              <Column align="center" style={{ textAlign: "center" }}>
                <Img
                  src={logoUrl}
                  alt={APP_INFO.name}
                  width="44"
                  height="44"
                  style={logoImg}
                />
                <Text style={brandHeaderTitle}>{APP_INFO.name}</Text>
                <Text style={brandHeaderSubtitle}>Admin Notification System</Text>
              </Column>
            </Row>
          </Section>

          {/* Simple Divider */}
          <div style={dividerLine} />

          {/* Notification Content */}
          <Section style={cardSection}>
            {/* Category */}
            <Text style={categoryText}>{category}</Text>

            {/* Title */}
            <Text style={titleText}>{title}</Text>

            {/* Description */}
            {description && <Text style={descriptionText}>{description}</Text>}

            {/* Key-Value Fields */}
            {fields.length > 0 && (
              <Section style={fieldsSection}>
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={table}
                >
                  <tbody>
                    {fields.map((field, idx) => (
                      <tr key={idx}>
                        <td style={labelCell}>{field.label}</td>
                        <td style={valueCell}>{field.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Message Preview */}
            {messagePreview && (
              <Section style={messageBox}>
                <Text style={messageLabel}>MESSAGE</Text>
                <Text style={messageText}>{messagePreview}</Text>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={button} href={buttonUrl}>
                {buttonText} →
              </Button>
            </Section>
          </Section>

          {/* Simple Divider */}
          <div style={dividerLine} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerNotice}>
              This is an automated admin notification from Thai Soulmate. Please do not reply to this email.
            </Text>
            <Text style={footerCopy}>
              Copyright © {currentYear} Thai Soulmate. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const AdminNotificationCard = AdminNotification
export default AdminNotification

/* ═══════════════════════════════════════════════════════
   STYLES — Minimal, Neutral (No Background Colors)
═══════════════════════════════════════════════════════ */

const main: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "24px 16px",
  margin: "0",
  color: "#111827",
}

const wrapper: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
  borderRadius: "8px",
  maxWidth: "600px",
  border: "1px solid #E5E7EB",
  padding: "28px 32px",
}

const headerSection: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "0",
  textAlign: "center",
}

const logoImg: React.CSSProperties = {
  display: "block",
  margin: "0 auto 6px auto",
  objectFit: "contain",
}

const brandHeaderTitle: React.CSSProperties = {
  margin: "4px 0 2px 0",
  fontSize: "17px",
  fontWeight: "700",
  color: "#111827",
  textAlign: "center",
}

const brandHeaderSubtitle: React.CSSProperties = {
  margin: "0",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "#6B7280",
  textAlign: "center",
}

const dividerLine: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#E5E7EB",
  margin: "20px 0",
}

const cardSection: React.CSSProperties = {
  padding: "0",
  backgroundColor: "#FFFFFF",
}

const categoryText: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "#6B7280",
}

const titleText: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#111827",
  lineHeight: "28px",
  margin: "0 0 6px 0",
}

const descriptionText: React.CSSProperties = {
  fontSize: "14px",
  color: "#4B5563",
  lineHeight: "22px",
  margin: "0 0 16px 0",
}

const fieldsSection: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "6px",
  border: "1px solid #E5E7EB",
  padding: "4px 16px",
  marginBottom: "20px",
}

const table: React.CSSProperties = {
  borderCollapse: "collapse",
}

const labelCell: React.CSSProperties = {
  padding: "10px 8px 10px 0",
  fontSize: "12px",
  fontWeight: "700",
  color: "#111827",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  width: "36%",
  verticalAlign: "top",
  borderBottom: "1px solid #F3F4F6",
}

const valueCell: React.CSSProperties = {
  padding: "10px 0",
  fontSize: "14px",
  color: "#374151",
  verticalAlign: "top",
  borderBottom: "1px solid #F3F4F6",
}

const messageBox: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderLeft: "3px solid #6B7280",
  padding: "12px 16px",
  borderRadius: "0 6px 6px 0",
  marginBottom: "20px",
}

const messageLabel: React.CSSProperties = {
  margin: "0 0 4px 0",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  color: "#6B7280",
  textTransform: "uppercase" as const,
}

const messageText: React.CSSProperties = {
  margin: "0",
  fontSize: "13.5px",
  lineHeight: "20px",
  color: "#374151",
  fontStyle: "italic",
}

const buttonSection: React.CSSProperties = {
  textAlign: "center",
  padding: "8px 0 4px",
}

const button: React.CSSProperties = {
  backgroundColor: "#CFA14F",
  borderRadius: "6px",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "600",
  letterSpacing: "0.02em",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 28px",
}

const footerSection: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "0",
  textAlign: "center",
}

const footerNotice: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "11px",
  color: "#6B7280",
  lineHeight: "17px",
}

const footerCopy: React.CSSProperties = {
  margin: "0",
  fontSize: "11px",
  color: "#9CA3AF",
}
