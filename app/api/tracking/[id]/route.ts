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
      TrackingStatus.MALE_REJECTED,
      TrackingStatus.FEMALE_ACCEPTED,
      TrackingStatus.FEMALE_REJECTED,
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

    const confirmationUrl = new URL("/action-feedback", env.BASE_URL)
    confirmationUrl.searchParams.set(
      "message",
      "Your response has been recorded. Thank you!"
    )

    const isMale = from === "male"
    const responseStatus =
      response === "accepted"
        ? isMale
          ? TrackingStatus.MALE_ACCEPTED
          : TrackingStatus.FEMALE_ACCEPTED
        : isMale
          ? TrackingStatus.MALE_REJECTED
          : TrackingStatus.FEMALE_REJECTED

    // Check if this user has already responded
    const existingStatuses = tracking.completedStatuses || [
      TrackingStatus.INITIAL_CONNECT,
      TrackingStatus.BOTH_PROFILES_SENT,
    ]

    if (
      (isMale &&
        (existingStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
          existingStatuses.includes(TrackingStatus.MALE_REJECTED))) ||
      (!isMale &&
        (existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
          existingStatuses.includes(TrackingStatus.FEMALE_REJECTED)))
    ) {
      return NextResponse.redirect(confirmationUrl)
    }

    const updatedStatusesSet = new Set([...existingStatuses, responseStatus])
    let finalStatus: TrackingStatus = responseStatus
    let closedFromStatus: TrackingStatus | undefined = undefined

    // Check if the other party has already responded
    const otherHasResponded = isMale
      ? existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
        existingStatuses.includes(TrackingStatus.FEMALE_REJECTED) ||
        tracking.status === TrackingStatus.FEMALE_ACCEPTED ||
        tracking.status === TrackingStatus.FEMALE_REJECTED
      : existingStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
        existingStatuses.includes(TrackingStatus.MALE_REJECTED) ||
        tracking.status === TrackingStatus.MALE_ACCEPTED ||
        tracking.status === TrackingStatus.MALE_REJECTED

    if (otherHasResponded) {
      // Both parties have now responded!
      const femaleAccepted = isMale
        ? existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
          tracking.status === TrackingStatus.FEMALE_ACCEPTED
        : responseStatus === TrackingStatus.FEMALE_ACCEPTED

      const maleAccepted = isMale
        ? responseStatus === TrackingStatus.MALE_ACCEPTED
        : existingStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
          tracking.status === TrackingStatus.MALE_ACCEPTED

      if (femaleAccepted && maleAccepted) {
        // Both accepted!
        finalStatus = TrackingStatus.BOTH_PROFILES_ACCEPTED
        updatedStatusesSet.add(TrackingStatus.MALE_ACCEPTED)
        updatedStatusesSet.add(TrackingStatus.FEMALE_ACCEPTED)
        updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_ACCEPTED)
      } else {
        // Both responded and at least one rejected -> Now close tracking!
        finalStatus = TrackingStatus.CLOSED
        closedFromStatus = responseStatus.includes("REJECTED")
          ? responseStatus
          : tracking.status
        updatedStatusesSet.add(TrackingStatus.CLOSED)
      }
    } else {
      // The other party has NOT responded yet: keep tracking open in review!
      finalStatus = responseStatus
      updatedStatusesSet.add(responseStatus)
    }

    const updatedCompletedStatuses = Array.from(updatedStatusesSet)

    await tx.tracking.update({
      where: { id: trackingId },
      data: {
        status: finalStatus,
        completedStatuses: updatedCompletedStatuses,
        ...(closedFromStatus ? { closedFromStatus } : {}),
      },
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

    const existingStatuses = tracking.completedStatuses || [
      TrackingStatus.INITIAL_CONNECT,
    ]
    const updatedStatusesSet = new Set([...existingStatuses, status])
    let finalStatus: TrackingStatus = status
    let closedFromStatus: TrackingStatus | undefined = undefined

    const isReviewResponse =
      status === TrackingStatus.FEMALE_ACCEPTED ||
      status === TrackingStatus.FEMALE_REJECTED ||
      status === TrackingStatus.MALE_ACCEPTED ||
      status === TrackingStatus.MALE_REJECTED

    if (isReviewResponse) {
      updatedStatusesSet.add(status)
      const maleHasResponded =
        status === TrackingStatus.MALE_ACCEPTED ||
        status === TrackingStatus.MALE_REJECTED ||
        existingStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
        existingStatuses.includes(TrackingStatus.MALE_REJECTED)

      const femaleHasResponded =
        status === TrackingStatus.FEMALE_ACCEPTED ||
        status === TrackingStatus.FEMALE_REJECTED ||
        existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
        existingStatuses.includes(TrackingStatus.FEMALE_REJECTED)

      if (maleHasResponded && femaleHasResponded) {
        const maleAccepted =
          status === TrackingStatus.MALE_ACCEPTED ||
          existingStatuses.includes(TrackingStatus.MALE_ACCEPTED)
        const femaleAccepted =
          status === TrackingStatus.FEMALE_ACCEPTED ||
          existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED)

        if (maleAccepted && femaleAccepted) {
          finalStatus = TrackingStatus.BOTH_PROFILES_ACCEPTED
          updatedStatusesSet.add(TrackingStatus.MALE_ACCEPTED)
          updatedStatusesSet.add(TrackingStatus.FEMALE_ACCEPTED)
          updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_ACCEPTED)
        } else {
          finalStatus = TrackingStatus.CLOSED
          closedFromStatus = status.includes("REJECTED")
            ? status
            : tracking.status
          updatedStatusesSet.add(TrackingStatus.CLOSED)
        }
      } else {
        // One party responded, the other is still in review!
        finalStatus = status
      }
    } else if (status === TrackingStatus.BOTH_PROFILES_ACCEPTED) {
      finalStatus = TrackingStatus.BOTH_PROFILES_ACCEPTED
      updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_SENT)
      updatedStatusesSet.add(TrackingStatus.MALE_ACCEPTED)
      updatedStatusesSet.add(TrackingStatus.FEMALE_ACCEPTED)
      updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_ACCEPTED)
    } else if (status === TrackingStatus.BOTH_PROFILES_SENT) {
      finalStatus = TrackingStatus.BOTH_PROFILES_SENT
      updatedStatusesSet.add(TrackingStatus.INITIAL_CONNECT)
      updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_SENT)
    } else if (status === TrackingStatus.CLOSED) {
      finalStatus = TrackingStatus.CLOSED
      closedFromStatus = tracking.status
      updatedStatusesSet.add(TrackingStatus.CLOSED)
    }

    const updatedCompletedStatuses = Array.from(updatedStatusesSet)

    const dataToUpdate: {
      status: TrackingStatus
      completedStatuses: TrackingStatus[]
      closedFromStatus?: TrackingStatus
    } = {
      status: finalStatus,
      completedStatuses: updatedCompletedStatuses,
    }

    if (closedFromStatus) {
      dataToUpdate.closedFromStatus = closedFromStatus
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
