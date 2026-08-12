import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BASE_URL } from "@/constants"

export async function GET() {
  try {
    const soulmates = await prisma.soulmate.findMany({
      include: {
        male: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
            profile: true,
          },
        },
        female: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
            profile: true,
          },
        },
        notes: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      soulmates,
    })
  } catch (error) {
    console.error("GET SOULMATES ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch soulmates",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { maleId, femaleId } = body

    if (!maleId || !femaleId) {
      return NextResponse.json(
        {
          success: false,
          message: "maleId and femaleId are required",
        },
        {
          status: 400,
        }
      )
    }

    // Check if a soulmate connection already exists
    // Check if an active soulmate connection already exists
    const existingSoulmate = await prisma.soulmate.findFirst({
      where: {
        OR: [
          {
            maleId,
            femaleId,
          },
          {
            maleId: femaleId,
            femaleId: maleId,
          },
        ],
        status: {
          not: "CLOSED",
        },
      },
    })

    if (existingSoulmate) {
      return NextResponse.json(
        {
          success: false,
          message: "These soulmates are already actively connected.",
        },
        { status: 409 }
      )
    }

    const soulmate = await prisma.soulmate.create({
      data: {
        maleId,
        femaleId,
      },
    })

    // --- NEW LOGIC: Send male profile to female after soulmate creation ---
    const maleApplicationForm = await prisma.applicationForm.findUnique({
      where: { id: maleId },
      select: {
        id: true,
        customId: true,
        personalDetails: true,
        profile: { select: { id: true } }, // Need profile.id for print URL
      },
    })

    const femaleApplicationForm = await prisma.applicationForm.findUnique({
      where: { id: femaleId },
      select: {
        personalDetails: true,
      },
    })

    if (!maleApplicationForm || !femaleApplicationForm) {
      console.error(
        "Application forms not found for maleId or femaleId after soulmate creation."
      )
      // Potentially revert soulmate creation or just log and proceed with existing response
      // For now, we'll log and return success without sending profile.
      return NextResponse.json({
        success: true,
        soulmate,
        message:
          "Soulmate created, but failed to find application forms for profile sending.",
      })
    }

    type PersonalDetails = {
      email: string
      prefix: string
      name: string
      gender: string
    }

    const toFemale = femaleApplicationForm.personalDetails as PersonalDetails
    const maleAppForSend = maleApplicationForm // This is the application whose profile we are sending

    // Call the internal API route to send the profile
    const sendProfileResponse = await fetch(
      `${BASE_URL}/api/soulmates/${soulmate.id}/send-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application: maleAppForSend,
          to: toFemale,
        }),
      }
    )

    if (sendProfileResponse.ok) {
      console.log(
        `Male profile for soulmate ${soulmate.id} successfully sent to female.`
      )
      // Update soulmate status to indicate male profile has been sent to female
      await prisma.soulmate.update({
        where: { id: soulmate.id },
        data: { status: "MALE_PROFILE_SENT_TO_FEMALE" },
      })
    } else {
      console.error(
        `Failed to send male profile for soulmate ${
          soulmate.id
        }: ${await sendProfileResponse.text()}`
      )
      // Log the error but still return success for soulmate creation
    }
    // --- END NEW LOGIC ---

    return NextResponse.json({
      success: true,
      soulmate,
    })
  } catch (error) {
    console.error("CREATE SOULMATE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create soulmate",
      },
      {
        status: 500,
      }
    )
  }
}
