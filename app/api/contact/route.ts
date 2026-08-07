// app/api/contact/route.ts
import { z } from "zod"
import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { APP_INFO, CONTACT, EMAIL } from "@/constants"
import { ContactFormNotificationEmail } from "@/emails"

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  subject: z.string().min(5, { message: "Subject is required." }),
  message: z.string().min(10, { message: "Message is required." }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = contactFormSchema.parse(body)

    // Send email to admin
    const { data, error } = await resend.emails.send({
      from: `"${APP_INFO.name}" <${EMAIL.notify}>`,
      to: [CONTACT.email],
      replyTo: validatedData.email, // Reply to the user's email
      subject: `[Contact Form] New Message from ${validatedData.name}: ${validatedData.subject}`,
      react: ContactFormNotificationEmail({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      }),
    })

    if (error) {
      console.error("Resend email error:", error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log("Contact form email sent:", data?.id)

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
