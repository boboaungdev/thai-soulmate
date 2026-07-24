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
    const { id: applicationFormId } = params
    const body = await req.json()

    const { message, userId } = noteSchema.parse(body)

    // Check if user and application form exist
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      )
    }

    const applicationForm = await prisma.applicationForm.findUnique({
      where: { id: applicationFormId },
    })
    if (!applicationForm) {
      return NextResponse.json(
        { success: false, error: "Application form not found." },
        { status: 404 }
      )
    }

    const note = await prisma.note.create({
      data: {
        message,
        userId,
        applicationFormId,
        type: "APPLICATION_FORM",
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
