import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email"
import * as React from "react"

type ContactFormNotificationDetails = {
  name: string
  email: string
  subject: string
  message: string
}

export const ContactFormAdminNotificationEmail = ({
  name,
  email,
  subject,
  message,
}: ContactFormNotificationDetails) => (
  <Html>
    <Head />
    <Preview>[Contact Form] New Message from {name}: {subject}</Preview>

    <Body style={main}>
      <Container style={container}>
        <Section style={badgeSection}>
          <Text style={badgeText}>NEW CONTACT MESSAGE</Text>
        </Section>

        <Section style={contentSection}>
          <Text style={headingText}>{subject}</Text>
          <Text style={messageText}>{message}</Text>
        </Section>

        <Section style={infoSection}>
          <Text style={infoText}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={infoText}>
            <strong>Email:</strong> {email}
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footerSection}>
          <Text style={noReplyText}>
            Please do not reply directly to this automated notification email.
          </Text>
          <Text style={copyrightText}>
            Thai Soulmate Admin Notifications
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ContactFormAdminNotificationEmail

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
  marginBottom: "16px",
}

const badgeText = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  color: "#6366f1",
  margin: "0",
}

const contentSection = {
  marginBottom: "20px",
}

const headingText = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#0f172a",
  margin: "0 0 12px 0",
  lineHeight: "24px",
}

const messageText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#334155",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
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
