import { NextResponse } from "next/server"

import { resend } from "@/lib/resend"
import { SendFemaleProfileMemberEmail } from "@/emails/member/send-female-profile-member"
import { BASE_URL } from "@/constants"
import { prisma } from "@/lib/prisma"
import { SoulmateStatus } from "@/lib/generated/prisma/enums"

type PersonalDetails = {
  email: string
  prefix: string
  name: string
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url)
  const { id: soulmateId } = await params
  const status = searchParams.get("status")

  if (!soulmateId || !status) {
    return NextResponse.redirect(
      `${BASE_URL}/action-feedback?error=Missing soulmateId or status`
    )
  }

  if (status !== "accepted" && status !== "rejected") {
    return NextResponse.redirect(
      `${BASE_URL}/action-feedback?error=Invalid status value`
    )
  }

  try {
    const soulmate = await prisma.soulmate.findUnique({
      where: { id: soulmateId },
      include: {
        male: true,
        female: true,
      },
    })

    if (!soulmate) {
      return NextResponse.redirect(
        `${BASE_URL}/action-feedback?error=Soulmate not found`
      )
    }

    // Assuming the flow is MALE_PROFILE_SENT_TO_FEMALE -> FEMALE_ACCEPTED/FEMALE_REJECT
    if (soulmate.status !== SoulmateStatus.MALE_PROFILE_SENT_TO_FEMALE) {
      return NextResponse.redirect(
        `${BASE_URL}/action-feedback?error=This action has already been processed or is not applicable at this stage.`
      )
    }

    const newStatus =
      status === "accepted"
        ? SoulmateStatus.FEMALE_ACCEPTED
        : SoulmateStatus.FEMALE_REJECT

    await prisma.soulmate.update({
      where: { id: soulmateId },
      data: { status: newStatus },
    })

    if (newStatus === SoulmateStatus.FEMALE_ACCEPTED) {
      // Send email to male
      const maleDetails = soulmate.male.personalDetails as PersonalDetails
      const femaleDetails = soulmate.female.personalDetails as PersonalDetails

      await resend.emails.send({
        from: "Thai Soulmate <noreply@thai-soulmate.com>",
        to: [maleDetails.email],
        subject: `[Soulmate] Your match has accepted!`,
        react: SendFemaleProfileMemberEmail({
          to: {
            prefix: maleDetails.prefix,
            name: maleDetails.name,
          },
          profileId: soulmate.female.id, // This is ApplicationForm ID
        }),
      })

      // Update soulmate status to FEMALE_PROFILE_SENT_TO_MALE
      await prisma.soulmate.update({
        where: { id: soulmateId },
        data: { status: SoulmateStatus.FEMALE_PROFILE_SENT_TO_MALE },
      })
    }

    return NextResponse.redirect(
      `${BASE_URL}/action-feedback?message=Your response has been recorded. Thank you!`
    )
  } catch (error) {
    console.error("Error processing soulmate status:", error)
    return NextResponse.redirect(
      `${BASE_URL}/action-feedback?error=An unexpected error occurred.`
    )
  }
}
