import * as React from "react"
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
      buttonText="Reply via Email"
      buttonUrl={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
    />
  )
}

export default ContactFormAdminNotificationEmail
