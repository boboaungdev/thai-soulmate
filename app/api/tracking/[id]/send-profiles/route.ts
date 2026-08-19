import { NextResponse } from "next/server"

import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { SendProfileEmail } from "@/emails"
import { APP_INFO, EMAIL } from "@/constants"
import { generateProfilePdf } from "@/lib/generate-profile-pdf"
import { TrackingStatus } from "@/lib/generated/prisma/enums"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params
    const { male, female } = await req.json()

    const maleProfileUrl = new URL(
      `${env.BASE_URL}/print/${male.profile.id}/profile`,
      req.url
    ).toString()
    const femaleProfileUrl = new URL(
      `${env.BASE_URL}/print/${female.profile.id}/profile`,
      req.url
    ).toString()

    const [malePdf, femalePdf] = await Promise.all([
      generateProfilePdf(maleProfileUrl),
      generateProfilePdf(femaleProfileUrl),
    ])

    // const malePdf = await generateProfilePdf(maleProfileUrl)
    // const femalePdf = await generateProfilePdf(femaleProfileUrl);

    const [femaleResult, maleResult] = await Promise.all([
      resend.emails.send({
        from: `${APP_INFO.name} <${EMAIL.contact}>`,
        to: ["boolean405@gmail.com"],
        // to: [female.personalDetails.email],
        subject:
          "[Soulmate] A carefully selected match is waiting for your review.",
        react: SendProfileEmail({
          to: female.personalDetails,
          trackingId,
        }),
        attachments: [
          {
            filename: `Profile-ID-${male.customId}.pdf`,
            content: malePdf,
          },
        ],
      }),

      resend.emails.send({
        from: `${APP_INFO.name} <${EMAIL.contact}>`,
        to: ["boolean405@gmail.com"],
        // to: [male.personalDetails.email],
        subject:
          "[Soulmate] A carefully selected match is waiting for your review.",
        react: SendProfileEmail({
          to: male.personalDetails,
          trackingId,
        }),
        attachments: [
          {
            filename: `Profile-ID-${female.customId}.pdf`,
            content: femalePdf,
          },
        ],
      }),
    ])
    if (femaleResult.error || maleResult.error) {
      console.error("Female email:", femaleResult.error)
      console.error("Male email:", maleResult.error)

      throw new Error("Failed to send profile emails")
    }

    await prisma.tracking.update({
      where: { id: trackingId },
      data: { status: TrackingStatus.BOTH_PROFILES_SENT },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to send profile emails:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send profile emails",
      },
      { status: 500 }
    )
  }
}
