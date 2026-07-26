import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const applicationForms = await prisma.applicationForm.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    const femaleApplicationForms = applicationForms.filter((form) => {
      const personalDetails = form.personalDetails as any // Cast to any to access properties
      return personalDetails && personalDetails.gender === "Female"
    })

    return NextResponse.json({
      success: true,
      data: femaleApplicationForms,
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
