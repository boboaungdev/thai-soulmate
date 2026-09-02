import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { TrackingNoteType } from "@/lib/generated/prisma/enums"

const postBodySchema = z.object({
  message: z.string().min(1),
  userId: z.string().uuid(),
  type: z
    .nativeEnum(TrackingNoteType)
    .optional()
    .default(TrackingNoteType.MANUAL),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params

    const notes = await prisma.trackingNote.findMany({
      where: { trackingId },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      notes,
    })
  } catch (error) {
    console.error("Fetch tracking notes error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch tracking notes." },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params
    const body = await req.json()
    const { message, userId, type } = postBodySchema.parse(body)

    const note = await prisma.trackingNote.create({
      data: {
        message,
        userId,
        trackingId,
        type,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      note,
    })
  } catch (error) {
    console.error("Create tracking note error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Failed to create tracking note." },
      { status: 500 }
    )
  }
}
