import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"

import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const { searchParams } = new URL(req.url)
    const rawEmail = searchParams.get("email") || "applicant"
    const cleanEmail =
      rawEmail
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "_") || "applicant"
    const type = searchParams.get("type") || "no-type"
    const path = searchParams.get("path") || "applications/photos"

    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        {
          error: "No file found",
        },
        {
          status: 400,
        }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const ext = file.name.includes(".")
      ? file.name.split(".").pop()
      : file.type.includes("webp")
        ? "webp"
        : file.type.includes("png")
          ? "png"
          : "jpg"

    const contentType = file.type || "image/webp"
    const fileName = `${path}/${cleanEmail}/${cleanEmail}-${type}-${Date.now()}.${ext}`

    await r2.send(
      new PutObjectCommand({
        Bucket: env.R2.BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
      })
    )

    const publicUrl =
      env.R2.PUBLIC_URL?.replace(/\/+$/, "") ||
      "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev"

    return NextResponse.json({
      success: true,
      url: `${publicUrl}/${fileName}`,
      key: fileName,
    })
  } catch (error) {
    console.error("UPLOAD ERROR:", error)

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    )
  }
}
