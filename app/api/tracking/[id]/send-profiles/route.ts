import { NextResponse } from "next/server"

import { SendFemaleProfileMemberEmail, SendMaleProfileEmail } from "@/emails"

import { APP_INFO, EMAIL } from "@/constants"
import { resend } from "@/lib/resend"
import { generateProfilePdf } from "@/lib/generate-profile-pdf"
import { env } from "@/lib/env"

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
      `${env.BASE_URL}/print/${male.id}/profile`,
      req.url
    ).toString()
    const femaleProfileUrl = new URL(
      `${env.BASE_URL}/print/${female.id}/profile`,
      req.url
    ).toString()

    console.log("maleProfileUrl:", maleProfileUrl)
    console.log("femaleProfileUrl:", femaleProfileUrl)

    const [malePdf, femalePdf] = await Promise.all([
      generateProfilePdf(maleProfileUrl),
      generateProfilePdf(femaleProfileUrl),
    ])

    // 2. Prepare emails
    const emailToFemale = {
      from: `${APP_INFO.name} <${EMAIL.contact}>`,
      to: ["boolean405@gmail.com"],
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
      to: ["boolean405@gmail.com"],
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
    const { data, error } = await resend.batch.send([
      emailToFemale,
      emailToMale,
    ])

    if (error || !data) {
      console.error("Resend batch failed:", error)
      throw new Error("Failed to send profile emails via batch.")
    }

    console.log("Emails sent successfully:", data)
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
