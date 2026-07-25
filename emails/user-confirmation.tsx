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
} from "react-email"
import * as React from "react"

import { APP_INFO, BASE_URL, CONTACT } from "@/constants"
import { User } from "@/types"

const currentYear = new Date().getFullYear()

export const UserConfirmationEmail = ({ ...userDetails }: User) => (
  <Html>
    <Head />
    <Preview>
      Thank you for registering your interest with us. We have successfully
      received your details.
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>
          Dear {userDetails.prefix} {userDetails.name},
        </Text>

        <Text style={paragraph}>
          Thank you for registering your interest with us. We have successfully
          received your details. A member of our matchmaking team will review
          your information and contact you as soon as possible to discuss the
          next steps.
        </Text>

        <Text style={paragraph}>
          In the meantime, you can get started by filling application form.
          Please click the button below to complete your profile application
          process.
        </Text>

        <Section style={btnContainer}>
          <Button
            style={button}
            href={`${BASE_URL}/application-form?email=${userDetails.email}`}
          >
            Register Application Form
          </Button>
        </Section>

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
          This is an automated message. Please do not reply to this email.
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

export default UserConfirmationEmail

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
}

const btnContainer = {
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#cfa14f",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
}

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
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
