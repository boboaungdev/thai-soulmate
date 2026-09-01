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
}: AdminNotificationProps) => (
  <Html>
    <Head />

    <Body style={main}>
      <Preview>{previewText}</Preview>
      <Container style={wrapper}>
        {/* ── TOP GRADIENT BAR ── */}
        <div style={topBar} />

        {/* ── BRAND HEADER ── */}
        <Section style={headerSection}>
          <Row>
            <Column style={{ textAlign: "center" }}>
              <Img
                src="https://thaisoulmate.org/logo.png"
                alt={APP_INFO.name}
                width={44}
                height={44}
                style={logoImg}
              />
              {/* SVG Gradient Wordmark — cross-client safe (Gmail, Apple Mail, Webmail) */}
              <div style={{ textAlign: "center", margin: "6px auto 2px" }}>
                <svg
                  width="220"
                  height="32"
                  viewBox="0 0 220 32"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label={APP_INFO.name}
                  style={{
                    display: "block",
                    margin: "0 auto",
                    maxWidth: "100%",
                  }}
                >
                  <defs>
                    <linearGradient
                      id="adminBrandGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#D3A753" />
                      <stop offset="50%" stopColor="#E791A7" />
                      <stop offset="100%" stopColor="#CA617D" />
                    </linearGradient>
                  </defs>
                  <text
                    x="110"
                    y="24"
                    textAnchor="middle"
                    fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                    fontSize="19"
                    fontWeight="700"
                    letterSpacing="1"
                    fill="url(#adminBrandGradient)"
                  >
                    {APP_INFO.name}
                  </text>
                </svg>
              </div>
              <Text style={brandTagline}>Admin Notification System</Text>
            </Column>
          </Row>
        </Section>

        {/* ── NOTIFICATION CARD ── */}
        <Section style={cardSection}>
          {/* Category Badge */}
          <div style={badgeRow}>
            <span style={categoryBadge}>{category}</span>
          </div>

          {/* Title */}
          <Text style={titleText}>{title}</Text>

          {/* Description */}
          {description && <Text style={descriptionText}>{description}</Text>}

          {/* ── Gradient Divider ── */}
          <div style={gradientDivider} />

          {/* Key-Value Fields */}
          {fields.length > 0 && (
            <Section style={fieldsSection}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={table}>
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

        {/* ── FOOTER ── */}
        <Section style={footerSection}>
          <Text style={footerNotice}>
            This is an automated admin notification from{" "}
            <strong style={{ color: "#5A0816" }}>{APP_INFO.name}</strong>.
            Please do not reply to this email.
          </Text>
          <Text style={footerCopy}>
            Copyright © {currentYear} {APP_INFO.name}. All rights reserved.
          </Text>
          <div style={bottomBar} />
        </Section>
      </Container>
    </Body>
  </Html>
)

export const AdminNotificationCard = AdminNotification
export default AdminNotification

/* ═══════════════════════════════════════════════════════
   STYLES — Thai Soulmate brand palette
   Primary:  #5A0816 (deep burgundy)
   Gold:     #D3A753
   Blush:    #E791A7
   Rose:     #CA617D
═══════════════════════════════════════════════════════ */

const main: React.CSSProperties = {
  backgroundColor: "#F5F0EC",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "40px 16px",
  margin: "0",
}

const wrapper: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
  borderRadius: "16px",
  maxWidth: "560px",
  border: "1px solid #E8DDD7",
  boxShadow: "0 6px 24px rgba(90, 8, 22, 0.07)",
  overflow: "hidden",
}

const topBar: React.CSSProperties = {
  height: "5px",
  background: "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
}

const headerSection: React.CSSProperties = {
  backgroundColor: "#FBF8F3",
  padding: "28px 36px 20px",
  textAlign: "center",
  borderBottom: "1px solid #EEE6DF",
}

const logoImg: React.CSSProperties = {
  display: "block",
  margin: "0 auto 10px auto",
  objectFit: "contain",
}

const brandTagline: React.CSSProperties = {
  margin: "0",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: "#D3A753",
  textAlign: "center",
}

const cardSection: React.CSSProperties = {
  padding: "28px 36px 24px",
}

const badgeRow: React.CSSProperties = {
  marginBottom: "12px",
}

const categoryBadge: React.CSSProperties = {
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: "20px",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "#5A0816",
  background: "rgba(211, 167, 83, 0.15)",
  border: "1px solid rgba(211, 167, 83, 0.4)",
}

const titleText: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1C0E12",
  lineHeight: "30px",
  margin: "0 0 6px 0",
}

const descriptionText: React.CSSProperties = {
  fontSize: "14px",
  color: "#7A6970",
  lineHeight: "22px",
  margin: "0 0 16px 0",
}

const gradientDivider: React.CSSProperties = {
  height: "1px",
  background:
    "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, transparent 100%)",
  margin: "16px 0",
}

const fieldsSection: React.CSSProperties = {
  backgroundColor: "#FBF8F3",
  borderRadius: "10px",
  padding: "14px 18px",
  border: "1px solid #EEE6DF",
  marginBottom: "16px",
}

const table: React.CSSProperties = {
  width: "100%",
  fontSize: "13px",
  lineHeight: "22px",
}

const labelCell: React.CSSProperties = {
  width: "80px",
  color: "#9A8A8F",
  fontWeight: "600",
  fontSize: "11px",
  letterSpacing: "0.04em",
  verticalAlign: "top" as const,
  padding: "4px 0",
}

const valueCell: React.CSSProperties = {
  color: "#1C0E12",
  fontWeight: "500",
  fontSize: "13px",
  verticalAlign: "top" as const,
  padding: "4px 0",
}

const messageBox: React.CSSProperties = {
  backgroundColor: "#FBF8F3",
  border: "1px solid #EEE6DF",
  borderLeft: "3px solid #D3A753",
  borderRadius: "8px",
  padding: "14px 16px",
  marginBottom: "16px",
}

const messageLabel: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.12em",
  color: "#D3A753",
  margin: "0 0 6px 0",
  textTransform: "uppercase" as const,
}

const messageText: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "22px",
  color: "#3A2530",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
}

const buttonSection: React.CSSProperties = {
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "4px",
}

const button: React.CSSProperties = {
  backgroundColor: "#CFA14F",
  color: "#FFFFFF",
  borderRadius: "6px",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  display: "block",
  textAlign: "center" as const,
}

const footerSection: React.CSSProperties = {
  backgroundColor: "#FBF8F3",
  borderTop: "1px solid #EEE6DF",
  padding: "20px 36px 0",
  textAlign: "center" as const,
}

const footerNotice: React.CSSProperties = {
  fontSize: "12px",
  color: "#A89EA3",
  margin: "0 0 6px 0",
  lineHeight: "18px",
  textAlign: "center" as const,
}

const footerCopy: React.CSSProperties = {
  fontSize: "11px",
  color: "#C4B8BC",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
}

const bottomBar: React.CSSProperties = {
  height: "4px",
  background: "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
}
