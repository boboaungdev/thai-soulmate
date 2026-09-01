import * as React from "react"
import { env } from "@/lib/env"
import { AdminNotification } from "../components/admin-notification-card"

type ContactFormNotificationDetails = {
  name: string
  email: string
  subject: string
  message: string
}

export const ContactFormAdminNotificationEmail = ({
  name,
  email,
  subject,
  message,
}: ContactFormNotificationDetails) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"

  return (
    <AdminNotification
      previewText={`[Contact Form] ${subject}`}
      category="Contact Form"
      title="New Contact Message"
      description="A new message was submitted via the website contact form."
      fields={[
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Subject", value: subject },
      ]}
      messagePreview={message}
      buttonText="View in Email Inbox"
      buttonUrl={`${baseUrl}/dashboard/email/contact/inbox`}
    />
  )
}

export default ContactFormAdminNotificationEmail
