import * as React from "react"
import { Button, Section, Text } from "react-email"

import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"
import { User } from "@/types"
import { MemberEmailLayout } from "@/features/shared/emails"

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

  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const formUrl = `${baseUrl}/application-form?email=${encodedEmail}`

  return (
    <MemberEmailLayout previewText="Thank you for registering your interest with Thai Soulmate. Next steps inside.">
      <Section style={bodyContent}>
        {/* Salutation */}
        <Text style={salutation}>Dear {displayName},</Text>

        {/* Lead In */}
        <Text style={paragraph}>
          Thank you for taking the time to share your preferences with us. We
          are honored to welcome you to our private circle and look forward to
          learning more about what you seek in a life partner.
        </Text>

        {/* Schedule Consultation Callout */}
        {preferredContactDate && preferredContactTime && (
          <Section style={appointmentCard}>
            <Text style={cardLabel}>Requested Consultation</Text>
            <Text style={cardValue}>
              {preferredContactDate} • {preferredContactTime} (ICT)
            </Text>
          </Section>
        )}

        {/* The Journey */}
        <Text style={paragraph}>
          Our team is currently reviewing your details. To help us better
          understand your background and introduce you to compatible matches, we
          kindly invite you to complete your private profile application.
        </Text>

        {/* Primary CTA */}
        <Section style={ctaSection}>
          <Button style={goldButton} href={formUrl}>
            Complete Application Form
          </Button>
          <Text style={ctaSubtext}>
            Takes approximately 5–7 minutes • Completely confidential
          </Text>
        </Section>

        {/* Reassurance */}
        <Text style={paragraph}>
          Every profile in our network is individually verified and held in
          strict confidence. Should you have any immediate questions before our
          call, simply reply directly to this email or reach us on WhatsApp.
        </Text>
      </Section>
    </MemberEmailLayout>
  )
}

export default RegisterInterestMemberConfirmationEmail

// --- STYLES ---

const bodyContent: React.CSSProperties = {
  padding: "0 4px",
}

const salutation: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1C0E12",
  margin: "0 0 16px 0",
}

const paragraph: React.CSSProperties = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#4A3E3D",
  margin: "0 0 16px 0",
}

const appointmentCard: React.CSSProperties = {
  backgroundColor: "#F7F0E6",
  borderRadius: "8px",
  borderLeft: "3px solid #D3A753",
  padding: "14px 18px",
  margin: "20px 0",
}

const cardLabel: React.CSSProperties = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: "11px",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#8C7A5B",
  margin: "0 0 4px 0",
}

const cardValue: React.CSSProperties = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: "15px",
  fontWeight: "600",
  color: "#1C0E12",
  margin: 0,
}

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "32px 0",
}

const goldButton: React.CSSProperties = {
  backgroundColor: "#D3A753",
  borderRadius: "6px",
  color: "#FFFFFF",
  display: "inline-block",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  padding: "14px 32px",
  boxShadow: "0 2px 8px rgba(211, 167, 83, 0.35)",
}

const ctaSubtext: React.CSSProperties = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: "12px",
  color: "#8C7A5B",
  marginTop: "10px",
  marginBottom: 0,
}
