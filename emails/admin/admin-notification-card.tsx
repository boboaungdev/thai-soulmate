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
  const wordmarkUrl = `${baseUrl}/email/brand-wordmark.png`
  const topGradientUrl = `${baseUrl}/email/gradient-bar-top.png`
  const heartDividerUrl = `${baseUrl}/email/heart-divider.png`
  const middleGradientUrl = `${baseUrl}/email/middle-gradient-line.png`

  return (
    <Html>
      <Head />

      <Body style={main}>
        <Preview>{previewText}</Preview>
        <Container style={wrapper}>
          {/* ── TOP LUXURY GRADIENT BAR ── */}
          <div
            style={{ backgroundColor: "#D3A753", lineHeight: 0, fontSize: 0 }}
          >
            <Img
              src={topGradientUrl}
              alt=""
              width="600"
              height="5"
              style={{
                display: "block",
                width: "100%",
                height: "5px",
                border: 0,
              }}
            />
          </div>

          {/* ── MASTER BRAND HEADER (Matching Business Card 6 & Member Emails) ── */}
          <Section style={headerSection}>
            <Row>
              <Column align="center" style={{ textAlign: "center" }}>
                {/* 1. Logo Image */}
                <Img
                  src={logoUrl}
                  alt={APP_INFO.name}
                  width="52"
                  height="52"
                  style={logoImg}
                />

                {/* 2. Universally-Supported Brand Wordmark Image */}
                <div style={{ textAlign: "center", margin: "4px auto" }}>
                  <Img
                    src={wordmarkUrl}
                    alt={APP_INFO.name}
                    width="220"
                    height="32"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* 3. Exclusive Subtitle Badge */}
                <Text style={exclusiveText}>EXCLUSIVE</Text>

                {/* 4. Tagline / Service Subtitle */}
                <Text style={serviceSubtitleText}>
                  {APP_INFO.tagline}
                </Text>

                {/* 5. Decorative Fading Gold Heart Divider Image */}
                <div style={{ textAlign: "center", margin: "6px auto" }}>
                  <Img
                    src={heartDividerUrl}
                    alt="♥"
                    width="180"
                    height="20"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* 6. Secondary Tagline */}
                <Text style={taglineText}>
                  {APP_INFO.secondaryTagline.replace("\n", " ")}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── MIDDLE GRADIENT SEPARATOR ── */}
          <div style={{ padding: "0 28px" }}>
            <Img
              src={middleGradientUrl}
              alt=""
              width="544"
              height="1"
              style={{
                display: "block",
                width: "100%",
                height: "1px",
                border: 0,
              }}
            />
          </div>

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

          {/* ── FOOTER ── */}
          <Section style={footerSection}>
            <Text style={footerNotice}>
              This is an automated admin notification from Thai Soulmate. Please do not reply to this email.
            </Text>
            <Text style={footerCopy}>
              Copyright © {currentYear} Thai Soulmate. All rights reserved.
            </Text>
            <div style={bottomBar} />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const AdminNotificationCard = AdminNotification
export default AdminNotification

/* ═══════════════════════════════════════════════════════
   STYLES — Pure Clean White Background Design
═══════════════════════════════════════════════════════ */

const main: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "40px 16px",
  margin: "0",
}

const wrapper: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
  borderRadius: "16px",
  maxWidth: "600px",
  border: "1px solid #E8DDD7",
  overflow: "hidden",
}

const headerSection: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "26px 32px 20px",
  textAlign: "center",
}

const logoImg: React.CSSProperties = {
  display: "block",
  margin: "0 auto 8px auto",
  objectFit: "contain",
}

const exclusiveText: React.CSSProperties = {
  margin: "6px 0 0 0",
  fontSize: "10px",
  lineHeight: "14px",
  fontWeight: "700",
  letterSpacing: "0.3em",
  color: "#E791A7",
  textTransform: "uppercase" as const,
  textAlign: "center",
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
}

const serviceSubtitleText: React.CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: "11.5px",
  lineHeight: "16px",
  fontWeight: "700",
  letterSpacing: "0.22em",
  color: "#D3A753",
  textTransform: "uppercase" as const,
  textAlign: "center",
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
}

const taglineText: React.CSSProperties = {
  margin: "4px 0 0 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "11.5px",
  lineHeight: "17px",
  fontStyle: "italic",
  color: "#5A0816",
  textAlign: "center",
}

const cardSection: React.CSSProperties = {
  padding: "28px 36px 24px",
  backgroundColor: "#FFFFFF",
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
    "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
  margin: "0 0 20px 0",
}

const fieldsSection: React.CSSProperties = {
  backgroundColor: "#FBF8F3",
  borderRadius: "10px",
  padding: "4px 16px",
  marginBottom: "20px",
  border: "1px solid #EEE6DF",
}

const table: React.CSSProperties = {
  borderCollapse: "collapse",
}

const labelCell: React.CSSProperties = {
  padding: "10px 8px 10px 0",
  fontSize: "12px",
  fontWeight: "700",
  color: "#5A0816",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  width: "36%",
  verticalAlign: "top",
  borderBottom: "1px solid #F0E8E2",
}

const valueCell: React.CSSProperties = {
  padding: "10px 0",
  fontSize: "14px",
  color: "#1C0E12",
  verticalAlign: "top",
  borderBottom: "1px solid #F0E8E2",
}

const messageBox: React.CSSProperties = {
  backgroundColor: "#FAF7F5",
  borderLeft: "3px solid #D3A753",
  padding: "14px 16px",
  borderRadius: "0 8px 8px 0",
  marginBottom: "20px",
}

const messageLabel: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  color: "#D3A753",
  textTransform: "uppercase" as const,
}

const messageText: React.CSSProperties = {
  margin: "0",
  fontSize: "13.5px",
  lineHeight: "20px",
  color: "#3A2530",
  fontStyle: "italic",
}

const buttonSection: React.CSSProperties = {
  textAlign: "center",
  padding: "8px 0 4px",
}

const button: React.CSSProperties = {
  backgroundColor: "#CFA14F",
  borderRadius: "6px",
  color: "#ffffff",
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
  padding: "20px 36px 0",
  textAlign: "center",
  borderTop: "1px solid #EEE6DF",
}

const footerNotice: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "11px",
  color: "#7A6970",
  lineHeight: "17px",
}

const footerCopy: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "11px",
  color: "#9A8D92",
}

const bottomBar: React.CSSProperties = {
  height: "4px",
  background:
    "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
  margin: "0 -36px",
}
