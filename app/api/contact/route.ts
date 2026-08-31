import { z } from "zod"
import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { CONTACT, EMAIL } from "@/constants"
import { ContactFormAdminNotificationEmail } from "@/emails"
import { prisma } from "@/lib/prisma"

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

    const targetContactEmail = CONTACT.email || "contact@thaisoulmate.org"
    const escapedMessage = validatedData.message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

    const bodyHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b;">
  <p style="margin: 0; white-space: pre-wrap;">${escapedMessage}</p>
</div>`

    // Send email to contact@thaisoulmate.org via Resend using React Email component
    let resendEmailId: string | null = null
    try {
      const { data, error } = await resend.emails.send({
        from: `"${validatedData.name}" <${EMAIL.notify}>`,
        to: EMAIL.NOTIFICATIONS,
        // to: [targetContactEmail],
        replyTo: validatedData.email,
        subject: validatedData.subject,
        react: ContactFormAdminNotificationEmail(validatedData),
      })

      if (error) {
        console.error("Resend email error:", error)
      } else if (data?.id) {
        resendEmailId = data.id
      }
    } catch (resendErr) {
      console.warn("Resend notification error (continuing save):", resendErr)
    }

    const preview = validatedData.message.slice(0, 200)

    // Save EmailMessage directly in contact@thaisoulmate.org Inbox
    await prisma.emailMessage.create({
      data: {
        id: crypto.randomUUID(),
        resendId: resendEmailId,
        mailbox: "contact",
        folder: "INBOX",
        direction: "INBOUND",
        fromEmail: validatedData.email,
        fromName: validatedData.name,
        toEmails: [targetContactEmail],
        ccEmails: [],
        bccEmails: [],
        replyTo: validatedData.email,
        subject: validatedData.subject,
        preview: preview,
        bodyText: validatedData.message,
        bodyHtml: bodyHtml,
        isRead: false,
        isStarred: false,
        isArchived: false,
        isTrash: false,
        receivedAt: new Date(),
      },
    })

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
