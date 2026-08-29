import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { isDisallowedEmail } from "@/constants/email"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    if (isDisallowedEmail(email)) {
      return NextResponse.json({
        success: true,
        exists: true,
        available: false,
        reason: "reserved",
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    return NextResponse.json({
      success: true,
      exists: Boolean(existingUser),
      available: !existingUser,
    })
  } catch (error) {
    console.error("Check email error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check email availability" },
      { status: 500 }
    )
  }
}
