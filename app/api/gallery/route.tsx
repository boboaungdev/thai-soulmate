import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const applicationForms = await prisma.applicationForm.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: applicationForms,
    })
  } catch (error) {
    console.error("Fetch application forms error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch application forms",
      },
      {
        status: 500,
      }
    )
  }
}
