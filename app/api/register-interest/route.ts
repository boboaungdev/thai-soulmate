import { NextResponse } from "next/server"
import { z } from "zod"

import { APP_INFO, EMAIL } from "@/constants"
import { transporter } from "@/lib/nodemailer"
import {
  getAdminNotificationHtml,
  getUserConfirmationHtml,
} from "@/lib/email-templates"
import { calculateAge } from "@/lib/utils"

const formSchema = z.object({
  prefix: z.string(),
  name: z.string(),
  birthday: z.string(), // Dates are serialized as strings
  gender: z.string(),
  nationality: z.string(),
  currentLocation: z.string(),
  email: z.string().email(),
  phone: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = formSchema.parse(body)

    const birthDate = new Date(validatedData.birthday)
    const age = calculateAge(birthDate)

    // 1. Prepare the admin notification email
    const adminMailOptions = {
      from: `"${APP_INFO.name}" <${EMAIL.noreply}>`, // Use noreply for automated emails
      to: EMAIL.contact,
      subject: `New Interest Registration: ${validatedData.name}`,
      html: getAdminNotificationHtml({
        ...validatedData,
        age,
        location: validatedData.currentLocation,
      }),
    }

    // 2. Prepare the user confirmation email
    const userMailOptions = {
      from: `"${APP_INFO.name}" <${EMAIL.noreply}>`, // Use noreply for automated emails
      to: validatedData.email,
      subject: `Thank you for your interest in ${APP_INFO.name}!`,
      html: getUserConfirmationHtml(validatedData),
    }

    // 3. Send both emails
    try {
      await transporter.sendMail(adminMailOptions)
      await transporter.sendMail(userMailOptions)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Decide if you want to fail the whole request if emails fail
      return NextResponse.json(
        { success: false, error: "Form submitted but failed to send email." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid form data." },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
