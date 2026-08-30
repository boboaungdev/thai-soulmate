import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const fileUrl = searchParams.get("url")
    const filename = searchParams.get("filename") || "attachment"

    if (!fileUrl) {
      return new NextResponse("Missing url parameter", { status: 400 })
    }

    const res = await fetch(fileUrl)
    if (!res.ok) {
      return new NextResponse("Failed to fetch file from storage", { status: res.status })
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream"
    const buffer = await res.arrayBuffer()

    const sanitizedFilename = filename.replace(/["\r\n]/g, "_")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${sanitizedFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    })
  } catch (err: any) {
    console.error("Attachment download proxy error:", err)
    return new NextResponse("Failed to download attachment", { status: 500 })
  }
}
