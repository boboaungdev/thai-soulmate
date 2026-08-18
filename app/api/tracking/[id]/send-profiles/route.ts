import { NextResponse } from "next/server"

import { SendFemaleProfileMemberEmail, SendMaleProfileEmail } from "@/emails"

import { APP_INFO, EMAIL } from "@/constants"
import { resend } from "@/lib/resend"
import { generateProfilePdf } from "@/lib/generate-profile-pdf"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params
    const { male, female } = await req.json()

    // 1. Generate PDFs for both profiles
    const maleProfileUrl = new URL(
      `/print/${male.id}/profile`,
      req.url
    ).toString()
    const femaleProfileUrl = new URL(
      `/print/${female.id}/profile`,
      req.url
    ).toString()

    const [malePdf, femalePdf] = await Promise.all([
      generateProfilePdf(maleProfileUrl),
      generateProfilePdf(femaleProfileUrl),
    ])

    // 2. Prepare emails
    const emailToFemale = {
      from: `${APP_INFO.name} <${EMAIL.contact}>`,
      to: ['boolean405@gmail.com'],
      // to: [female.personalDetails.email],
      subject:
        "[Soulmate] A carefully selected match is waiting for your review.",
      react: SendMaleProfileEmail({
        to: female.personalDetails,
        trackingId: trackingId,
      }),
      attachments: [
        {
          filename: `Profile-ID-${male.customId}.pdf`,
          content: malePdf,
        },
      ],
    }

    const emailToMale = {
      from: `${APP_INFO.name} <${EMAIL.contact}>`,
      to: ['boolean405@gmail.com'],
      // to: [male.personalDetails.email],
      subject:
        "[Soulmate] A carefully selected match is waiting for your review.",
      react: SendFemaleProfileMemberEmail({
        to: male.personalDetails,
        profileId: female.id,
      }),
      attachments: [
        {
          filename: `Profile-ID-${female.customId}.pdf`,
          content: femalePdf,
        },
      ],
    }

    // 3. Send both emails
    const [resultToFemale, resultToMale] = await resend.batch.send([
      emailToFemale,
      emailToMale,
    ])

    console.log("Email to female sent:", resultToFemale)
    console.log("Email to male sent:", resultToMale)

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
