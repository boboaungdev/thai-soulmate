"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { NoteType } from "@/lib/generated/prisma/client"

function getTypeFromString(type: string): NoteType | null {
  if (type === "register-interest") return NoteType.REGISTER_INTEREST
  if (type === "application-form") return NoteType.APPLICATION_FORM
  if (type === "profile") return NoteType.PROFILE
  return null
}

export async function getNotesAction(parentId: string, typeString: string) {
  try {
    const type = getTypeFromString(typeString)
    if (!type) {
      return { success: false, error: "Invalid note type." }
    }

    let where: any
    if (type === NoteType.REGISTER_INTEREST) {
      where = { type, registerInterestId: parentId }
    } else if (type === NoteType.APPLICATION_FORM) {
      where = { type, applicationFormId: parentId }
    } else if (type === NoteType.PROFILE) {
      where = { type, profileId: parentId }
    }

    const notes = await prisma.note.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    })

    return { success: true, notes: JSON.parse(JSON.stringify(notes)) }
  } catch (error: any) {
    console.error("getNotesAction error:", error)
    return { success: false, error: error?.message || "Internal server error." }
  }
}

export async function addNoteAction(
  parentId: string,
  typeString: string,
  message: string,
  userId: string
) {
  try {
    const type = getTypeFromString(typeString)
    if (!type) {
      return { success: false, error: "Invalid note type." }
    }

    if (!message || !message.trim()) {
      return { success: false, error: "Note message cannot be empty." }
    }

    let data: any
    if (type === NoteType.REGISTER_INTEREST) {
      data = { message, userId, type, registerInterestId: parentId }
    } else if (type === NoteType.APPLICATION_FORM) {
      data = { message, userId, type, applicationFormId: parentId }
    } else if (type === NoteType.PROFILE) {
      data = { message, userId, type, profileId: parentId }
    }

    const note = await prisma.note.create({
      data,
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

    revalidatePath("/dashboard/register-interest")
    revalidatePath("/dashboard/application-form")
    revalidatePath("/dashboard/profiles")

    return { success: true, note: JSON.parse(JSON.stringify(note)) }
  } catch (error: any) {
    console.error("addNoteAction error:", error)
    return { success: false, error: error?.message || "Internal server error." }
  }
}

export async function updateNoteAction(id: string, message: string) {
  try {
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

    revalidatePath("/dashboard/register-interest")
    revalidatePath("/dashboard/application-form")
    revalidatePath("/dashboard/profiles")

    return { success: true, note: JSON.parse(JSON.stringify(updatedNote)) }
  } catch (error: any) {
    console.error("updateNoteAction error:", error)
    return { success: false, error: error?.message || "Internal server error." }
  }
}

export async function deleteNoteAction(id: string) {
  try {
    await prisma.note.delete({ where: { id } })

    revalidatePath("/dashboard/register-interest")
    revalidatePath("/dashboard/application-form")
    revalidatePath("/dashboard/profiles")

    return { success: true }
  } catch (error: any) {
    console.error("deleteNoteAction error:", error)
    return { success: false, error: error?.message || "Internal server error." }
  }
}

