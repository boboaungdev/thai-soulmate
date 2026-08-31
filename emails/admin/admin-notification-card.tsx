import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email"
import * as React from "react"

export interface AdminNotificationField {
  label: string
  value: React.ReactNode
}

export interface AdminNotificationProps {
  previewText: string
  category: string
  title: string
  description?: string
  fields: AdminNotificationField[]
  messagePreview?: string
  buttonText: string
  buttonUrl: string
}

export const AdminNotification = ({
  previewText,
  category,
  title,
  description,
  fields = [],
  messagePreview,
  buttonText,
  buttonUrl,
}: AdminNotificationProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>

    <Body style={main}>
      <Container style={container}>
        {/* Category Header */}
        <Text style={categoryText}>{category}</Text>

        {/* Title */}
        <Text style={titleText}>{title}</Text>

        {/* Description */}
        {description && <Text style={descriptionText}>{description}</Text>}

        {/* Key-Value Details */}
        {fields.length > 0 && (
          <Section style={fieldsSection}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={table}>
              <tbody>
                {fields.map((field, idx) => (
                  <tr key={idx}>
                    <td style={labelCell}>{field.label}</td>
                    <td style={valueCell}>{field.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {/* Optional Message Preview */}
        {messagePreview && (
          <Section style={messageBox}>
            <Text style={messageLabel}>MESSAGE</Text>
            <Text style={messageText}>{messagePreview}</Text>
          </Section>
        )}

        {/* Action Button */}
        <Section style={buttonSection}>
          <Button style={button} href={buttonUrl}>
            {buttonText} &rarr;
          </Button>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerNotice}>
            Please do not reply directly to this automated notification email.
          </Text>
          <Text style={footerSub}>Thai Soulmate Admin Notifications</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const AdminNotificationCard = AdminNotification
export default AdminNotification

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "36px 16px",
  margin: "0",
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "36px 32px",
  borderRadius: "12px",
  maxWidth: "540px",
  border: "1px solid #e4e4e7",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
}

const categoryText = {
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#71717a",
  margin: "0 0 6px 0",
}

const titleText = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#09090b",
  lineHeight: "28px",
  margin: "0 0 8px 0",
}

const descriptionText = {
  fontSize: "14px",
  color: "#71717a",
  lineHeight: "20px",
  margin: "0 0 20px 0",
}

const fieldsSection = {
  backgroundColor: "#fafafa",
  borderRadius: "8px",
  padding: "12px 16px",
  border: "1px solid #f4f4f5",
  marginBottom: "16px",
}

const table = {
  width: "100%",
  fontSize: "13px",
  lineHeight: "22px",
}

const labelCell = {
  width: "65px",
  color: "#71717a",
  fontWeight: "500",
  verticalAlign: "top",
  padding: "3px 0",
}

const valueCell = {
  color: "#09090b",
  fontWeight: "600",
  verticalAlign: "top",
  padding: "3px 0",
}

const messageBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  padding: "14px 16px",
  marginBottom: "16px",
}

const messageLabel = {
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.05em",
  color: "#a1a1aa",
  margin: "0 0 6px 0",
}

const messageText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#27272a",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
}

const buttonSection = {
  textAlign: "center" as const,
  marginTop: "20px",
  marginBottom: "12px",
}

const button = {
  backgroundColor: "#09090b",
  color: "#ffffff",
  borderRadius: "8px",
  padding: "12px 28px",
  fontSize: "13px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center" as const,
}

const divider = {
  borderColor: "#f4f4f5",
  margin: "24px 0 16px 0",
  borderWidth: "1px",
}

const footer = {
  textAlign: "center" as const,
}

const footerNotice = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: "0 0 4px 0",
  lineHeight: "18px",
}

const footerSub = {
  fontSize: "11px",
  color: "#d4d4d8",
  margin: "0",
}
