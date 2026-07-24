import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { NoteType } from "@/lib/generated/prisma/client"

const paramsSchema = z.object({
  id: z.string().cuid(),
  type: z.string(),
})

function getTypeFromString(type: string): NoteType | null {
  if (type === "register-interest") {
    return NoteType.REGISTER_INTEREST
  }
  if (type === "application-form") {
    return NoteType.APPLICATION_FORM
  }
  return null
}

export async function GET(
  req: Request,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const { id: parentId, type: typeString } = paramsSchema.parse(params)
    const type = getTypeFromString(typeString)

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Invalid note type." },
        { status: 400 }
      )
    }

    const where: any = { type }

    if (type === "REGISTER_INTEREST") {
      where.registerInterestId = parentId
    } else if (type === "APPLICATION_FORM") {
      where.applicationFormId = parentId
    }

    const notes = await prisma.note.findMany({
      where,
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
    })

    return NextResponse.json({ success: true, notes })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request." },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    )
  }
}

const postBodySchema = z.object({
  message: z.string().min(1),
  userId: z.string().cuid(),
})

export async function POST(
  req: Request,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const { id: parentId, type: typeString } = paramsSchema.parse(params)
    const type = getTypeFromString(typeString)

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Invalid note type." },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { message, userId } = postBodySchema.parse(body)

    const data: any = {
      message,
      userId,
      type,
    }

    if (type === NoteType.REGISTER_INTEREST) {
      data.registerInterestId = parentId
    } else if (type === NoteType.APPLICATION_FORM) {
      data.applicationFormId = parentId
    }

    const note = await prisma.note.create({
      data,
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
        { success: false, error: "Invalid request." },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    )
  }
}
