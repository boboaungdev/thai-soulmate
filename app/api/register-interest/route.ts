import { NextResponse } from "next/server"
import { z } from "zod"

import { APP_INFO, BASE_URL, EMAIL } from "@/constants"
import { transporter } from "@/lib/nodemailer"
import { calculateAge } from "@/lib/utils"

const formSchema = z.object({
  salutation: z.string(),
  name: z.string(),
  birthday: z.string(), // Dates are serialized as strings
  gender: z.string(),
  nationality: z.string(),
  location: z.string(),
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
      from: `"${APP_INFO.name}" <${EMAIL.noreply}>`,
      to: EMAIL.contact,
      subject: `New Interest Registration: ${validatedData.name}`,
      html: `
        <h1>New Interest Registration</h1>
        <p><strong>Name:</strong> ${validatedData.salutation} ${validatedData.name}</p>
        <p><strong>Date of Birth:</strong> ${birthDate.toLocaleDateString()} (Age: ${age})</p>
        <p><strong>Gender:</strong> ${validatedData.gender}</p>
        <p><strong>Nationality:</strong> ${validatedData.nationality}</p>
        <p><strong>Location:</strong> ${validatedData.location}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
      `,
    }

    // 2. Prepare the user confirmation email
    const userMailOptions = {
      from: `"${APP_INFO.name}" <${EMAIL.noreply}>`,
      to: validatedData.email,
      subject: `Thank you for your interest in ${APP_INFO.name}!`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #333;">Thank You for Registering!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${validatedData.salutation} ${validatedData.name},</p>
          <p>Thank you for registering your interest with <strong>${APP_INFO.name}</strong>. We're excited to have you on board!</p>
          <p>We have successfully received your details. A member of our matchmaking team will review your information and contact you as soon as possible to discuss the next steps.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${BASE_URL}" style="background-image: linear-gradient(to right, #cfa14f, #cb5d7a); color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Our Website</a>
          </div>
          <p>Best regards,<br>The ${APP_INFO.name} Team</p>
        </div>
        <div style="background-color: #f4f4f4; color: #666; padding: 15px; text-align: center; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} ${APP_INFO.name}. All rights reserved.</p>
          <p>${APP_INFO.name}</p>
        </div>
      </div>
    `,
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
