import { Resend } from "resend"
import { NextResponse } from "next/server"
import { z } from "zod"

import { APP_INFO, RESEND } from "@/constants"
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

const resend = new Resend(RESEND.API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = formSchema.parse(body)

    const birthDate = new Date(validatedData.birthday)
    const age = calculateAge(birthDate)

    await resend.emails.send({
      from: `${APP_INFO.name} <onboarding@resend.dev>`, // IMPORTANT: Replace with your verified domain
      to: RESEND.EMAIL_ADDRESS,
      subject: "New Interest Registration",
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
    })

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
