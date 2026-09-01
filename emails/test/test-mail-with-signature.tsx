import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "react-email"

import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"
import { User } from "@/types"

import EmailSignature from "../components/email-signature"

const currentYear = new Date().getFullYear()

type TestEmailWithSignatureProps = User

export const TestEmailWithSignature = ({
  ...userDetails
}: TestEmailWithSignatureProps) => (
  <Html>
    <Head />

    <Preview>
      [Register Interest] Thank you for registering your interest with us.
      Welcome to {APP_INFO.name}.
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>
          Dear {userDetails.prefix} {userDetails.name},
        </Text>

        <Text style={paragraph}>
          Thank you for registering your interest with us. We have successfully
          received your details.
        </Text>

        <Text style={paragraph}>
          Our matchmaking team will carefully review your information and
          contact you soon to discuss the next steps
          {userDetails.preferredContactDate && userDetails.preferredContactTime
            ? `, preferably on ${userDetails.preferredContactDate} between ${userDetails.preferredContactTime}`
            : ""}
          .
        </Text>

        <Text style={paragraph}>
          In the meantime, please complete your profile application form by
          clicking the button below. This will help us understand your
          preferences and create the best possible match for you.
        </Text>

        <Section style={btnContainer}>
          <Button
            style={button}
            href={`${env.BASE_URL}/application-form?email=${encodeURIComponent(
              userDetails.email || ""
            )}`}
          >
            Complete Application Form
          </Button>
        </Section>

        <Text style={paragraph}>
          If you have any questions or need assistance, simply reply to this
          email or contact our team. We will be happy to help you.
        </Text>

        <Text style={paragraph}>
          We look forward to helping you find a meaningful and lasting
          relationship.
        </Text>

        <Text style={paragraph}>Warm regards,</Text>

        {/* ======================================================
            EMAIL SIGNATURE
        ====================================================== */}

        <EmailSignature name={APP_INFO.name} role="1-2-1 Matchmaking Service" />

        {/* ======================================================
            REPLY MESSAGE
        ====================================================== */}

        <Text style={replyMessage}>
          You can reply directly to this email if you have any questions. Our
          matchmaking team will be happy to assist you.
        </Text>

        {/* ======================================================
            COPYRIGHT
        ====================================================== */}

        <Section style={copyrightSection}>
          <Text style={copyright}>
            Copyright © {currentYear} {APP_INFO.name}. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default TestEmailWithSignature

/* ============================================================
   MAIN EMAIL STYLES
============================================================ */

const main = {
  margin: 0,
  padding: 0,
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px 0 48px",
}

const paragraph = {
  margin: "0 0 18px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
}

const btnContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
}

const button = {
  display: "block",
  padding: "13px 24px",
  backgroundColor: "#CFA14F",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  lineHeight: "20px",
  fontWeight: "600",
  textAlign: "center" as const,
  textDecoration: "none",
}

const replyMessage = {
  margin: "16px 0 0",
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "20px",
}

const copyrightSection = {
  marginTop: "24px",
  textAlign: "center" as const,
}

const copyright = {
  margin: "8px 0 0",
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
}
