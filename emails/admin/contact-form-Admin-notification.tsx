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
    <Preview>{subject}</Preview>

    <Body style={main}>
      <Container style={container}>
        <Section style={contentSection}>
          <Text style={messageParagraph}>{message}</Text>
        </Section>

        <Hr style={hr} />

        <Section style={metaSection}>
          <Text style={metaText}>
            <strong>From:</strong> {name} &lt;{email}&gt;
          </Text>
          <Text style={subMetaText}>
            Submitted via Thai Soulmate Website Contact Form &bull; Reply
            directly to this email to respond to {name}.
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
  padding: "32px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  maxWidth: "600px",
}

const contentSection = {
  marginBottom: "24px",
}

const messageParagraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1e293b",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
}

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0 16px 0",
}

const metaSection = {
  color: "#64748b",
}

const metaText = {
  fontSize: "13px",
  color: "#475569",
  margin: "0 0 4px 0",
}

const subMetaText = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: "0",
  lineHeight: "18px",
}
