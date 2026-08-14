import { NextResponse } from "next/server"

import { resend } from "@/lib/resend"
import { SendFemaleProfileMemberEmail } from "@/emails/member/send-female-profile-member"
import { APP_INFO, BASE_URL, EMAIL } from "@/constants"
import { prisma } from "@/lib/prisma"
import { TrackingStatus } from "@/lib/generated/prisma/enums"
import { generateProfilePdf } from "@/lib/generate-profile-pdf"

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
  const { id: trackingId } = await params
  const status = searchParams.get("status")

  if (!trackingId) {
    return NextResponse.json(
      { success: false, message: "Missing trackingId" },
      { status: 400 }
    )
  }

  if (!status) {
    // If no status is provided, return the tracking data
    try {
      const tracking = await prisma.tracking.findUnique({
        where: { id: trackingId },
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

      if (!tracking) {
        return NextResponse.json(
          { success: false, message: "Tracking not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, tracking })
    } catch (error) {
      console.error("Error fetching tracking:", error)
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
    const tracking = await prisma.tracking.findUnique({
      where: { id: trackingId },
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

    if (!tracking) {
      return NextResponse.redirect(
        `${BASE_URL}/action-feedback?error=Tracking not found`
      )
    }

    // Assuming the flow is MALE_PROFILE_SENT_TO_FEMALE -> FEMALE_ACCEPTED/FEMALE_REJECT
    if (tracking.status !== TrackingStatus.MALE_PROFILE_SENT_TO_FEMALE) {
      return NextResponse.redirect(
        `${BASE_URL}/action-feedback?error=This action has already been processed or is not applicable at this stage.`
      )
    }

    const newStatus =
      status === "accepted"
        ? TrackingStatus.FEMALE_ACCEPTED
        : TrackingStatus.FEMALE_REJECT

    await prisma.tracking.update({
      where: { id: trackingId },
      data: { status: newStatus },
    })

    if (newStatus === TrackingStatus.FEMALE_ACCEPTED) {
      // Send email to male
      const maleDetails = tracking.male.personalDetails as PersonalDetails

      const profileUrl = new URL(
        `/print/profile/${tracking.female.profile!.id}`,
        request.url
      )
      const pdf = await generateProfilePdf(profileUrl.toString())

      await resend.emails.send({
        from: `${APP_INFO.name} <${EMAIL.contact}>`,
        // to: [maleDetails.email`,
        to: ["boolean405@gmail.com"],
        subject: `[Soulmate] Good news from your potential tracking!`,
        react: SendFemaleProfileMemberEmail({
          to: {
            prefix: maleDetails.prefix,
            name: maleDetails.name,
          },
          profileId: tracking.female.profile!.id,
        }),
        attachments: [
          {
            filename: `Profile-ID-${tracking.female.customId}.pdf`,
            content: pdf,
          },
        ],
      })

      // Update tracking status to FEMALE_PROFILE_SENT_TO_MALE
      await prisma.tracking.update({
        where: { id: trackingId },
        data: { status: TrackingStatus.FEMALE_PROFILE_SENT_TO_MALE },
      })
    }

    return NextResponse.redirect(
      `${BASE_URL}/action-feedback?message=Your response has been recorded. Thank you!`
    )
  } catch (error) {
    console.error("Error processing tracking status:", error)
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
    const { id: trackingId } = await params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Missing status" },
        { status: 400 }
      )
    }

    if (!Object.values(TrackingStatus).includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      )
    }

    const tracking = await prisma.tracking.findUnique({
      where: { id: trackingId },
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

    if (!tracking) {
      return NextResponse.json(
        { success: false, message: "Tracking not found" },
        { status: 404 }
      )
    }

    const dataToUpdate: {
      status: TrackingStatus
      closedFromStatus?: TrackingStatus
    } = {
      status: status,
    }

    if (status === TrackingStatus.CLOSED) {
      dataToUpdate.closedFromStatus = tracking.status
    }

    let updatedSoulmate = await prisma.tracking.update({
      where: { id: trackingId },
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

    if (status === TrackingStatus.FEMALE_ACCEPTED) {
      const maleDetails = tracking.male.personalDetails as PersonalDetails

      const profileUrl = new URL(
        `/print/profile/${tracking.female.profile!.id}`,
        request.url
      )
      const pdf = await generateProfilePdf(profileUrl.toString())

      await resend.emails.send({
        from: `${APP_INFO.name} <${EMAIL.contact}>`,
        // to: [maleDetails.email],
        to: ["boolean405@gmail.com"],
        subject: `[Soulmate] Good news from your potential tracking!`,
        react: SendFemaleProfileMemberEmail({
          to: {
            prefix: maleDetails.prefix,
            name: maleDetails.name,
          },
          profileId: tracking.female.profile!.id,
        }),
        attachments: [
          {
            filename: `Profile-ID-${tracking.female.customId}.pdf`,
            content: pdf,
          },
        ],
      })

      updatedSoulmate = await prisma.tracking.update({
        where: { id: trackingId },
        data: { status: TrackingStatus.FEMALE_PROFILE_SENT_TO_MALE },
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

    return NextResponse.json({ success: true, tracking: updatedSoulmate })
  } catch (error) {
    console.error("Error updating tracking status:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
