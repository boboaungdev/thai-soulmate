import * as React from "react"
import { env } from "@/lib/env"
import { AdminNotification } from "../components/admin-notification-card"

type AdminNotificationDetails = {
  prefix?: string
  name: string
  email: string
  [key: string]: any
}

export const RegisterInterestAdminNotificationEmail = ({
  prefix,
  name,
  email,
}: AdminNotificationDetails) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"

  return (
    <AdminNotification
      previewText={`[Register Interest] New registration from ${name}`}
      category="Register Interest"
      title="New Interest Registration"
      description="A new visitor has registered their interest on the website."
      fields={[
        { label: "Name", value: prefix ? `${prefix} ${name}` : name },
        { label: "Email", value: email },
      ]}
      buttonText="View in Dashboard"
      buttonUrl={`${baseUrl}/dashboard/register-interest`}
    />
  )
}

export default RegisterInterestAdminNotificationEmail
