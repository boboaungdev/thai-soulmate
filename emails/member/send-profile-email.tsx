import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "react-email"

import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"
import { TrackingStatus } from "@/lib/generated/prisma/enums"

const currentYear = new Date().getFullYear()

interface SendProfileEmailProps {
  to: {
    prefix: string
    name: string
    gender: "Male" | "Female"
  }
  trackingId: string
}

export const SendProfileEmail = ({ to, trackingId }: SendProfileEmailProps) => {
  const isMaleRecipient = to.gender === "Male"
  const pronoun = isMaleRecipient ? "Her" : "His"
  const otherPronoun = isMaleRecipient ? "she" : "he"

  const acceptStatus = isMaleRecipient
    ? TrackingStatus.MALE_ACCEPTED
    : TrackingStatus.FEMALE_ACCEPTED
  const rejectStatus = isMaleRecipient
    ? TrackingStatus.MALE_REJECTED
    : TrackingStatus.FEMALE_REJECTED

  return (
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
            We are pleased to let you know that our matchmaking team has
            carefully selected a potential match for you.
          </Text>

          <Text style={paragraph}>
            {pronoun} profile is attached to this email as a PDF for your
            review.
          </Text>

          <Text style={paragraph}>
            Please let us know your decision within <b>48 hours</b> by clicking
            one of the buttons below.
          </Text>

          <Section style={buttonWrapper}>
            <Row>
              <Column
                align="right"
                style={{ width: "50%", paddingRight: "8px" }}
              >
                <Button
                  style={{ ...button, backgroundColor: "#28a745" }}
                  href={`${env.BASE_URL}/api/tracking/${trackingId}?status=${acceptStatus}`}
                >
                  Accept
                </Button>
              </Column>
              <Column align="left" style={{ width: "50%", paddingLeft: "8px" }}>
                <Button
                  style={{ ...button, backgroundColor: "#dc3545" }}
                  href={`${env.BASE_URL}/api/tracking/${trackingId}?status=${rejectStatus}`}
                >
                  Reject
                </Button>
              </Column>
            </Row>
          </Section>

          <Text style={paragraph}>
            Once we receive your decision, we will proceed with the next steps.
            If you accept, we will notify your potential match. If{" "}
            {otherPronoun} also accepts, we will arrange an introduction.
          </Text>

          <Text style={paragraph}>
            To protect the privacy of all members, please keep the attached
            profile confidential and do not share it with anyone.
          </Text>

          <Text style={paragraph}>
            If you have any questions, simply reply to this email. Our
            matchmaking team will be happy to assist you.
          </Text>

          <Text style={paragraph}>Warm regards,</Text>

          <Section style={signature}>
            <Container style={signatureContainer}>
              <Img
                src={`${env.BASE_URL}/email/3.png`}
                width="150"
                alt={APP_INFO.name}
                style={signatureLogo}
              />
            </Container>
          </Section>

          <Text style={replyMessage}>
            Simply reply to this email to let us know your decision or if you
            have any questions. We look forward to hearing from you.
          </Text>

          <Section style={copyrightSection}>
            <Text style={copyright}>
              Copyright &copy; {currentYear} {APP_INFO.name}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default SendProfileEmail

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
const paragraph = { fontSize: "16px", lineHeight: "28px", color: "#333333" }
const buttonWrapper = {
  textAlign: "center" as const,
  marginTop: "20px",
  marginBottom: "20px",
}
const button = {
  color: "#ffffff",
  fontSize: "16px",
  textDecoration: "none",
  borderRadius: "5px",
  padding: "12px 20px",
  display: "inline-block",
}
const replyMessage = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "20px",
  marginTop: "12px",
}
const copyrightSection = { textAlign: "center" as const }
const copyright = {
  color: "#9ca3af",
  fontSize: "12px",
  marginTop: "8px",
  textAlign: "center" as const,
}
const signature = { marginTop: "24px", marginBottom: "24px" }
const signatureContainer = { width: "220px", margin: "0" }
const signatureLogo = { display: "block", margin: "0 auto 16px" }
