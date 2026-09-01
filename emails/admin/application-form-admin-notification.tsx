import * as React from "react"
import { env } from "@/lib/env"
import { AdminNotification } from "../components/admin-notification-card"

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
}: AdminNotificationDetails) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"

  return (
    <AdminNotification
      previewText={`[Application Form] New application from ${name}`}
      category="Application Form"
      title="New Application Submitted"
      description="A candidate has submitted a new application on the website."
      fields={[
        { label: "Name", value: prefix ? `${prefix} ${name}` : name },
        { label: "Email", value: email },
      ]}
      buttonText="View in Dashboard"
      buttonUrl={`${baseUrl}/dashboard/application-form`}
    />
  )
}

export default ApplicationFormAdminNotificationEmail
