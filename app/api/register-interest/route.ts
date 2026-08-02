import { z } from "zod"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { APP_INFO, CONTACT, EMAIL } from "@/constants"
import { resend } from "@/lib/resend"
import { AdminNotificationEmail, UserConfirmationEmail } from "@/emails"
import { calculateAge } from "@/lib/date"

const formSchema = z.object({
  prefix: z.string(),
  name: z.string().transform((val) =>
    val
      .trim()
      .split(" ")
      .filter(Boolean) // Removes empty strings from multiple spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  ),
  dob: z.string(),
  gender: z.string(),
  nationality: z.string(),
  currentLocation: z.string(),
  email: z.email().transform((val) => val.toLowerCase()),

  phoneCountry: z.string(),
  phone: z.string(),

  source: z.string(),
  otherSource: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = formSchema.parse(body)

    const existingAppForm = await prisma.applicationForm.findFirst({
      where: {
        personalDetails: {
          path: ["email"],
          equals: validatedData.email,
        },
      },
    })

    if (existingAppForm) {
      return NextResponse.json(
        {
          success: false,
          error: "This email has already been registered application.",
        },
        { status: 409 }
      )
    }

    const birthDate = new Date(validatedData.dob)

    const interestData = {
      prefix: validatedData.prefix,
      name: validatedData.name,
      dob: birthDate,
      gender: validatedData.gender,
      nationality: validatedData.nationality,
      currentLocation: validatedData.currentLocation,
      phoneCountry: validatedData.phoneCountry,
      phone: validatedData.phone,
      source: validatedData.source,
      otherSource: validatedData.otherSource,
    }

    // Save registration to database
    try {
      await prisma.registerInterest.upsert({
        where: {
          email: validatedData.email,
        },
        update: interestData,
        create: {
          email: validatedData.email,
          ...interestData,
        },
      })
    } catch (dbError) {
      console.error("Database error:", dbError)

      return NextResponse.json(
        {
          success: false,
          error: "Failed to save registration.",
        },
        { status: 500 }
      )
    }

    try {
      await Promise.all([
        resend.emails.send({
          from: `"${APP_INFO.name}" <${EMAIL.contact}>`,
          to: [CONTACT.email],
          subject: `New Interest Registration: ${validatedData.name}`,
          react: AdminNotificationEmail({
            ...validatedData,
            age: calculateAge(validatedData.dob),
            location: validatedData.currentLocation,
          }),
        }),
        resend.emails.send({
          from: `"${APP_INFO.name}" <${EMAIL.contact}>`,
          to: validatedData.email,
          subject: `Thank you for your interest in ${APP_INFO.name}!`,
          react: UserConfirmationEmail(validatedData),
        }),
      ])
    } catch (emailError) {
      console.error("Email error:", emailError)

      // Registration is already saved, so just report the email issue.
      return NextResponse.json({
        success: true,
        warning:
          "Your registration has been received, but we couldn't send the confirmation email.",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully.",
    })
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data.",
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const registerInterests = await prisma.registerInterest.findMany({
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
      },
    })
    return NextResponse.json(registerInterests)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
