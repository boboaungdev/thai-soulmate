import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

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
  dob: z.string(),
  gender: z.string(),
  nationality: z.string(),
  currentLocation: z.string(),
  email: z.string().email(),

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
        contact: {
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

    const existingInterest = await prisma.registerInterest.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    const birthDate = new Date(validatedData.dob)
    const age = calculateAge(birthDate)

    // Save registration to database
    try {
      await prisma.registerInterest.create({
        data: {
          prefix: validatedData.prefix,
          name: validatedData.name,
          dob: birthDate,
          gender: validatedData.gender,
          nationality: validatedData.nationality,
          currentLocation: validatedData.currentLocation,
          email: validatedData.email,
          phoneCountry: validatedData.phoneCountry,
          phone: validatedData.phone,
          source: validatedData.source,
          otherSource: validatedData.otherSource,
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

    const adminMailOptions = {
      from: `"${APP_INFO.name}" <${EMAIL.noreply}>`,
      to: EMAIL.contact,
      subject: `New Interest Registration: ${validatedData.name}`,
      html: getAdminNotificationHtml({
        ...validatedData,
        age,
        location: validatedData.currentLocation,
      }),
    }

    const userMailOptions = {
      from: `"${APP_INFO.name}" <${EMAIL.noreply}>`,
      to: validatedData.email,
      subject: `Thank you for your interest in ${APP_INFO.name}!`,
      html: getUserConfirmationHtml(validatedData),
    }

    try {
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10

    const skip = (page - 1) * limit

    const [interests, total] = await Promise.all([
      prisma.registerInterest.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.registerInterest.count(),
    ])

    return NextResponse.json({
      success: true,
      data: interests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Fetch register interests error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch registrations.",
      },
      { status: 500 }
    )
  }
}
