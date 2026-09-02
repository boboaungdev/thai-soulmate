import { NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"
import { getUniqueFolderName } from "@/lib/storage-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; folderId: string }> }
) {
  try {
    const { id: profileId, folderId } = await params
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Folder name is required." },
        { status: 400 }
      )
    }

    const folder = await prisma.profileFolder.findUnique({
      where: { id: folderId },
    })

    if (!folder || folder.profileId !== profileId) {
      return NextResponse.json(
        { error: "Folder not found." },
        { status: 404 }
      )
    }

    const uniqueFolderName = await getUniqueFolderName(profileId, name, folderId)

    const updatedFolder = await prisma.profileFolder.update({
      where: { id: folderId },
      data: { name: uniqueFolderName },
      include: {
        _count: {
          select: { files: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      folder: updatedFolder,
    })
  } catch (error) {
    console.error("Rename folder error:", error)
    return NextResponse.json(
      { error: "Failed to rename folder." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; folderId: string }> }
) {
  try {
    const { id: profileId, folderId } = await params
    const { searchParams } = new URL(request.url)
    const deleteFiles = searchParams.get("deleteFiles") === "true"

    const folder = await prisma.profileFolder.findUnique({
      where: { id: folderId },
      include: {
        files: true,
      },
    })

    if (!folder || folder.profileId !== profileId) {
      return NextResponse.json(
        { error: "Folder not found." },
        { status: 404 }
      )
    }

    if (deleteFiles && folder.files.length > 0) {
      // Delete all files in this folder from storage
      for (const file of folder.files) {
        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: env.R2.BUCKET,
              Key: file.r2Key,
            })
          )
        } catch (r2Error) {
          console.error(`Storage delete error for file ${file.name}:`, r2Error)
        }
      }

      // Delete file records from database
      await prisma.profileFile.deleteMany({
        where: { folderId },
      })
    } else {
      // Move files to root (folderId: null)
      await prisma.profileFile.updateMany({
        where: { folderId },
        data: { folderId: null },
      })
    }

    // Delete folder record
    await prisma.profileFolder.delete({
      where: { id: folderId },
    })

    return NextResponse.json({
      success: true,
      message: deleteFiles
        ? "Folder and all its files deleted from storage."
        : "Folder deleted and files moved to All Files.",
    })
  } catch (error) {
    console.error("Delete folder error:", error)
    return NextResponse.json(
      { error: "Failed to delete folder." },
      { status: 500 }
    )
  }
}
