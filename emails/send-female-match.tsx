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
} from "react-email"
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

    <Preview>A carefully selected match is waiting for your review.</Preview>

    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>
          Dear {to.prefix} {to.name},
        </Text>

        <Text style={paragraph}>
          We are pleased to let you know that our matchmaking team has carefully
          selected a potential match for you.
        </Text>

        <Text style={paragraph}>
          His profile is attached to this email as a PDF for your review.
        </Text>

        <Text style={paragraph}>
          If you would like to proceed, please reply to this email within{" "}
          <b>24 hours</b>.
        </Text>

        <Text style={paragraph}>
          Once we receive your confirmation, we will notify him and continue
          with the next step of the introduction.
        </Text>

        <Text style={paragraph}>
          To protect the privacy of all members, please keep the attached
          profile confidential and do not share it with anyone.
        </Text>

        <Text style={paragraph}>
          If you have any questions, simply reply to this email. Our matchmaking
          team will be happy to assist you.
        </Text>

        <Text style={paragraph}>Warm regards,</Text>

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

        <Text style={replyMessage}>
          Simply reply to this email to let us know your decision or if you have
          any questions. We look forward to hearing from you.
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
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "22px",
}

const replyMessage = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "20px",
  marginTop: "12px",
}

const copyrightSection = {
  textAlign: "center" as const,
}

const copyright = {
  color: "#9ca3af",
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
