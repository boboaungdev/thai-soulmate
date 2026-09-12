import * as React from "react"
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "react-email"

import EmailSignature, { EmailSignatureProps } from "./email-signature"

export interface MemberEmailLayoutProps {
  previewText: string
  signatureProps?: EmailSignatureProps
  children: React.ReactNode
}

export function MemberEmailLayout({
  previewText,
  signatureProps,
  children,
}: MemberEmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Preview>{previewText}</Preview>
        <Container style={cardWrapper}>
          {/* Email Body Content */}
          <Section style={contentSection}>{children}</Section>

          {/* Simple Divider Line */}
          <div style={dividerLine} />

          {/* Email Signature */}
          <Section style={signatureSection}>
            <EmailSignature {...signatureProps} />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default MemberEmailLayout

/* ═══════════════════════════════════════════════════════
   STYLES — Minimal, Clean Card Design (No Top Header, No BG Colors)
═══════════════════════════════════════════════════════ */

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "24px 16px",
  margin: "0",
  color: "#111827",
}

const cardWrapper: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
  borderRadius: "8px",
  maxWidth: "600px",
  border: "1px solid #E5E7EB",
  padding: "32px 32px 24px",
}

const contentSection: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "0",
  margin: "0",
}

const dividerLine: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#E5E7EB",
  margin: "28px 0 24px 0",
}

const signatureSection: React.CSSProperties = {
  padding: "0",
  margin: "0",
  backgroundColor: "#FFFFFF",
}
