import { NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"
import { getUniqueFileName } from "@/lib/storage-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id: profileId, fileId } = await params
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "File name is required." },
        { status: 400 }
      )
    }

    const file = await prisma.profileFile.findUnique({
      where: { id: fileId },
    })

    if (!file || file.profileId !== profileId) {
      return NextResponse.json(
        { error: "File not found." },
        { status: 404 }
      )
    }

    // Preserve original extension if user didn't specify one
    let targetName = name.trim()
    const dotIndex = file.name.lastIndexOf(".")
    const originalExt = dotIndex !== -1 ? file.name.slice(dotIndex) : ""
    if (originalExt && !targetName.toLowerCase().endsWith(originalExt.toLowerCase())) {
      targetName = `${targetName}${originalExt}`
    }

    const uniqueFileName = await getUniqueFileName(
      profileId,
      file.folderId,
      targetName,
      fileId
    )

    const updatedFile = await prisma.profileFile.update({
      where: { id: fileId },
      data: { name: uniqueFileName },
    })

    return NextResponse.json({
      success: true,
      file: updatedFile,
    })
  } catch (error) {
    console.error("Rename file error:", error)
    return NextResponse.json(
      { error: "Failed to rename file." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id: profileId, fileId } = await params

    const file = await prisma.profileFile.findUnique({
      where: { id: fileId },
    })

    if (!file || file.profileId !== profileId) {
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
    await prisma.profileFile.delete({
      where: { id: fileId },
    })

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    })
  } catch (error) {
    console.error("Delete profile file error:", error)
    return NextResponse.json(
      { error: "Failed to delete file." },
      { status: 500 }
    )
  }
}
