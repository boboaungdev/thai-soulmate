import {
  Body,
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

interface SendFemaleMatchEmailProps {
  to: {
    prefix: string
    name: string
  }
}

export const SendFemaleMatchEmail = ({ to }: SendFemaleMatchEmailProps) => (
  <Html>
    <Head />

    <Preview>
      A potential match has been selected for you. Please review the attached
      profile.
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>
          Dear {to.prefix} {to.name},
        </Text>

        <Text style={paragraph}>We hope you are doing well.</Text>

        <Text style={paragraph}>
          Our matchmaking team is pleased to let you know that we have carefully
          selected a potential match for you based on your preferences,
          compatibility, and the information you shared with us.
        </Text>

        <Text style={paragraph}>
          Please find the gentleman&apos;s profile attached to this email as a
          PDF document. We encourage you to review it carefully and take your
          time before making your decision.
        </Text>

        <Text style={paragraph}>
          If you are interested in getting to know this gentleman, please reply
          to this email or contact our team within <strong>24 hours</strong>.
        </Text>

        <Text style={paragraph}>
          Once we receive your confirmation, we will proceed with the next step
          of the introduction. If we do not hear from you within 24 hours, our
          team will follow up with you before moving forward.
        </Text>

        <Text style={paragraph}>
          To protect the privacy of all members, we kindly ask that you keep the
          attached profile confidential and do not share it with anyone.
        </Text>

        <Text style={paragraph}>
          If you have any questions or need further assistance, please feel free
          to contact us. We are always happy to help.
        </Text>

        <Text style={paragraph}>
          Thank you for trusting {APP_INFO.name}. We look forward to helping you
          find a meaningful and lasting relationship.
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
          This is an automated email. Please do not reply directly to this
          message.
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

export default SendFemaleMatchEmail

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
