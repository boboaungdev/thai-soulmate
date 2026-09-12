import * as React from "react"
import { env } from "@/lib/env"
import { AdminNotification } from "@/features/shared/emails"

type AdminNotificationDetails = {
  prefix?: string
  name: string
  email: string
  [key: string]: any
}

export const ApplicationFormAdminNotificationEmail = ({
  prefix,
  name,
  email,
  ...rest
}: AdminNotificationDetails) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const dashboardUrl = `${baseUrl}/dashboard/application-form`

  const fields = [
    {
      label: "Full Name",
      value: [prefix, name].filter(Boolean).join(" "),
    },
    {
      label: "Email Address",
      value: email,
    },
  ]

  return (
    <AdminNotification
      previewText={`New Application Form: ${name}`}
      category="Application Form"
      title="New Application Submitted"
      description="A full profile application has been received and is ready for matchmaker review."
      fields={fields}
      buttonText="Review Application"
      buttonUrl={dashboardUrl}
    />
  )
}

export default ApplicationFormAdminNotificationEmail
