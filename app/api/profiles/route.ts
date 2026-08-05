import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        notes: true,
        applicationForm: {
          include: {
            membership: true,
          },
        },
      },
      orderBy: {
        applicationForm: {
          customId: "asc",
        },
      },
    })

    const data = profiles.map(({ applicationForm, ...profile }) => ({
      ...applicationForm,
      ...profile,
    }))

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Fetch profiles error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profiles",
      },
      { status: 500 }
    )
  }
}
