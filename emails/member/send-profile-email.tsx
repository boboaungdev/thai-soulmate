import * as React from "react"
import { Button, Column, Row, Section, Text } from "react-email"

import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"
import MemberEmailLayout from "../components/member-email-layout"

export interface SendProfileEmailProps {
  to: {
    prefix: string
    name: string
    gender: "Male" | "Female"
  }
  trackingId: string
}

export const SendProfileEmail = ({ to, trackingId }: SendProfileEmailProps) => {
  const isMaleRecipient = to.gender === "Male"
  const from = isMaleRecipient ? "male" : "female"
  const pronoun = isMaleRecipient ? "Her" : "His"
  const otherPronoun = isMaleRecipient ? "she" : "he"
  const displayName = [to.prefix, to.name].filter(Boolean).join(" ")

  const acceptUrl = `${env.BASE_URL}/api/tracking/${trackingId}?response=accepted&from=${from}`
  const rejectUrl = `${env.BASE_URL}/api/tracking/${trackingId}?response=rejected&from=${from}`

  return (
    <MemberEmailLayout
      previewText={`[${APP_INFO.name}] A hand-selected match is waiting for your review.`}
    >
      {/* ── Greeting ── */}
      <Text style={greetingText}>Dear {displayName},</Text>

      {/* ── Subtle Gradient Divider ── */}
      <div style={gradientDivider} />

      {/* ── Paragraphs ── */}
      <Text style={paragraph}>
        We are pleased to inform you that our matchmaking team has hand-selected
        a potential match for you based on your personal values and preferences.
      </Text>

      <Text style={paragraph}>
        {pronoun} private profile document is attached to this email as a PDF
        for your confidential review.
      </Text>

      <Text style={paragraph}>
        Please review the profile and let us know your decision within{" "}
        <strong style={{ color: "#5A0816" }}>48 hours</strong> by clicking one
        of the options below:
      </Text>

      {/* ── Two-button Action Section ── */}
      <Section style={buttonsSection}>
        <Row>
          <Column
            align="right"
            style={{
              width: "50%",
              paddingRight: "8px",
              verticalAlign: "middle",
            }}
          >
            <Button style={acceptButton} href={acceptUrl}>
              ✓ Accept Introduction
            </Button>
          </Column>
          <Column
            align="left"
            style={{
              width: "50%",
              paddingLeft: "8px",
              verticalAlign: "middle",
            }}
          >
            <Button style={rejectButton} href={rejectUrl}>
              ✕ Decline Match
            </Button>
          </Column>
        </Row>
      </Section>

      <Text style={paragraph}>
        Once we receive your response, we will immediately proceed with the next
        steps. If you accept and {otherPronoun} also accepts, our team will
        coordinate your private personal introduction.
      </Text>

      <div style={confidentialCallout}>
        <Text style={calloutText}>
          <strong style={{ color: "#5A0816" }}>
            Confidentiality Reminder:
          </strong>{" "}
          To preserve member privacy, please keep all attached details strictly
          confidential and do not disclose or share this profile with any third
          party.
        </Text>
      </div>

      <Text style={paragraph}>
        If you have any questions or wish to discuss this candidate with your
        matchmaker, please feel free to reply directly to this email.
      </Text>

      <Text style={closingText}>Warm regards,</Text>
    </MemberEmailLayout>
  )
}

export default SendProfileEmail

/* ═══════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════ */

const greetingText: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1C0E12",
  margin: "0 0 12px 0",
  lineHeight: "26px",
}

const gradientDivider: React.CSSProperties = {
  height: "1px",
  background:
    "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, transparent 100%)",
  margin: "0 0 20px 0",
}

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "25px",
  color: "#3A2530",
  margin: "0 0 16px 0",
}

const buttonsSection: React.CSSProperties = {
  margin: "24px 0",
}

const acceptButton: React.CSSProperties = {
  backgroundColor: "#16A34A",
  color: "#FFFFFF",
  borderRadius: "6px",
  padding: "12px 18px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "block",
  textAlign: "center" as const,
  boxShadow: "0 3px 10px rgba(22, 163, 74, 0.25)",
}

const rejectButton: React.CSSProperties = {
  backgroundColor: "#DC2626",
  color: "#FFFFFF",
  borderRadius: "6px",
  padding: "12px 18px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "block",
  textAlign: "center" as const,
  boxShadow: "0 3px 10px rgba(220, 38, 38, 0.2)",
}

const confidentialCallout: React.CSSProperties = {
  backgroundColor: "#FBF8F3",
  border: "1px solid #EEE6DF",
  borderLeft: "3px solid #D3A753",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "18px 0",
}

const calloutText: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#5A4E53",
  margin: "0",
}

const closingText: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#5A0816",
  margin: "24px 0 24px 0",
}
