import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Role } from "@/lib/generated/prisma/enums"

export async function POST(req: Request) {
  try {
    const { name, email, password, role, avatar } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      )
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Storing plain text password as requested
        role: role || Role.USER,
        avatar,
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
    })

    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    )
  }
}

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
