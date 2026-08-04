import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        applicationForm: {
          include: {
            membership: true,
          },
        },
      },
      orderBy: {
        customId: "asc",
      },
    })

    // The 'photos' are on the ApplicationForm, but as a Json type.
    // The client-side components expect 'photos' to be an object.
    // The prisma client will return it as a JSON object, so no transformation is needed here.
    // personalDetails is also a Json field on ApplicationForm, handled similarly.

    const data = profiles.map(p => ({
      ...p,
      ...p.applicationForm, // flatten applicationForm props
      id: p.id, // keep profile id
      customId: p.customId, // keep profile customId
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
