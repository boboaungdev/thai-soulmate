import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { Role } from "@/lib/generated/prisma/client"

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing user ID.",
        },
        { status: 401 }
      )
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Not an admin.",
        },
        { status: 403 }
      )
    }

    const resolvedParams = await context.params // Await the promise
    const { id: idToDelete } = resolvedParams // Access properties from the resolved object

    if (adminUser.id === idToDelete) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin cannot delete themself.",
        },
        { status: 400 }
      )
    }

    // check if user exists
    const userToDelete = await prisma.user.findUnique({
      where: { id: idToDelete },
    })

    if (!userToDelete) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 }
      )
    }

    // you can't delete another admin
    if (userToDelete.role === Role.ADMIN) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete another admin.",
        },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: {
        id: idToDelete,
      },
    })

    return NextResponse.json({ success: true, message: "User deleted." })
  } catch (error) {
    console.error("DELETE USER ERROR:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      { status: 500 }
    )
  }
}
