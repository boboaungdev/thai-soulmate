import { redirect } from "next/navigation"
import { EMAIL_ACCOUNTS } from "@/constants/email"

export default function EmailDefaultPage() {
  const defaultAccountId = EMAIL_ACCOUNTS[0]?.id || "socials"
  redirect(`/dashboard/email/${defaultAccountId}/inbox`)
}
