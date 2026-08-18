import { NextResponse } from "next/server"

import { SendFemaleProfileMemberEmail, SendMaleProfileEmail } from "@/emails"

import { APP_INFO, EMAIL } from "@/constants"
import { resend } from "@/lib/resend"
import { generateProfilePdf } from "@/lib/generate-profile-pdf"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { application, to } = await req.json()
    const { id } = await params

    const reactEmail =
      to.gender.toUpperCase() === "FEMALE"
        ? SendMaleProfileEmail({
            to,
            trackingId: id,
          })
        : SendFemaleProfileMemberEmail({
            profileId: application.profile.id,
            to,
          })

    const profileUrl = new URL(
      `/print/${application.profile.id}/profile`,
      req.url
    )

    const pdf = await generateProfilePdf(profileUrl.toString())

    // Send email
    const result = await resend.emails.send({
      from: `${APP_INFO.name} <${EMAIL.contact}>`,
      to: ["boolean405@gmail.com"],
      // to: [to.email],

      subject:
        "[Soulmate] A carefully selected match is waiting for your review.",

      react: reactEmail,

      attachments: [
        {
          filename: `Profile-ID-${application.customId}.pdf`,
          content: pdf,
        },
      ],
    })

    console.log("Email sent:", result)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Failed to send profile email:", error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to send profile email",
      },
      {
        status: 500,
      }
    )
  }
}
