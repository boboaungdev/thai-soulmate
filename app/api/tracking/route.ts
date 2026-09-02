import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma, TrackingStatus } from "@/lib/generated/prisma/client"

const safeParse = (json: unknown): any => {
  if (!json) return {}
  if (typeof json === "object") return json
  try {
    return JSON.parse(String(json))
  } catch {
    return {}
  }
}

const statusRank: Record<string, number> = {
  INITIAL_CONNECT: 1,
  BOTH_PROFILES_SENT: 2,
  FEMALE_REVIEW: 3,
  FEMALE_THINKING: 4,
  FEMALE_ACCEPTED: 5,
  FEMALE_REJECTED: 6,
  MALE_REVIEW: 7,
  MALE_THINKING: 8,
  MALE_ACCEPTED: 9,
  MALE_REJECTED: 10,
  BOTH_PROFILES_ACCEPTED: 11,
  FIRST_GOOGLE_MEET: 12,
  SECOND_GOOGLE_MEET: 13,
  FIRST_FOLLOW_UP: 14,
  SECOND_FOLLOW_UP: 15,
  THIRD_FOLLOW_UP: 16,
  MATCHED: 17,
  CLOSED: 18,
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")?.trim() || ""
  const memberId = searchParams.get("memberId") || "all"
  const status = searchParams.get("status") || "all"
  const sortKey = searchParams.get("sortKey") || "updatedAt"
  const sortOrder = (searchParams.get("sortOrder") || "desc").toLowerCase() as
    "asc" | "desc"
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const pageSize = Math.max(
    1,
    parseInt(
      searchParams.get("pageSize") || searchParams.get("limit") || "10",
      10
    )
  )

  try {
    const where: Prisma.TrackingWhereInput = {}

    // Filter by member ID
    if (memberId && memberId !== "all") {
      where.OR = [{ maleId: memberId }, { femaleId: memberId }]
    }

    // Filter by status
    if (status === "active") {
      where.status = { not: TrackingStatus.CLOSED }
    } else if (status === "closed") {
      where.status = TrackingStatus.CLOSED
    } else if (
      status &&
      status !== "all" &&
      Object.values(TrackingStatus).includes(status as TrackingStatus)
    ) {
      where.status = status as TrackingStatus
    }

    // Determine Prisma orderBy if direct database field
    let orderBy: Prisma.TrackingOrderByWithRelationInput = {
      updatedAt: "desc",
    }
    if (sortKey === "createdAt") {
      orderBy = { createdAt: sortOrder }
    } else if (sortKey === "updatedAt") {
      orderBy = { updatedAt: sortOrder }
    } else if (sortKey === "matchPercentage") {
      orderBy = { matchPercentage: sortOrder }
    }

    // Fetch all trackings matching where clause
    const trackings = await prisma.tracking.findMany({
      where,
      include: {
        male: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
            profile: true,
          },
        },
        female: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
            profile: true,
          },
        },
        notes: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy,
    })

    // Parse JSON details for safe access
    let parsedTrackings = trackings.map((t) => ({
      ...t,
      male: {
        ...t.male,
        personalDetails: safeParse(t.male.personalDetails),
        photos: safeParse(t.male.photos),
      },
      female: {
        ...t.female,
        personalDetails: safeParse(t.female.personalDetails),
        photos: safeParse(t.female.photos),
      },
    }))

    // Search filter on server side (across male/female names, customIds, nicknames, and note messages)
    if (search) {
      const q = search.toLowerCase()
      parsedTrackings = parsedTrackings.filter((t) => {
        const maleName = String(
          t.male?.personalDetails?.name || ""
        ).toLowerCase()
        const maleNick = String(
          t.male?.personalDetails?.nickname || ""
        ).toLowerCase()
        const maleId = String(t.male?.customId || "")
        const femaleName = String(
          t.female?.personalDetails?.name || ""
        ).toLowerCase()
        const femaleNick = String(
          t.female?.personalDetails?.nickname || ""
        ).toLowerCase()
        const femaleId = String(t.female?.customId || "")
        const notesMatch = (t.notes || []).some((n) =>
          String(n.message || "")
            .toLowerCase()
            .includes(q)
        )

        return (
          maleName.includes(q) ||
          maleNick.includes(q) ||
          maleId.includes(q) ||
          femaleName.includes(q) ||
          femaleNick.includes(q) ||
          femaleId.includes(q) ||
          notesMatch
        )
      })
    }

    // Custom status progression sorting on server side if sortKey is "status"
    if (sortKey === "status") {
      parsedTrackings.sort((a, b) => {
        const rankA = statusRank[a.status] || 0
        const rankB = statusRank[b.status] || 0
        const comp = rankA - rankB
        return sortOrder === "desc" ? -comp : comp
      })
    }

    // Pagination calculations
    const filteredCount = parsedTrackings.length
    const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize))
    const validPage = Math.min(page, totalPages)
    const startIndex = (validPage - 1) * pageSize
    const paginatedTrackings = parsedTrackings.slice(
      startIndex,
      startIndex + pageSize
    )

    // Also fetch unique members across all trackings for the member dropdown
    const allTrackingsForMembers = await prisma.tracking.findMany({
      select: {
        male: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
          },
        },
        female: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
          },
        },
      },
    })

    const memberMap = new Map<
      string,
      {
        id: string
        name: string
        prefix?: string
        customId: number
        gender: "Male" | "Female"
        headshot?: string
      }
    >()
    allTrackingsForMembers.forEach((t) => {
      if (t.male?.id && !memberMap.has(t.male.id)) {
        const pd = safeParse(t.male.personalDetails)
        const ph = safeParse(t.male.photos)
        memberMap.set(t.male.id, {
          id: t.male.id,
          name: pd?.name || "Unknown Male",
          prefix: pd?.prefix || "",
          customId: t.male.customId,
          gender: "Male",
          headshot: ph?.headshot || "",
        })
      }
      if (t.female?.id && !memberMap.has(t.female.id)) {
        const pd = safeParse(t.female.personalDetails)
        const ph = safeParse(t.female.photos)
        memberMap.set(t.female.id, {
          id: t.female.id,
          name: pd?.name || "Unknown Female",
          prefix: pd?.prefix || "",
          customId: t.female.customId,
          gender: "Female",
          headshot: ph?.headshot || "",
        })
      }
    })

    const allMembers = Array.from(memberMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    const totalCount = await prisma.tracking.count()

    return NextResponse.json({
      success: true,
      trackings: paginatedTrackings,
      totalCount,
      filteredCount,
      page: validPage,
      pageSize,
      totalPages,
      allMembers,
    })
  } catch (error) {
    console.error("GET TRACKING ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trackings",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { maleId, femaleId, matchPercentage } = body

    if (!maleId || !femaleId) {
      return NextResponse.json(
        {
          success: false,
          message: "maleId and femaleId are required",
        },
        {
          status: 400,
        }
      )
    }

    // Check if an active tracking connection already exists
    const existingSoulmate = await prisma.tracking.findFirst({
      where: {
        OR: [
          {
            maleId,
            femaleId,
          },
          {
            maleId: femaleId,
            femaleId: maleId,
          },
        ],
        status: {
          not: "CLOSED",
        },
      },
    })

    if (existingSoulmate) {
      return NextResponse.json(
        {
          success: false,
          message: "These soulmates are already actively connected.",
        },
        { status: 409 }
      )
    }

    const tracking = await prisma.tracking.create({
      data: {
        maleId,
        femaleId,
        matchPercentage,
        status: "INITIAL_CONNECT",
        completedStatuses: ["INITIAL_CONNECT"],
      },
    })

    return NextResponse.json({
      success: true,
      tracking,
    })
  } catch (error) {
    console.error("CREATE SOULMATE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create tracking",
      },
      {
        status: 500,
      }
    )
  }
}
