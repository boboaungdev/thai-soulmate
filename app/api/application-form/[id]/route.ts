import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { ApplicationFormStatus } from "@/lib/generated/prisma/client"

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
      include: {
        notes: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        membership: true,
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

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const status = body.status as ApplicationFormStatus | undefined

    if (!status || !Object.values(ApplicationFormStatus).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid application status",
        },
        {
          status: 400,
        }
      )
    }

    const application = await prisma.applicationForm.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error) {
    console.error("UPDATE APPLICATION STATUS ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update application status",
      },
      {
        status: 500,
      }
    )
  }
}
