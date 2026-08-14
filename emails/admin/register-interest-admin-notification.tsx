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

import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"

type AdminNotificationDetails = {
  prefix: string
  name: string
  dob: string
  age: number
  gender: string
  nationality: string
  location: string
  email: string
  phoneCountry: string
  phone: string
  source: string
  otherSource?: string
}

const currentYear = new Date().getFullYear()

export const RegisterInterestAdminNotificationEmail = ({
  ...details
}: AdminNotificationDetails) => (
  <Html>
    <Head />

    <Preview>
      [Register Interest] New user registration from {details.name}
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Section style={signature}>
          <Container style={signatureContainer}>
            <Img
              src={`${env.BASE_URL}/logo.png`}
              width="70"
              alt={APP_INFO.name}
              style={signatureLogo}
            />

            <Text style={appName}>{APP_INFO.name}</Text>
            <Text style={tagline}>{APP_INFO.tagline}</Text>
          </Container>
        </Section>

        <Text style={paragraph}>
          A new user has registered their interest on the website.
        </Text>

        <Section>
          <Text style={paragraph}>
            <strong>Name:</strong> {details.prefix} {details.name}
          </Text>

          <Text style={paragraph}>
            <strong>Date of Birth:</strong>{" "}
            {new Date(details.dob).toLocaleDateString()} (Age: {details.age})
          </Text>

          <Text style={paragraph}>
            <strong>Gender:</strong> {details.gender}
          </Text>

          <Text style={paragraph}>
            <strong>Nationality:</strong> {details.nationality}
          </Text>

          <Text style={paragraph}>
            <strong>Location:</strong> {details.location}
          </Text>

          <Text style={paragraph}>
            <strong>Email:</strong> {details.email}
          </Text>

          <Text style={paragraph}>
            <strong>Phone:</strong> {details.phoneCountry} {details.phone}
          </Text>

          <Text style={paragraph}>
            <strong>How did you hear about us:</strong> {details.source}
          </Text>

          {details.source === "Other" && (
            <Text style={paragraph}>
              <strong>Other source:</strong> {details.otherSource || "-"}
            </Text>
          )}
        </Section>

        <Hr style={hr} />

        <Text style={autoMessage}>
          This is an automated notification from your website. You can reply to
          this email directly to contact {details.name}.
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

export default RegisterInterestAdminNotificationEmail

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
