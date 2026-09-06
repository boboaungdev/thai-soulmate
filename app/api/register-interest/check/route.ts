import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")?.trim()

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is missing." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase()

    // 1. Check if an application form has already been submitted for this email
    let existingApplication = await prisma.applicationForm.findFirst({
      where: {
        personalDetails: {
          path: ["email"],
          equals: normalizedEmail,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        customId: true,
        status: true,
        personalDetails: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!existingApplication) {
      existingApplication = await prisma.applicationForm.findFirst({
        where: {
          personalDetails: {
            path: ["email"],
            equals: email,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          customId: true,
          status: true,
          personalDetails: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    }

    // 2. Check register interest records
    const existingInterest = await prisma.registerInterest.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { email: email }],
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      exists: !!existingApplication || !!existingInterest,
      hasApplication: !!existingApplication,
      application: existingApplication,
      interest: existingInterest,
    })
  } catch (error) {
    console.error("REGISTER INTEREST & APPLICATION CHECK ERROR:", error)
    return NextResponse.json(
      { success: false, message: "Failed to check email existence." },
      { status: 500 }
    )
  }
}
