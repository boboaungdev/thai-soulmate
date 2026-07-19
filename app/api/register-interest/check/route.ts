import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is missing." },
        { status: 400 }
      )
    }

    const existingInterest = await prisma.registerInterest.findUnique({
      where: {
        email: email,
      },
    })

    return NextResponse.json({
      success: true,
      exists: !!existingInterest,
      interest: existingInterest,
    })
  } catch (error) {
    console.error("REGISTER INTEREST CHECK ERROR:", error)
    return NextResponse.json(
      { success: false, message: "Failed to check email existence." },
      { status: 500 }
    )
  }
}
