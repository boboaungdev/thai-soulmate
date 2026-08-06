import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { WebsiteReviewNotificationEmail } from "@/emails"
import { APP_INFO, CONTACT, EMAIL } from "@/constants"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Received review:", body)

    const {
      firstImpression,
      easeOfUse,
      designBranding,
      understandingService,
      trustSafety,
      contentQuality,
      registrationProcess,
      pricingValue,
      overallExperience,
      matchmakingSpecific,
      reviewerInfo,
    } = body

    const review = await prisma.websiteReview.create({
      data: {
        firstImpression,
        easeOfUse,
        designBranding,
        understandingService,
        trustSafety,
        contentQuality,
        registrationProcess,
        pricingValue,
        overallExperience,
        matchmakingSpecific,
        reviewerInfo,
      },
    })

    const { data: adminData, error: adminError } = await resend.emails.send({
      from: `"${APP_INFO.name}" <${EMAIL.noreply}>`,
      to: ['boolean405@gmail.com'],
      subject: `[Website Review] Someone submitted a new website review`,
      react: WebsiteReviewNotificationEmail(),
    })

    if (adminError) {
      console.error("Admin email failed:", adminError)
      // Don't block the user, just log the error
    } else {
      console.log("Admin email sent:", adminData?.id)
    }

    return NextResponse.json({ message: "Review submitted successfully!" })
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json(
      { message: "Error submitting review." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const reviews = await prisma.websiteReview.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
