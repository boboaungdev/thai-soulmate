import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"

import { r2 } from "@/lib/r2"
import { R2 } from "@/constants"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required for file upload.",
        },
        {
          status: 400,
        }
      )
    }

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

    const extension = file.name.split(".").pop()

    const fileName = `applications/photos/${email}/${email}-${Date.now()}.${extension}`

    await r2.send(
      new PutObjectCommand({
        Bucket: R2.R2_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    )

    return NextResponse.json({
      success: true,
      url: `${R2.R2_PUBLIC_URL}/${fileName}`,
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
