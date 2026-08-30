import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { EmailFolder } from "@/lib/generated/prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const mailbox = searchParams.get("mailbox") || "info"
    const folderParam = (searchParams.get("folder") || "inbox").toUpperCase()
    const query = (searchParams.get("q") || "").trim()

    let folder: EmailFolder = EmailFolder.INBOX
    if (folderParam === "SENT") folder = EmailFolder.SENT
    else if (folderParam === "TRASH") folder = EmailFolder.TRASH
    else if (folderParam === "ARCHIVE") folder = EmailFolder.ARCHIVE
    else if (folderParam === "DRAFT") folder = EmailFolder.DRAFT
    else if (folderParam === "SPAM") folder = EmailFolder.SPAM

    const whereClause: any = {
      mailbox,
      folder,
      isTrash: folder === EmailFolder.TRASH,
    }

    if (query) {
      whereClause.OR = [
        { subject: { contains: query, mode: "insensitive" } },
        { preview: { contains: query, mode: "insensitive" } },
        { fromEmail: { contains: query, mode: "insensitive" } },
        { fromName: { contains: query, mode: "insensitive" } },
        { toEmails: { has: query } },
      ]
    }

    const emails = await prisma.emailMessage.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        attachments: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: emails,
    })
  } catch (error: any) {
    console.error("Error in GET /api/email:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch emails" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, isStarred, isRead, isArchived, isTrash, folder } = body

    if (!id) {
      return NextResponse.json({ error: "Email ID is required" }, { status: 400 })
    }

    const dataToUpdate: any = {}
    if (typeof isStarred === "boolean") dataToUpdate.isStarred = isStarred
    if (typeof isRead === "boolean") dataToUpdate.isRead = isRead
    if (typeof isArchived === "boolean") dataToUpdate.isArchived = isArchived
    if (typeof isTrash === "boolean") dataToUpdate.isTrash = isTrash
    if (folder) dataToUpdate.folder = folder

    const updated = await prisma.emailMessage.update({
      where: { id },
      data: dataToUpdate,
      include: {
        attachments: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error("Error in PATCH /api/email:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update email" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Email ID is required" }, { status: 400 })
    }

    await prisma.emailMessage.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Email deleted successfully",
    })
  } catch (error: any) {
    console.error("Error in DELETE /api/email:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to delete email" },
      { status: 500 }
    )
  }
}
