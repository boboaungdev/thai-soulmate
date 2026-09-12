import * as React from "react"
import { AdminNotification } from "@/features/shared/emails"

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
  const fields = [
    {
      label: "Name",
      value: name,
    },
    {
      label: "Email Address",
      value: email,
    },
    {
      label: "Subject",
      value: subject,
    },
  ]

  return (
    <AdminNotification
      previewText={`New Inquiry: ${subject} (${name})`}
      category="Contact Form"
      title="New Inquiry Received"
      description="A new message was submitted via the website contact form."
      fields={fields}
      messagePreview={message}
      buttonText="Reply by Email"
      buttonUrl={`mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`}
    />
  )
}

export default ContactFormAdminNotificationEmail
