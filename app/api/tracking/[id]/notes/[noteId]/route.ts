import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { TrackingNoteType } from "@/lib/generated/prisma/enums"

const patchBodySchema = z.object({
  message: z.string().min(1).optional(),
  type: z.nativeEnum(TrackingNoteType).optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const { id: trackingId, noteId } = await params
    const body = await req.json()
    const { message, type } = patchBodySchema.parse(body)

    const existing = await prisma.trackingNote.findUnique({
      where: { id: noteId },
    })

    if (!existing || existing.trackingId !== trackingId) {
      return NextResponse.json(
        { success: false, error: "Note not found." },
        { status: 404 }
      )
    }

    const dataToUpdate: any = {}
    if (message !== undefined) dataToUpdate.message = message
    if (type !== undefined) dataToUpdate.type = type

    const updatedNote = await prisma.trackingNote.update({
      where: { id: noteId },
      data: dataToUpdate,
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

    return NextResponse.json({ success: true, note: updatedNote })
  } catch (error) {
    console.error("Update tracking note error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request." },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Failed to update note." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const { id: trackingId, noteId } = await params

    const existing = await prisma.trackingNote.findUnique({
      where: { id: noteId },
    })

    if (!existing || existing.trackingId !== trackingId) {
      return NextResponse.json(
        { success: false, error: "Note not found." },
        { status: 404 }
      )
    }

    await prisma.trackingNote.delete({
      where: { id: noteId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete tracking note error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete note." },
      { status: 500 }
    )
  }
}
