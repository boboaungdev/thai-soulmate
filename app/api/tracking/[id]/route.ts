import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { TrackingStatus } from "@/lib/generated/prisma/enums"

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
    return NextResponse.json(
      { success: false, message: "Invalid status value" },
      { status: 400 }
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
      return NextResponse.json(
        { success: false, message: "Tracking not found" },
        { status: 404 }
      )
    }

    // Assuming the flow is MALE_PROFILE_SENT_TO_FEMALE -> FEMALE_ACCEPTED/FEMALE_REJECT
    if (tracking.status !== TrackingStatus.BOTH_PROFILES_SENT) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This action has already been processed or is not applicable at this stage.",
        },
        { status: 400 }
      )
    }

    const newStatus =
      status === "accepted"
        ? TrackingStatus.FEMALE_ACCEPTED
        : TrackingStatus.FEMALE_REJECTED

    await prisma.tracking.update({
      where: { id: trackingId },
      data: { status: newStatus },
    })



    return NextResponse.json({
      success: true,
      message: "Your response has been recorded. Thank you!",
    })
  } catch (error) {
    console.error("Error processing tracking status:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
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

    const updatedSoulmate = await prisma.tracking.update({
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



    return NextResponse.json({ success: true, tracking: updatedSoulmate })
  } catch (error) {
    console.error("Error updating tracking status:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
