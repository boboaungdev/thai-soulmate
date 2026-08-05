import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Helper function to safely parse JSON
function parseJSONField(field: any): any {
  if (typeof field === "string") {
    try {
      return JSON.parse(field)
    } catch (error) {
      console.error("Failed to parse JSON field:", error)
      return {}
    }
  }
  return field || {}
}

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const { id } = await context.params

    const application = await prisma.applicationForm.findUnique({
      where: {
        id,
      },
    })

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        {
          status: 404,
        }
      )
    }

    const parsedApplication = {
      ...application,
      personalDetails: parseJSONField(application.personalDetails),
      career: parseJSONField(application.career),
      appearance: parseJSONField(application.appearance),
      personality: parseJSONField(application.personality),
      lifestyle: parseJSONField(application.lifestyle),
      relationshipGoals: parseJSONField(application.relationshipGoals),
      idealPartner: parseJSONField(application.idealPartner),
      financial: parseJSONField(application.financial),
      photos: parseJSONField(application.photos),
    }

    return NextResponse.json({
      success: true,
      application: parsedApplication,
    })
  } catch (error) {
    console.error("GET GALLERY APPLICATION ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery application",
      },
      {
        status: 500,
      }
    )
  }
}

export async function PATCH(
  req: Request,
  context: {
    params: {
      id: string
    }
  }
) {
  try {
    const { id } = context.params
    const { status } = await req.json()

    const profile = await prisma.profile.findFirst({
      where: {
        applicationFormId: id,
      },
    })

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile not found",
        },
        {
          status: 404,
        }
      )
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        status,
      },
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("UPDATE PROFILE STATUS ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile status",
      },
      {
        status: 500,
      }
    )
  }
}
