import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const review = await prisma.websiteReview.findUnique({
      where: { id },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error fetching website review:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching the review." },
      { status: 500 }
    )
  }
}
