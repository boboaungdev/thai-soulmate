import { NextResponse } from "next/server"
import { SendFemaleProfileMemberEmail, SendMaleProfileEmail } from "@/emails"
import { APP_INFO, EMAIL } from "@/constants"
import { resend } from "@/lib/resend"
import { generateProfilePdf } from "@/lib/generate-profile-pdf"

export const runtime = "nodejs"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { application, to } = await req.json()
    const { id } = await params

    // Create email content
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

    // Generate PDF from:
    // /print/profile/{id}
    const pdf = await generateProfilePdf(id)

    // Convert PDF Buffer to base64 for Resend
    const pdfBase64 = pdf.toString("base64")

    // Send email
    const result = await resend.emails.send({
      from: `${APP_INFO.name} <${EMAIL.contact}>`,

      // Testing
      to: ["boolean405@gmail.com"],

      // Production
      // to: [to.email],

      subject:
        "[Soulmate] A carefully selected match is waiting for your review.",

      react: reactEmail,

      attachments: [
        {
          filename: `profile-${id}.pdf`,
          content: pdfBase64,
        },
      ],
    })

    console.log("Email sent:", result)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Send profile email error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
      },
      {
        status: 500,
      }
    )
  }
}
