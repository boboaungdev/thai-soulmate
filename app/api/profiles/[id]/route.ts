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
    params: {
      id: string
    }
  }
) {
  try {
    const { id } = context.params

    const profile = await prisma.profile.findFirst({
      where: {
        applicationFormId: id,
      },
      include: {
        applicationForm: true,
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

    const parsedApplication = {
      ...profile.applicationForm,
      personalDetails: parseJSONField(profile.applicationForm.personalDetails),
      career: parseJSONField(profile.applicationForm.career),
      appearance: parseJSONField(profile.applicationForm.appearance),
      personality: parseJSONField(profile.applicationForm.personality),
      lifestyle: parseJSONField(profile.applicationForm.lifestyle),
      relationshipGoals: parseJSONField(
        profile.applicationForm.relationshipGoals
      ),
      idealPartner: parseJSONField(profile.applicationForm.idealPartner),
      financial: parseJSONField(profile.applicationForm.financial),
      photos: parseJSONField(profile.applicationForm.photos),
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        applicationForm: parsedApplication,
      },
    })
  } catch (error) {
    console.error("GET PROFILE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile",
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
