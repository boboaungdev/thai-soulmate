import * as React from "react"
import { env } from "@/lib/env"
import { AdminNotification } from "@/features/shared/emails"

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
  phone,
  phoneCountry,
  currentLocation,
  relationshipGoal,
  preferredContactDate,
  preferredContactTime,
}: AdminNotificationDetails) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const dashboardUrl = `${baseUrl}/dashboard/register-interest`

  const fields = [
    {
      label: "Client Name",
      value: [prefix, name].filter(Boolean).join(" "),
    },
    {
      label: "Email Address",
      value: email,
    },
    {
      label: "Phone / WhatsApp",
      value: [phoneCountry, phone].filter(Boolean).join(" "),
    },
    {
      label: "Current Location",
      value: currentLocation || "Not specified",
    },
    {
      label: "Relationship Goal",
      value: relationshipGoal || "Not specified",
    },
    {
      label: "Preferred Contact Time",
      value:
        preferredContactDate && preferredContactTime
          ? `${preferredContactDate} • ${preferredContactTime} (ICT)`
          : "Not specified",
    },
  ]

  return (
    <AdminNotification
      previewText={`New Interest Registration: ${name}`}
      category="Register Interest"
      title="New Interest Registration"
      description="A prospective client has submitted an initial consultation request."
      fields={fields}
      buttonText="View in Dashboard"
      buttonUrl={dashboardUrl}
    />
  )
}

export default RegisterInterestAdminNotificationEmail
