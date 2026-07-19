import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page")) || 1

    const limit = Number(searchParams.get("limit")) || 10

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,

        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,

          registerInterest: {
            select: {
              id: true,
              gender: true,
              nationality: true,
              currentLocation: true,
            },
          },
        },
      }),

      prisma.user.count(),
    ])

    return NextResponse.json({
      success: true,

      data: users,

      pagination: {
        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Fetch users error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      {
        status: 500,
      }
    )
  }
}
