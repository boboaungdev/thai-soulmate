import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: profileId } = await params
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Folder name is required." },
        { status: 400 }
      )
    }

    const folderName = name.trim()

    const existing = await prisma.profileFolder.findUnique({
      where: {
        profileId_name: {
          profileId,
          name: folderName,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "A folder with this name already exists." },
        { status: 409 }
      )
    }

    const folder = await prisma.profileFolder.create({
      data: {
        name: folderName,
        profileId,
      },
      include: {
        _count: {
          select: { files: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      folder,
    })
  } catch (error) {
    console.error("Create folder error:", error)
    return NextResponse.json(
      { error: "Failed to create folder." },
      { status: 500 }
    )
  }
}
