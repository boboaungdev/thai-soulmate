import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { RegisterInterestStatus } from "@/lib/generated/prisma/enums"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const interest = await prisma.registerInterest.findUnique({
      where: { id },
      include: {
        notes: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!interest) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 })
    }

    return NextResponse.json(interest)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const body = await request.json()
    const { status } = body as {
      status: RegisterInterestStatus
    }

    const updatedInterest = await prisma.registerInterest.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updatedInterest)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.registerInterest.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
