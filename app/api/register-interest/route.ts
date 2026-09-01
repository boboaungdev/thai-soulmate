import { z } from "zod"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { APP_INFO, CONTACT, EMAIL } from "@/constants"
import { resend } from "@/lib/resend"
import {
  RegisterInterestAdminNotificationEmail,
  RegisterInterestMemberConfirmationEmail,
} from "@/emails"
import { calculateAge, formatDate } from "@/lib/date"
import TestEmailWithSignature from "@/emails/test/test-mail-with-signature"

const PREFERRED_CONTACT_TIMES = [
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
] as const

const formSchema = z.object({
  prefix: z.string(),

  name: z.string().transform((val) =>
    val
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  ),

  dob: z.string(),

  gender: z.string(),

  nationality: z.string(),

  nationalityRegion: z.string(),

  currentLocation: z.string(),

  currentLocationRegion: z.string(),

  email: z.email().transform((val) => val.toLowerCase()),

  phoneCountry: z.string(),

  phone: z.string(),

  source: z.string(),

  otherSource: z.string().optional(),

  preferredContactDate: z.coerce.date({
    message: "Invalid preferred contact date.",
  }),
  preferredContactTime: z.enum(PREFERRED_CONTACT_TIMES, {
    message: "Please select a preferred contact time.",
  }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validatedData = formSchema.parse(body)

    // -----------------------------------------
    // CHECK EXISTING APPLICATION
    // -----------------------------------------

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

    // -----------------------------------------
    // DOB
    // -----------------------------------------

    const birthDate = new Date(validatedData.dob)

    // -----------------------------------------
    // PREFERRED CONTACT DATE
    // -----------------------------------------

    const preferredContactDate = validatedData.preferredContactDate
    // -----------------------------------------
    // DATABASE DATA
    // -----------------------------------------

    const interestData = {
      prefix: validatedData.prefix,

      name: validatedData.name,

      dob: birthDate,

      gender: validatedData.gender,

      nationality: validatedData.nationality,

      nationalityRegion: validatedData.nationalityRegion,

      currentLocation: validatedData.currentLocation,

      currentLocationRegion: validatedData.currentLocationRegion,

      phoneCountry: validatedData.phoneCountry,

      phone: validatedData.phone,

      preferredContactDate,

      preferredContactTime: validatedData.preferredContactTime,

      source: validatedData.source,

      otherSource: validatedData.otherSource,
    }

    // -----------------------------------------
    // USER CONFIRMATION EMAIL
    // -----------------------------------------

    const { data: userData, error: userError } = await resend.emails.send({
      from: `"${APP_INFO.name}" <${EMAIL.notify}>`,

      to: validatedData.email,

      replyTo: EMAIL.contact,

      subject: `[Register Interest] Thank you for your interest in ${APP_INFO.name}!`,

      react: TestEmailWithSignature({
        ...validatedData,

        preferredContactDate: formatDate(preferredContactDate),

        preferredContactTime: validatedData.preferredContactTime,
      }),
    })

    if (userError) {
      console.error("User email failed:", userError)

      return NextResponse.json(
        {
          success: false,
          error:
            "We couldn't send your confirmation email. Please check your email address and try again.",
        },
        { status: 500 }
      )
    }

    console.log("User email sent:", userData?.id)

    // -----------------------------------------
    // SAVE TO DATABASE
    // -----------------------------------------

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
          error: "Email sent, but failed to save your registration.",
        },
        { status: 500 }
      )
    }

    // -----------------------------------------
    // ADMIN NOTIFICATION
    // -----------------------------------------

    // const { data: adminData, error: adminError } = await resend.emails.send({
    //   from: `"${APP_INFO.name}" <${EMAIL.notify}>`,

    //   // Change this to CONTACT.email when ready
    //   to: [CONTACT.email],

    //   // to: ["boolean405@gmail.com"],

    //   replyTo: validatedData.email,

    //   subject: `[Register Interest] New Interest Registration from ${validatedData.prefix} ${validatedData.name}`,

    //   react: RegisterInterestAdminNotificationEmail({
    //     ...validatedData,

    //     age: calculateAge(validatedData.dob),

    //     location: validatedData.currentLocation,

    //     preferredContactDate: formatDate(preferredContactDate),

    //     preferredContactTime: validatedData.preferredContactTime,
    //   }),
    // })

    // console.log("Admin email sent:", adminData?.id)

    // if (adminError) {
    //   console.error("Admin email failed:", adminError)

    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Registration completed, but admin notification failed.",
    //     },
    //     { status: 500 }
    //   )
    // }

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

// -----------------------------------------
// GET REGISTER INTERESTS
// -----------------------------------------

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

      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(registerInterests)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    )
  }
}
