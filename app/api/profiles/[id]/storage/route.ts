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
    const { id: profileId } = await params

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const [folders, files] = await Promise.all([
      prisma.profileFolder.findMany({
        where: { profileId },
        include: {
          _count: {
            select: { files: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.profileFile.findMany({
        where: { profileId },
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
    console.error("Fetch profile storage error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile storage." },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: profileId } = await params

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
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
      const folder = await prisma.profileFolder.findUnique({
        where: { id: folderId },
        select: { name: true },
      })
      if (folder) {
        folderPath = folder.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
      }
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const r2Key = `profiles/${profileId}/${folderPath}/${Date.now()}-${sanitizedFileName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(
      new PutObjectCommand({
        Bucket: env.R2.BUCKET,
        Key: r2Key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    )

    const fileUrl = `${env.R2.PUBLIC_URL}/${r2Key}`

    const fileRecord = await prisma.profileFile.create({
      data: {
        name: file.name,
        url: fileUrl,
        r2Key,
        size: buffer.length,
        mimeType: file.type || "application/octet-stream",
        folderId: folderId || null,
        profileId,
        uploadedBy: uploadedBy || "Staff",
      },
    })

    return NextResponse.json({
      success: true,
      file: fileRecord,
    })
  } catch (error) {
    console.error("Profile storage upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file to storage." },
      { status: 500 }
    )
  }
}
