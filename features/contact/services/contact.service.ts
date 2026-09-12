import { resend } from "@/lib/resend"
import { APP_INFO, EMAIL } from "@/constants"
import { ContactFormAdminNotificationEmail } from "@/emails"
import type { ContactFormData } from "../schemas/contact.schema"

export async function sendContactNotification(data: ContactFormData) {
  try {
    const { data: resendData, error } = await resend.emails.send({
      from: `"${APP_INFO.name} - Notification" <${EMAIL.notify}>`,
      to: EMAIL.NOTIFICATIONS,
      subject: `[Contact Form] New Message from ${data.name}: ${data.subject}`,
      react: ContactFormAdminNotificationEmail(data),
    })

    if (error) {
      console.error("Resend contact notification error:", error)
      return { ok: false, error: error.message }
    }

    return { ok: true, data: resendData }
  } catch (err: any) {
    console.error("Failed to send contact notification:", err)
    return { ok: false, error: err?.message || "Failed to dispatch email notification." }
  }
}
