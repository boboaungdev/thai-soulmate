import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

import { APP_INFO, BASE_URL, CONTACT } from "@/constants"

const currentYear = new Date().getFullYear()

interface SendMaleMatchEmailProps {
  to: {
    prefix: string
    name: string
  }
  profileId: string
}

export const SendMaleMatchEmail = ({
  to,
  profileId,
}: SendMaleMatchEmailProps) => (
  <Html>
    <Head />

    <Preview>
      Great news! Your potential match has accepted. View her profile now.
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>
          Dear {to.prefix} {to.name},
        </Text>

        <Text style={paragraph}>
          We are delighted to share some wonderful news.
        </Text>

        <Text style={paragraph}>
          The lady we recently introduced has expressed her interest in getting
          to know you. We are excited to move forward with the next stage of
          your matchmaking journey.
        </Text>

        <Text style={paragraph}>
          Please find her profile attached to this email as a PDF document for
          your review.
        </Text>

        <Text style={paragraph}>
          You can also securely view her profile online by clicking the button
          below.
        </Text>

        <Section style={buttonSection}>
          <Button
            href={`${BASE_URL}/dashboard/gallery/${profileId}`}
            style={button}
          >
            View Matched Profile
          </Button>
        </Section>

        <Text style={paragraph}>
          If you would like to proceed with this introduction, please accept the
          match through your account or contact our team within <b>24 hours</b>.
        </Text>

        <Text style={paragraph}>
          If we do not receive your response within this period, our team will
          contact you before proceeding to the next step.
        </Text>

        <Text style={paragraph}>
          To protect the privacy of all members, please keep the attached
          profile confidential and do not share it with anyone.
        </Text>

        <Text style={paragraph}>
          If you have any questions, our team will be happy to assist you.
        </Text>

        <Text style={paragraph}>Best regards,</Text>

        <Section style={signature}>
          <Container style={signatureContainer}>
            <Img
              src={`${BASE_URL}/logo.png`}
              width="70"
              alt={APP_INFO.name}
              style={signatureLogo}
            />

            <Text style={appName}>{APP_INFO.name}</Text>

            <Text style={tagline}>{APP_INFO.tagline}</Text>
          </Container>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Email: {CONTACT.email}
          <br />
          Phone: {CONTACT.primaryPhone}
        </Text>

        <Text style={autoMessage}>
          This is an automated email. Please do not reply to this email.
        </Text>

        <Section style={copyrightSection}>
          <Text style={copyright}>
            Copyright &copy; {currentYear} {APP_INFO.name}. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default SendMaleMatchEmail

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "28px",
  color: "#333333",
}

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "16px",
}

const hr = {
  borderColor: "#dddddd",
  margin: "30px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
}

const autoMessage = {
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "12px",
  fontStyle: "italic",
}

const copyrightSection = {
  textAlign: "center" as const,
}

const copyright = {
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "8px",
  textAlign: "center" as const,
}

const signature = {
  marginTop: "24px",
  marginBottom: "24px",
}

const signatureContainer = {
  width: "220px",
  margin: "0",
}

const signatureLogo = {
  display: "block",
  margin: "0 auto 16px",
}

const appName = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#222222",
  lineHeight: "30px",
  margin: "0",
  textAlign: "center" as const,
}

const tagline = {
  fontSize: "14px",
  color: "#666666",
  lineHeight: "22px",
  margin: "4px 0 0",
  textAlign: "center" as const,
}
