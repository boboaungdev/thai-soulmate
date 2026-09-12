"use server"

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"

export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File | null
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    const rawEmail = (formData.get("email") as string) || "applicant"
    const cleanEmail =
      rawEmail
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "_") || "applicant"
    const type = (formData.get("type") as string) || "no-type"
    const path = (formData.get("path") as string) || "applications/photos"

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

    return {
      success: true,
      url: `${publicUrl}/${fileName}`,
      key: fileName,
    }
  } catch (error: any) {
    console.error("UPLOAD ACTION ERROR:", error)
    return {
      success: false,
      error: error?.message || "Upload failed",
    }
  }
}

export async function downloadFileAction(key: string) {
  try {
    if (!key) {
      return { success: false as const, error: "Missing key" }
    }

    const result = await r2.send(
      new GetObjectCommand({
        Bucket: env.R2.BUCKET,
        Key: key,
      })
    )

    if (!result.Body) {
      return { success: false as const, error: "File not found" }
    }

    const byteArray = await result.Body.transformToByteArray()
    const base64 = Buffer.from(byteArray).toString("base64")
    const contentType = result.ContentType || "application/octet-stream"

    return {
      success: true as const,
      data: {
        base64,
        contentType,
        filename: key.split("/").pop() ?? "download",
      },
    }
  } catch (error: any) {
    console.error("DOWNLOAD ACTION ERROR:", error)
    return {
      success: false as const,
      error: error?.message || "Download failed",
    }
  }
}
