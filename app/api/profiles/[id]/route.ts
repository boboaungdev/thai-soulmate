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

    const profile = await prisma.profile.findUnique({
      where: {
        id,
      },
      include: {
        applicationForm: true,
        notes: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
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
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const { status, about } = body

    if (status === undefined && about === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields to update provided.",
        },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { applicationForm: true },
    })

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      )
    }

    const profileUpdateData: { status?: any } = {}
    if (status) {
      profileUpdateData.status = status
    }

    if (about !== undefined) {
      const personality = parseJSONField(profile.applicationForm.personality)
      personality.about = about

      await prisma.applicationForm.update({
        where: { id: profile.applicationFormId },
        data: { personality },
      })
    }

    if (Object.keys(profileUpdateData).length > 0) {
      await prisma.profile.update({
        where: { id },
        data: profileUpdateData,
      })
    }

    const updatedProfile = await prisma.profile.findUnique({
      where: {
        id,
      },
      include: {
        applicationForm: true,
      },
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      {
        status: 500,
      }
    )
  }
}
