import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const registerInterests = await prisma.registerInterest.findMany()
    return NextResponse.json(registerInterests)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
