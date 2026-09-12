import { z } from "zod"
import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { APP_INFO, CONTACT, EMAIL } from "@/constants"
import { ContactFormAdminNotificationEmail } from "@/emails"

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z
    .email({ message: "A valid email is required." })
    .transform((val) => val.trim().toLowerCase()),
  subject: z.string().min(5, { message: "Subject is required." }),
  message: z.string().min(10, { message: "Message is required." }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = contactFormSchema.parse(body)

    try {
      const { data, error } = await resend.emails.send({
        from: `"${APP_INFO.name} - Notification" <${EMAIL.notify}>`,
        to: EMAIL.NOTIFICATIONS,
        // to: [targetContactEmail],
        subject: `[Contact Form] New Message from ${validatedData.name}: ${validatedData.subject}`,
        react: ContactFormAdminNotificationEmail(validatedData),
      })

      console.log("Resend email response:", data)

      if (error) {
        console.error("Resend email error:", error)
      }
    } catch (resendErr) {
      console.warn("Resend notification error (continuing save):", resendErr)
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    })
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid form data.", details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    )
  }
}
