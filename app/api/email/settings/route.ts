import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadBase64ImageToR2 } from "@/lib/r2-email"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const mailbox = searchParams.get("mailbox") || "info"

    const setting = await prisma.mailboxSetting.findUnique({
      where: { mailbox },
    })

    return NextResponse.json({
      success: true,
      data: setting,
    })
  } catch (error: any) {
    console.error("Error in GET /api/email/settings:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to load mailbox settings" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      mailbox,
      displayName,
      notificationEmails,
      signatureText,
      signatureImage, // base64 or URL or null
      signatureSize,
    } = body

    if (!mailbox) {
      return NextResponse.json(
        { error: "Mailbox identifier is required" },
        { status: 400 }
      )
    }

    let finalSignatureImageUrl: string | null = null

    if (signatureImage) {
      if (signatureImage.startsWith("data:")) {
        // Upload base64 image to Cloudflare R2 bucket
        const r2Res = await uploadBase64ImageToR2({
          dataUrl: signatureImage,
          mailbox,
          prefix: "signatures",
        })
        finalSignatureImageUrl = r2Res.url
      } else if (signatureImage.startsWith("http")) {
        finalSignatureImageUrl = signatureImage
      }
    }

    const updatedSetting = await prisma.mailboxSetting.upsert({
      where: { mailbox },
      update: {
        displayName: displayName || null,
        notificationEmails: Array.isArray(notificationEmails)
          ? notificationEmails
          : [],
        signatureText: signatureText || null,
        signatureImageUrl: finalSignatureImageUrl,
        signatureSize: signatureSize || "md",
      },
      create: {
        mailbox,
        displayName: displayName || null,
        notificationEmails: Array.isArray(notificationEmails)
          ? notificationEmails
          : [],
        signatureText: signatureText || null,
        signatureImageUrl: finalSignatureImageUrl,
        signatureSize: signatureSize || "md",
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedSetting,
    })
  } catch (error: any) {
    console.error("Error in POST /api/email/settings:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to save mailbox settings" },
      { status: 500 }
    )
  }
}
