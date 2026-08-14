import { NextRequest, NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"

import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key")

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
  }

  try {
    const result = await r2.send(
      new GetObjectCommand({
        Bucket: env.R2.BUCKET,
        Key: key,
      })
    )

    if (!result.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return new NextResponse(result.Body as ReadableStream, {
      headers: {
        "Content-Type": result.ContentType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
