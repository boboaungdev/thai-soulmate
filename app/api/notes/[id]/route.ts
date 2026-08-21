import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const paramsSchema = z.object({
  id: z.uuid(),
})

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = paramsSchema.parse(resolvedParams)

    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
        },
        {
          status: 400,
        }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    )
  }
}

const patchBodySchema = z.object({
  message: z.string().min(1),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = paramsSchema.parse(resolvedParams)

    const body = await req.json()
    const { message } = patchBodySchema.parse(body)

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { message },
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
    console.error(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
        },
        {
          status: 400,
        }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    )
  }
}
