import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/r2"
import { R2 } from "@/constants"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get("file") as File
    const email = formData.get("email") as string

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const safeEmail = email.toLowerCase().replace(/[^a-z0-9]/g, "_")

    const buffer = Buffer.from(await file.arrayBuffer())

    const fileName = `applications/photos/${safeEmail}/${Date.now()}-${file.name}`

    await r2.send(
      new PutObjectCommand({
        Bucket: R2.R2_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    )

    return NextResponse.json({
      url: `${R2.R2_PUBLIC_URL}/${fileName}`,
    })
  } catch (error) {
    console.error("R2 Upload Error:", error)

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
