import * as React from "react"
import { env } from "@/lib/env"
import { AdminNotification } from "./admin-notification-card"

export const WebsiteReviewAdminNotificationEmail = ({
  reviewerInfo,
}: {
  reviewerInfo?: {
    name: string
    email: string
  }
}) => {
  const baseUrl = env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"

  return (
    <AdminNotification
      previewText={`[Website Review] ${reviewerInfo?.name || "New Review"}`}
      category="Website Review"
      title="New Review Received"
      description="A visitor has submitted a new review on the website."
      fields={[
        { label: "Name", value: reviewerInfo?.name || "Anonymous" },
        ...(reviewerInfo?.email
          ? [{ label: "Email", value: reviewerInfo.email }]
          : []),
      ]}
      buttonText="View in Dashboard"
      buttonUrl={`${baseUrl}/dashboard/website-review`}
    />
  )
}

export default WebsiteReviewAdminNotificationEmail
