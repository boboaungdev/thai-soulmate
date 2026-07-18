import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all applications
export async function GET() {
  try {
    const applications = await prisma.applicationForm.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      applications,
    })
  } catch (error) {
    console.error("GET APPLICATION ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch applications",
      },
      {
        status: 500,
      }
    )
  }
}

// POST application
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const application = await prisma.applicationForm.create({
      data: {
        personalDetails: body.details,

        contact: {
          email: body.details.email,
          phone: body.details.phone,
          nationality: body.details.nationality,
          currentLocation: body.details.currentLocation,
        },

        career: {
          occupation: body.profile.occupation,
          company: body.profile.company,
          education: body.profile.education,
        },

        appearance: {
          height: body.profile.height,
          weight: body.profile.weight,
          religion: body.profile.religion,
        },

        personality: {
          personality: body.profile.personality,
          about: body.profile.about,
          bestQualities: body.profile.bestQualities,
          lookingForQualities: body.profile.lookingForQualities,
        },

        lifestyle: {
          lifestyle: body.profile.lifestyle,
          smoking: body.profile.smoking,
          drinking: body.profile.drinking,
          exercise: body.profile.exercise,
          interests: body.profile.interests,
        },

        relationshipGoals: body.relationshipGoals,

        idealPartner: {
          ageRange: body.profile.idealPartnerAgeRange,

          nationality: body.profile.idealPartnerNationality,

          location: body.profile.idealPartnerLocation,

          height: body.profile.idealPartnerHeight,

          education: body.profile.idealPartnerEducation,

          personality: body.profile.idealPartnerPersonality,

          qualities: body.profile.idealPartnerQualities,

          dealBreakers: body.profile.dealBreakers,
        },

        financial: body.financial,

        photos: body.photos,
      },
    })

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error) {
    console.error("CREATE APPLICATION ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed",
      },
      {
        status: 500,
      }
    )
  }
}
