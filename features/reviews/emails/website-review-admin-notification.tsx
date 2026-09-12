import * as React from "react"
import { env } from "@/lib/env"
import { AdminNotification } from "@/features/shared/emails"

export const WebsiteReviewAdminNotificationEmail = ({
  reviewerInfo,
}: {
  reviewerInfo?: {
    name: string
    email: string
  }
}) => {
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const dashboardUrl = `${baseUrl}/dashboard/website-review`

  const fields = [
    {
      label: "Reviewer",
      value: reviewerInfo?.name || "Anonymous",
    },
    {
      label: "Email Address",
      value: reviewerInfo?.email || "Not provided",
    },
  ]

  return (
    <AdminNotification
      previewText="New Website Review Submitted"
      category="Website Review"
      title="New Review Received"
      description="A client has submitted feedback and rating on our service."
      fields={fields}
      buttonText="View All Reviews"
      buttonUrl={dashboardUrl}
    />
  )
}

export default WebsiteReviewAdminNotificationEmail
