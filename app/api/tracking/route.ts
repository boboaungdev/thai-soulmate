import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"

export async function GET() {
  try {
    const trackings = await prisma.tracking.findMany({
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
      trackings,
    })
  } catch (error) {
    console.error("GET SOULMATES ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trackings",
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
    const { maleId, femaleId, matchPercentage } = body

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

    // Check if an active tracking connection already exists
    const existingSoulmate = await prisma.tracking.findFirst({
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

    const tracking = await prisma.tracking.create({
      data: {
        maleId,
        femaleId,
        matchPercentage,
        status: "INITIAL_CONNECT",
      },
    })

    return NextResponse.json({
      success: true,
      tracking,
    })
  } catch (error) {
    console.error("CREATE SOULMATE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create tracking",
      },
      {
        status: 500,
      }
    )
  }
}
