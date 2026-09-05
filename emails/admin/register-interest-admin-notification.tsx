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
  phone,
  phoneCountry,
  currentLocation,
  relationshipGoal,
  preferredContactTime,
}: AdminNotificationDetails) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"

  const fields: { label: string; value: string }[] = [
    { label: "Name", value: prefix ? `${prefix} ${name}` : name },
    { label: "Email", value: email },
  ]

  if (phone) {
    fields.push({
      label: "Phone",
      value: `${phoneCountry || ""} ${phone}`.trim(),
    })
  }

  if (currentLocation) {
    fields.push({ label: "Location", value: currentLocation })
  }

  if (relationshipGoal) {
    fields.push({ label: "Looking For", value: relationshipGoal })
  }

  if (preferredContactTime) {
    fields.push({ label: "Preferred Time", value: preferredContactTime })
  }

  return (
    <AdminNotification
      previewText={`[Consultation] New consultation request from ${name}`}
      category="Consultation Request"
      title="New Consultation Request"
      description="A visitor has requested a confidential matchmaking consultation."
      fields={fields}
      buttonText="View in Dashboard"
      buttonUrl={`${baseUrl}/dashboard/register-interest`}
    />
  )
}

export default RegisterInterestAdminNotificationEmail
