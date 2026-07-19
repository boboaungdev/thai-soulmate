import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        {
          status: 400,
        }
      )
    }

    const application = await prisma.applicationForm.findFirst({
      where: {
        contact: {
          path: ["email"],
          equals: email,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      exists: !!application,
      application,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    )
  }
}
