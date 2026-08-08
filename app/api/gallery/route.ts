import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const gender = searchParams.get("gender") || "All"
    const nickname = searchParams.get("nickname") || ""
    const customId = searchParams.get("customId") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"

    let profiles = await prisma.profile.findMany({
      include: {
        applicationForm: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Gender filter
    if (gender !== "All") {
      profiles = profiles.filter((profile) => {
        const personalDetails = profile.applicationForm?.personalDetails as any

        return personalDetails?.gender?.toLowerCase() === gender.toLowerCase()
      })
    }

    // Name filter
    if (nickname) {
      profiles = profiles.filter((profile) => {
        const personalDetails = profile.applicationForm?.personalDetails as any
        return personalDetails?.nickname
          ?.toLowerCase()
          .includes(nickname.toLowerCase())
      })
    }

    // Custom ID filter
    if (customId) {
      profiles = profiles.filter((profile) =>
        String(profile.applicationForm?.customId).padStart(4, "0").includes(customId)
      )
    }

    // Sorting
    profiles.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "customId":
          aValue = a.applicationForm?.customId
          bValue = b.applicationForm?.customId
          break

        case "nickname":
          aValue = ((a.applicationForm?.personalDetails as any)?.nickname || "").toLowerCase()
          bValue = ((b.applicationForm?.personalDetails as any)?.nickname || "").toLowerCase()
          break

        case "createdAt":
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return NextResponse.json({
      success: true,
      data: profiles,
    })
  } catch (error) {
    console.error("Fetch profiles error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profiles",
      },
      { status: 500 }
    )
  }
}
