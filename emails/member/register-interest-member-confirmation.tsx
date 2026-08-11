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

import { APP_INFO, BASE_URL, CONTACT } from "@/constants"
import { User } from "@/types"

const currentYear = new Date().getFullYear()

export const RegisterInterestMemberConfirmationEmail = ({ ...userDetails }: User) => (
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
          contact you soon to discuss the next steps.
        </Text>

        <Text style={paragraph}>
          In the meantime, please complete your profile application form by
          clicking the button below. This will help us understand your
          preferences and create the best possible match for you.
        </Text>

        <Section style={btnContainer}>
          <Button
            style={button}
            href={`${BASE_URL}/application-form?email=${userDetails.email}`}
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
          You can reply directly to this email if you have any questions. Our
          matchmaking team will be happy to assist you.
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

export default RegisterInterestMemberConfirmationEmail

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
  lineHeight: "26px",
  color: "#333333",
}

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#cfa14f",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  fontWeight: "600",
}

const hr = {
  borderColor: "#cccccc",
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


