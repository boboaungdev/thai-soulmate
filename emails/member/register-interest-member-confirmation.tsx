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
      {/* ── Greeting ── */}
      <Text style={greetingText}>Dear {displayName},</Text>

      {/* ── Subtle Gradient Divider ── */}
      <div style={gradientDivider} />

      {/* ── Paragraphs ── */}
      <Text style={paragraph}>
        Thank you for registering your interest. We have successfully received
        your details and are delighted to welcome you to our private matchmaking
        service.
      </Text>

      <Text style={paragraph}>
        Our matchmaking advisory team will carefully review your information and
        contact you soon to discuss your requirements in detail
        {preferredContactDate && preferredContactTime ? (
          <>
            , preferably on{" "}
            <strong style={{ color: "#5A0816", fontWeight: "700" }}>
              {preferredContactDate} between {preferredContactTime}
            </strong>
          </>
        ) : (
          ""
        )}
        .
      </Text>

      <Text style={paragraph}>
        To help us understand your personal values, lifestyle, and partner
        preferences, please complete your private profile application form by
        clicking the button below.
      </Text>

      {/* ── Action CTA Button ── */}
      <Section style={buttonContainer}>
        <Button style={button} href={applicationUrl}>
          Complete Application Form →
        </Button>
      </Section>

      <Text style={paragraph}>
        If you have any questions or require immediate assistance, simply reply
        directly to this email. Your dedicated matchmaking consultant will be
        pleased to assist you.
      </Text>

      <Text style={paragraph}>
        We look forward to assisting you in finding a meaningful, lasting
        relationship.
      </Text>

      <Text style={closingText}>Warm regards,</Text>
    </MemberEmailLayout>
  )
}

export default RegisterInterestMemberConfirmationEmail

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

const buttonContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "26px 0",
}

const button: React.CSSProperties = {
  backgroundColor: "#CFA14F",
  color: "#FFFFFF",
  borderRadius: "6px",
  padding: "13px 28px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  display: "block",
  textAlign: "center" as const,
  letterSpacing: "0.02em",
  boxShadow: "0 4px 12px rgba(207, 161, 79, 0.25)",
}

const closingText: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#5A0816",
  margin: "24px 0 24px 0",
}
