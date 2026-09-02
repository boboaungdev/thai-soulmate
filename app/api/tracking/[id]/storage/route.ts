import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params

    const tracking = await prisma.tracking.findUnique({
      where: { id: trackingId },
      select: { id: true },
    })

    if (!tracking) {
      return NextResponse.json({ error: "Tracking not found" }, { status: 404 })
    }

    const [folders, files] = await Promise.all([
      prisma.trackingFolder.findMany({
        where: { trackingId },
        include: {
          _count: {
            select: { files: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.trackingFile.findMany({
        where: { trackingId },
        orderBy: { createdAt: "desc" },
      }),
    ])

    const totalSize = files.reduce((acc, file) => acc + file.size, 0)

    return NextResponse.json({
      folders,
      files,
      totalFiles: files.length,
      totalSize,
    })
  } catch (error) {
    console.error("Fetch tracking storage error:", error)
    return NextResponse.json(
      { error: "Failed to fetch tracking storage." },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params

    const tracking = await prisma.tracking.findUnique({
      where: { id: trackingId },
      select: { id: true },
    })

    if (!tracking) {
      return NextResponse.json({ error: "Tracking not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folderId = (formData.get("folderId") as string | null) || null
    const uploadedBy = (formData.get("uploadedBy") as string | null) || null

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 })
    }

    // Get folder name for organized path
    let folderPath = "root"
    if (folderId) {
      const folder = await prisma.trackingFolder.findUnique({
        where: { id: folderId },
        select: { name: true },
      })
      if (folder) {
        folderPath = folder.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
      }
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const r2Key = `tracking/${trackingId}/${folderPath}/${Date.now()}-${sanitizedFileName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(
      new PutObjectCommand({
        Bucket: env.R2.BUCKET,
        Key: r2Key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    )

    const publicUrl = `${env.R2.PUBLIC_URL}/${r2Key}`

    const trackingFile = await prisma.trackingFile.create({
      data: {
        name: file.name,
        url: publicUrl,
        r2Key,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        folderId,
        trackingId,
        uploadedBy,
      },
    })

    return NextResponse.json({
      success: true,
      file: trackingFile,
    })
  } catch (error) {
    console.error("Upload tracking file error:", error)
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    )
  }
}
