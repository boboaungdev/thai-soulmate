import { NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"
import { getUniqueTrackingFileName } from "@/lib/storage-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id: trackingId, fileId } = await params
    const body = await request.json()
    const { name, folderId } = body

    const file = await prisma.trackingFile.findUnique({
      where: { id: fileId },
    })

    if (!file || file.trackingId !== trackingId) {
      return NextResponse.json(
        { error: "File not found." },
        { status: 404 }
      )
    }

    const dataToUpdate: any = {}

    // Moving to another folder
    if (folderId !== undefined) {
      dataToUpdate.folderId = folderId || null
    }

    // Renaming file
    if (name && typeof name === "string" && name.trim()) {
      let targetName = name.trim()
      const dotIndex = file.name.lastIndexOf(".")
      const originalExt = dotIndex !== -1 ? file.name.slice(dotIndex) : ""
      if (originalExt && !targetName.toLowerCase().endsWith(originalExt.toLowerCase())) {
        targetName = `${targetName}${originalExt}`
      }

      const uniqueFileName = await getUniqueTrackingFileName(
        trackingId,
        folderId !== undefined ? folderId : file.folderId,
        targetName,
        fileId
      )
      dataToUpdate.name = uniqueFileName
    }

    const updatedFile = await prisma.trackingFile.update({
      where: { id: fileId },
      data: dataToUpdate,
    })

    return NextResponse.json({
      success: true,
      file: updatedFile,
    })
  } catch (error) {
    console.error("Update tracking file error:", error)
    return NextResponse.json(
      { error: "Failed to update file." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id: trackingId, fileId } = await params

    const file = await prisma.trackingFile.findUnique({
      where: { id: fileId },
    })

    if (!file || file.trackingId !== trackingId) {
      return NextResponse.json(
        { error: "File not found." },
        { status: 404 }
      )
    }

    // Delete from Cloudflare R2
    try {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: env.R2.BUCKET,
          Key: file.r2Key,
        })
      )
    } catch (r2Error) {
      console.error("Storage file deletion warning:", r2Error)
    }

    // Delete database record
    await prisma.trackingFile.delete({
      where: { id: fileId },
    })

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    })
  } catch (error) {
    console.error("Delete tracking file error:", error)
    return NextResponse.json(
      { error: "Failed to delete file." },
      { status: 500 }
    )
  }
}
