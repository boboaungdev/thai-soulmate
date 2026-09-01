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
      {/* Greeting */}
      <Text style={greetingText}>Dear {displayName},</Text>

      {/* Paragraphs */}
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
        <strong>48 hours</strong> by clicking one of the options below:
      </Text>

      {/* Two-button Action Section */}
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
          <strong>Confidentiality Reminder:</strong> To preserve member privacy,
          please keep all attached details strictly confidential and do not
          disclose or share this profile with any third party.
        </Text>
      </div>

      <Text style={paragraph}>
        If you have any questions or wish to discuss this candidate with your
        matchmaker, please feel free to reply directly to this email.
      </Text>

      <Text style={closingText}>Best regards,</Text>
    </MemberEmailLayout>
  )
}

export default SendProfileEmail

/* ═══════════════════════════════════════════════════════
   STYLES — Minimal, Neutral (No Accent Colors)
═══════════════════════════════════════════════════════ */

const greetingText: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 16px 0",
  lineHeight: "26px",
}

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0 0 16px 0",
}

const buttonsSection: React.CSSProperties = {
  margin: "24px 0",
}

const acceptButton: React.CSSProperties = {
  backgroundColor: "#16A34A",
  color: "#FFFFFF",
  borderRadius: "6px",
  padding: "12px 22px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center" as const,
}

const rejectButton: React.CSSProperties = {
  backgroundColor: "#DC2626",
  color: "#FFFFFF",
  borderRadius: "6px",
  padding: "12px 22px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center" as const,
}

const confidentialCallout: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderLeft: "3px solid #6B7280",
  padding: "12px 16px",
  borderRadius: "0 6px 6px 0",
  margin: "20px 0",
}

const calloutText: React.CSSProperties = {
  margin: "0",
  fontSize: "13px",
  lineHeight: "20px",
  color: "#4B5563",
}

const closingText: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#111827",
  margin: "24px 0 0 0",
}
