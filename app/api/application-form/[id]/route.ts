import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

// GET single application by ID

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const { id } = await context.params

    const application = await prisma.applicationForm.findUnique({
      where: {
        id,
      },
    })

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json({
      success: true,

      application,
    })
  } catch (error) {
    console.error("GET SINGLE APPLICATION ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch application",
      },

      {
        status: 500,
      }
    )
  }
}
