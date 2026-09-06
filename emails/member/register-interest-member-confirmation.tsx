import * as React from "react"
import { Button, Section, Text } from "react-email"

import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"
import { User } from "@/types"
import MemberEmailLayout from "../components/member-email-layout"

export type RegisterInterestMemberConfirmationEmailProps = Partial<User> & {
  prefix?: string
  name?: string
  email?: string
  preferredContactDate?: string
  preferredContactTime?: string
}

export const RegisterInterestMemberConfirmationEmail = ({
  prefix = "",
  name = "Valued Client",
  email = "",
  preferredContactDate,
  preferredContactTime,
}: RegisterInterestMemberConfirmationEmailProps) => {
  const displayName = [prefix, name].filter(Boolean).join(" ")
  const encodedEmail = encodeURIComponent(email || "")
  const applicationUrl = `${env.BASE_URL}/application-form?email=${encodedEmail}`

  return (
    <MemberEmailLayout
      previewText={`[Register Interest] Thank you for registering with ${APP_INFO.name}.`}
    >
      {/* Greeting */}
      <Text style={greetingText}>Dear {displayName},</Text>

      {/* Paragraphs */}
      <Text style={paragraph}>
        Thank you for registering your interest with {APP_INFO.name}. We have
        successfully received your details.
      </Text>

      {preferredContactDate && preferredContactTime ? (
        <Text style={paragraph}>
          Our matchmaking advisory team will connect with you confidentially for
          your scheduled consultation on{" "}
          <strong style={boldText}>
            {preferredContactDate} between {preferredContactTime} (Thailand
            time)
          </strong>
          .
        </Text>
      ) : preferredContactDate ? (
        <Text style={paragraph}>
          Our matchmaking advisory team will connect with you confidentially for
          your scheduled consultation on{" "}
          <strong style={boldText}>
            {preferredContactDate} (Thailand time)
          </strong>
          .
        </Text>
      ) : (
        <Text style={paragraph}>
          Our matchmaking advisory team will carefully review your information
          and connect with you shortly to answer any questions and introduce our
          service.
        </Text>
      )}

      <Text style={paragraph}>
        In the meantime, you are welcome to fill out our confidential
        application form whenever you have a moment. This helps us understand
        more about you, your lifestyle, and what you are seeking in a life
        partner.
      </Text>

      {/* Action CTA Button */}
      <Section style={buttonContainer}>
        <Button style={button} href={applicationUrl}>
          Fill Application Form
        </Button>
      </Section>

      <Text style={paragraph}>
        If you have any questions, simply reply directly to this email at any
        time. We are always here to assist you.
      </Text>

      <Text style={paragraph}>We look forward to speaking with you.</Text>

      <Text style={closingText}>Warm regards,</Text>
    </MemberEmailLayout>
  )
}

export default RegisterInterestMemberConfirmationEmail

/* ═══════════════════════════════════════════════════════
   STYLES — Minimal, Neutral Text (No Accent Colors)
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

const boldText: React.CSSProperties = {
  fontWeight: "700",
  color: "#111827",
}

const buttonContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "24px 0",
}

const button: React.CSSProperties = {
  backgroundColor: "#CFA14F",
  color: "#FFFFFF",
  borderRadius: "6px",
  padding: "13px 28px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center" as const,
  letterSpacing: "0.02em",
}

const closingText: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#111827",
  margin: "24px 0 0 0",
}
