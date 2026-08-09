import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
        createdAt: "desc",
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
