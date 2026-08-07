import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Contact ID is required." },
        { status: 400 }
      )
    }

    await prisma.contact.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully.",
    })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete contact." },
      { status: 500 }
    )
  }
}
