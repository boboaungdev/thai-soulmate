import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    const review = await prisma.review.create({
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

    console.log("Review saved to database:", review)

    return NextResponse.json({ message: "Review submitted successfully!" })
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json(
      { message: "Error submitting review." },
      { status: 500 }
    )
  }
}
