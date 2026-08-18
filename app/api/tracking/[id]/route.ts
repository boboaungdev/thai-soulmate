import { NextResponse } from "next/server"

import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"
import { TrackingStatus } from "@/lib/generated/prisma/enums"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url)
  const { id: trackingId } = await params
  const response = searchParams.get("response") // 'accepted' or 'rejected'
  const from = searchParams.get("from") // 'male' or 'female'

  if (!trackingId) {
    return NextResponse.json(
      { success: false, message: "Missing trackingId" },
      { status: 400 }
    )
  }

  if (!response || !from) {
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

  // Logic for status updates from email links (accepted/rejected)
  if (response !== "accepted" && response !== "rejected") {
    return NextResponse.json(
      { success: false, message: "Invalid status value" },
      { status: 400 }
    )
  }

  return await prisma.$transaction(async (tx) => {
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

    const allowedInitialStatuses: TrackingStatus[] = [
      TrackingStatus.BOTH_PROFILES_SENT,
      TrackingStatus.MALE_ACCEPTED,
      TrackingStatus.FEMALE_ACCEPTED,
    ] as const

    if (!allowedInitialStatuses.includes(tracking.status)) {
      // If action is not applicable, redirect with a message
      const url = new URL("/action-feedback", env.BASE_URL)
      url.searchParams.set(
        "message",
        "This introduction is no longer active or your response has already been recorded."
      )
      return NextResponse.redirect(url)
    }

    let newStatus: TrackingStatus
    const confirmationUrl = new URL("/action-feedback", env.BASE_URL)
    confirmationUrl.searchParams.set(
      "message",
      "Your response has been recorded. Thank you!"
    )

    if (from === "male") {
      newStatus =
        response === "accepted"
          ? TrackingStatus.MALE_ACCEPTED
          : TrackingStatus.MALE_REJECTED
    } else if (from === "female") {
      newStatus =
        response === "accepted"
          ? TrackingStatus.FEMALE_ACCEPTED
          : TrackingStatus.FEMALE_REJECTED
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid 'from' parameter." },
        { status: 400 }
      )
    }

    // Check if this user has already responded
    if (
      (from === "male" && tracking.status.startsWith("MALE_")) ||
      (from === "female" && tracking.status.startsWith("FEMALE_"))
    ) {
      return NextResponse.redirect(confirmationUrl)
    }

    // If the other party has already responded, update to a combined status
    if (
      tracking.status === TrackingStatus.MALE_ACCEPTED &&
      newStatus === TrackingStatus.FEMALE_ACCEPTED
    ) {
      newStatus = TrackingStatus.BOTH_PROFILES_ACCEPTED
    } else if (
      tracking.status === TrackingStatus.FEMALE_ACCEPTED &&
      newStatus === TrackingStatus.MALE_ACCEPTED
    ) {
      newStatus = TrackingStatus.BOTH_PROFILES_ACCEPTED
    }

    await tx.tracking.update({
      where: { id: trackingId },
      data: { status: newStatus },
    })

    return NextResponse.redirect(confirmationUrl)
  })
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

    const updatedTracking = await prisma.tracking.update({
      where: { id: trackingId },
      data: dataToUpdate,
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

    return NextResponse.json({ success: true, tracking: updatedTracking })
  } catch (error) {
    console.error("Error updating tracking status:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
