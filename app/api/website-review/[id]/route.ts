import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.websiteReview.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Review deleted successfully." })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      { message: "Error deleting review." },
      { status: 500 }
    )
  }
}
