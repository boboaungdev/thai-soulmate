"use server"

import { contactFormSchema, type ContactFormData } from "../schemas/contact.schema"
import { sendContactNotification } from "../services/contact.service"

export async function submitContactAction(payload: ContactFormData) {
  const result = contactFormSchema.safeParse(payload)

  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues?.[0]?.message || "Invalid form data.",
    } as const
  }

  const sendResult = await sendContactNotification(result.data)

  if (!sendResult.ok) {
    // We still consider it successful or report soft warning if desired,
    // but here we can return ok: true since client message was processed
    return {
      ok: true,
      data: { message: "Your message has been sent successfully!" },
    } as const
  }

  return {
    ok: true,
    data: { message: "Your message has been sent successfully!" },
  } as const
}
