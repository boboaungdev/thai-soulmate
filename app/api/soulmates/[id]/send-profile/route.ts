import { NextResponse } from "next/server"

import {
  SendFemaleProfileMemberEmail,
  SendMaleProfileEmail,
} from "@/emails"

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
    const { application, to } = await req.json()
    const { id } = await params

    console.log("Sending profile:", id)
    console.log("Recipient:", to.email)

    const reactEmail =
      to.gender.toUpperCase() === "FEMALE"
        ? SendMaleProfileEmail({
            to,
            soulmateId: id,
          })
        : SendFemaleProfileMemberEmail({
            profileId: application.profile.id,
            to,
          })

    // Generate profile PDF
    const pdf = await generateProfilePdf(id)

    console.log("PDF generated:", pdf.length, "bytes")

    // Send email
    const result = await resend.emails.send({
      from: `${APP_INFO.name} <${EMAIL.contact}>`,
      to: ['boolean405@gmail.com'],
      // to: [to.email],

      subject:
        "[Soulmate] A carefully selected match is waiting for your review.",

      react: reactEmail,

      attachments: [
        {
          filename: `profile-${id}.pdf`,
          content: pdf.toString("base64"),
        },
      ],
    })

    console.log("Resend result:", result)

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
