import { NextResponse } from "next/server"

import { resend } from "@/lib/resend"
import { SendFemaleProfileMemberEmail } from "@/emails/member/send-female-profile-member"
import { APP_INFO, BASE_URL, EMAIL } from "@/constants"
import { prisma } from "@/lib/prisma"
import { SoulmateStatus } from "@/lib/generated/prisma/enums"

type PersonalDetails = {
  email: string
  prefix: string
  name: string
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url)
  const { id: soulmateId } = await params
  const status = searchParams.get("status")

  if (!soulmateId) {
    return NextResponse.json(
      { success: false, message: "Missing soulmateId" },
      { status: 400 }
    )
  }

  if (!status) {
    // If no status is provided, return the soulmate data
    try {
      const soulmate = await prisma.soulmate.findUnique({
        where: { id: soulmateId },
        include: {
          male: {
            include: {
              profile: true,
            },
          },
          female: {
            include: {
              profile: true,
            },
          },
          notes: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })

      if (!soulmate) {
        return NextResponse.json(
          { success: false, message: "Soulmate not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, soulmate })
    } catch (error) {
      console.error("Error fetching soulmate:", error)
      return NextResponse.json(
        { success: false, message: "An unexpected error occurred." },
        { status: 500 }
      )
    }
  }

  // Existing logic for status updates (accepted/rejected)
  if (status !== "accepted" && status !== "rejected") {
    return NextResponse.redirect(
      `${BASE_URL}/action-feedback?error=Invalid status value`
    )
  }

  try {
    const soulmate = await prisma.soulmate.findUnique({
      where: { id: soulmateId },
      include: {
        male: {
          include: {
            profile: true,
          },
        },
        female: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!soulmate) {
      return NextResponse.redirect(
        `${BASE_URL}/action-feedback?error=Soulmate not found`
      )
    }

    // Assuming the flow is MALE_PROFILE_SENT_TO_FEMALE -> FEMALE_ACCEPTED/FEMALE_REJECT
    if (soulmate.status !== SoulmateStatus.MALE_PROFILE_SENT_TO_FEMALE) {
      return NextResponse.redirect(
        `${BASE_URL}/action-feedback?error=This action has already been processed or is not applicable at this stage.`
      )
    }

    const newStatus =
      status === "accepted"
        ? SoulmateStatus.FEMALE_ACCEPTED
        : SoulmateStatus.FEMALE_REJECT

    await prisma.soulmate.update({
      where: { id: soulmateId },
      data: { status: newStatus },
    })

    if (newStatus === SoulmateStatus.FEMALE_ACCEPTED) {
      // Send email to male
      const maleDetails = soulmate.male.personalDetails as PersonalDetails
      const femaleDetails = soulmate.female.personalDetails as PersonalDetails

      await resend.emails.send({
        from: `${APP_INFO.name} <${EMAIL.contact}>`,
        // to: [maleDetails.email`,
        to: ["boolean405@gmail.com"],
        subject: `[Soulmate] Good news from your potential soulmate!`,
        react: SendFemaleProfileMemberEmail({
          to: {
            prefix: maleDetails.prefix,
            name: maleDetails.name,
          },
          profileId: soulmate.female.profile!.id,
        }),
      })

      // Update soulmate status to FEMALE_PROFILE_SENT_TO_MALE
      await prisma.soulmate.update({
        where: { id: soulmateId },
        data: { status: SoulmateStatus.FEMALE_PROFILE_SENT_TO_MALE },
      })
    }

    return NextResponse.redirect(
      `${BASE_URL}/action-feedback?message=Your response has been recorded. Thank you!`
    )
  } catch (error) {
    console.error("Error processing soulmate status:", error)
    return NextResponse.redirect(
      `${BASE_URL}/action-feedback?error=An unexpected error occurred.`
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: soulmateId } = await params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Missing status" },
        { status: 400 }
      )
    }

    if (!Object.values(SoulmateStatus).includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      )
    }

    const soulmate = await prisma.soulmate.findUnique({
      where: { id: soulmateId },
      include: {
        male: {
          include: {
            profile: true,
          },
        },
        female: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!soulmate) {
      return NextResponse.json(
        { success: false, message: "Soulmate not found" },
        { status: 404 }
      )
    }

    const dataToUpdate: {
      status: SoulmateStatus
      closedFromStatus?: SoulmateStatus
    } = {
      status: status,
    }

    if (status === SoulmateStatus.CLOSED) {
      dataToUpdate.closedFromStatus = soulmate.status
    }

    let updatedSoulmate = await prisma.soulmate.update({
      where: { id: soulmateId },
      data: dataToUpdate,
      include: {
        male: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
          },
        },
        female: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
          },
        },
        notes: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (status === SoulmateStatus.FEMALE_ACCEPTED) {
      const maleDetails = soulmate.male.personalDetails as PersonalDetails
      const femaleDetails = soulmate.female.personalDetails as PersonalDetails

      await resend.emails.send({
        from: `${APP_INFO.name} <${EMAIL.contact}>`,
        // to: [maleDetails.email],
        to: ["boolean405@gmail.com"],
        subject: `[Soulmate] Good news from your potential soulmate!`,
        react: SendFemaleProfileMemberEmail({
          to: {
            prefix: maleDetails.prefix,
            name: maleDetails.name,
          },
          profileId: soulmate.female.profile!.id,
        }),
      })

      updatedSoulmate = await prisma.soulmate.update({
        where: { id: soulmateId },
        data: { status: SoulmateStatus.FEMALE_PROFILE_SENT_TO_MALE },
        include: {
          male: {
            select: {
              id: true,
              customId: true,
              personalDetails: true,
              photos: true,
            },
          },
          female: {
            select: {
              id: true,
              customId: true,
              personalDetails: true,
              photos: true,
            },
          },
          notes: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })
    }

    return NextResponse.json({ success: true, soulmate: updatedSoulmate })
  } catch (error) {
    console.error("Error updating soulmate status:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
