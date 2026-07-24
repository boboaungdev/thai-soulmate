import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const noteSchema = z.object({
  message: z.string().min(1),
  userId: z.string().cuid(),
})

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: registerInterestId } = params
    const body = await req.json()

    const { message, userId } = noteSchema.parse(body)

    // Check if user and register interest exist
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      )
    }

    const registerInterest = await prisma.registerInterest.findUnique({
      where: { id: registerInterestId },
    })
    if (!registerInterest) {
      return NextResponse.json(
        { success: false, error: "Register interest not found." },
        { status: 404 }
      )
    }

    const note = await prisma.note.create({
      data: {
        message,
        userId,
        registerInterestId,
        type: "REGISTER_INTEREST",
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, note })
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      { status: 500 }
    )
  }
}
