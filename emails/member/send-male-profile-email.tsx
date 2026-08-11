import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "react-email"

import { APP_INFO, BASE_URL } from "@/constants"

const currentYear = new Date().getFullYear()

interface SendFemaleMatchEmailProps {
  to: {
    prefix: string
    name: string
  }
}

export const SendMaleProfileEmail = ({ to }: SendFemaleMatchEmailProps) => (
  <Html>
    <Head />

    <Preview>
      [Soulmate] A carefully selected match is waiting for your review.
    </Preview>

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
          If you would like to proceed, please reply to this email.
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
              src={`${BASE_URL}/email/3.png`}
              width="150"
              alt={APP_INFO.name}
              style={signatureLogo}
            />
          </Container>
        </Section>

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

export default SendMaleProfileEmail

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
