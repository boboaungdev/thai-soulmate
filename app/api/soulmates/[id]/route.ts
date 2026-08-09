import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const soulmate = await prisma.soulmate.findUnique({
      where: {
        id,
      },
      include: {
        male: true,
        female: true,
        notes: {
          include: {
            user: true,
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
      { success: false, message: "Error fetching soulmate" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await req.json()

    const currentSoulmate = await prisma.soulmate.findUnique({
      where: { id },
    })

    if (!currentSoulmate) {
      return NextResponse.json(
        { success: false, message: "Soulmate not found" },
        { status: 404 }
      )
    }

    const updatedSoulmate = await prisma.soulmate.update({
      where: {
        id,
      },
      data: {
        status: status,
        ...(status === "CLOSED" && {
          closedFromStatus: currentSoulmate.status,
        }),
      },
    })

    return NextResponse.json({ success: true, soulmate: updatedSoulmate })
  } catch (error) {
    console.error("Error updating soulmate:", error)
    return NextResponse.json(
      { success: false, message: "Error updating soulmate" },
      { status: 500 }
    )
  }
}
