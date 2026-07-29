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

    let applicationForms = await prisma.applicationForm.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    // Gender filter
    if (gender !== "All") {
      applicationForms = applicationForms.filter((form) => {
        const personalDetails = form.personalDetails as any

        return personalDetails?.gender?.toLowerCase() === gender.toLowerCase()
      })
    }

    // Name filter
    if (nickname) {
      applicationForms = applicationForms.filter((form) => {
        const personalDetails = form.personalDetails as any
        return personalDetails?.nickname
          ?.toLowerCase()
          .includes(nickname.toLowerCase())
      })
    }

    // Custom ID filter
    if (customId) {
      applicationForms = applicationForms.filter((form) =>
        String(form.customId).padStart(4, "0").includes(customId)
      )
    }

    // Sorting
    applicationForms.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "customId":
          aValue = a.customId
          bValue = b.customId
          break

        case "nickname":
          aValue = ((a.personalDetails as any)?.nickname || "").toLowerCase()
          bValue = ((b.personalDetails as any)?.nickname || "").toLowerCase()
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
      data: applicationForms,
    })
  } catch (error) {
    console.error("Fetch application forms error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch application forms",
      },
      { status: 500 }
    )
  }
}
