import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { SoulmateStatus } from "@/lib/generated/prisma/client"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = (await req.json()) as { status: SoulmateStatus }

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    if (!Object.values(SoulmateStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const currentSoulmate = await prisma.soulmate.findUnique({
      where: { id },
    })

    if (!currentSoulmate) {
      return NextResponse.json({ error: "Soulmate not found" }, { status: 404 })
    }

    const data: Partial<{
      status: SoulmateStatus
      closedFromStatus: SoulmateStatus | null
    }> = { status }

    if (status === SoulmateStatus.CLOSED) {
      if (currentSoulmate.status === SoulmateStatus.CLOSED) {
        return NextResponse.json(
          { error: "Soulmate is already closed" },
          { status: 400 }
        )
      }
      data.closedFromStatus = currentSoulmate.status
    }

    const updatedSoulmate = await prisma.soulmate.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedSoulmate, { status: 200 })
  } catch (error) {
    console.error("Error updating soulmate status:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
