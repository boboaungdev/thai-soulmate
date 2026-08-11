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

import { APP_INFO, BASE_URL } from "@/constants"

const currentYear = new Date().getFullYear()

interface WebsiteReviewAdminNotificationEmailProps {
  reviewerInfo?: {
    name: string
    email: string
  }
}

export const WebsiteReviewAdminNotificationEmail = ({
  reviewerInfo,
}: WebsiteReviewAdminNotificationEmailProps) => (
  <Html>
    <Head />

    <Preview>{`[Website Review] New review from ${reviewerInfo?.name || "Anonymous"}`}</Preview>

    <Body style={main}>
      <Container style={container}>
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

        <Text style={paragraph}>A new website review has been received.</Text>

        {reviewerInfo && (
          <Section style={detailsSection}>
            <Text style={detailItem}>
              <strong>Name:</strong> {reviewerInfo.name}
            </Text>
            <Text style={detailItem}>
              <strong>Email:</strong> {reviewerInfo.email}
            </Text>
          </Section>
        )}
        <Text style={paragraph}>
          Full details are available on the admin dashboard.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={`${BASE_URL}/dashboard/website-review`}>
            View Website Reviews
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={autoMessage}>
          This is an automated notification from your website.
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

export default WebsiteReviewAdminNotificationEmail

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

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
}

const signature = {
  marginBottom: "24px",
}

const signatureContainer = {
  width: "220px",
  margin: "0 auto",
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

const autoMessage = {
  color: "#8898aa",
  fontSize: "12px",
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

const buttonContainer = {
  padding: "20px 0",
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#cfa14f",
  borderRadius: "5px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "10px 20px",
}

const detailsSection = {
  border: "1px solid #cccccc",
  borderRadius: "5px",
  padding: "10px 20px",
  margin: "20px 0",
}

const detailItem = {
  fontSize: "14px",
  lineHeight: "22px",
}
