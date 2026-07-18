import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/r2"
import { randomUUID } from "crypto"
import { R2 } from "@/constants"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const fileName = `applications/photos/${randomUUID()}/${randomUUID()}-${Date.now()}.${file.name}`

    await r2.send(
      new PutObjectCommand({
        Bucket: R2.R2_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const url = `${R2.R2_PUBLIC_URL}/${fileName}`

    return NextResponse.json({
      url,
    })
  } catch (error) {
    console.error(error)

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
