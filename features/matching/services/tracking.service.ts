import {
  Prisma,
  TrackingStatus,
  TrackingNoteType,
} from "@/lib/generated/prisma/client"
import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { SendProfileEmail } from "@/emails"
import { launchBrowser } from "@/features/matching/lib/browser"
import { APP_INFO, EMAIL } from "@/constants"
import { generateProfilePdf } from "@/features/matching/lib/generate-profile-pdf"
import { TrackingRepository } from "../repositories/tracking.repository"
import {
  GetTrackingsOptions,
  GetTrackingsResponse,
  CreateTrackingInput,
  UpdateTrackingInput,
  CreateTrackingNoteInput,
  UpdateTrackingNoteInput,
} from "../types"

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

export class TrackingService {
  static async getTrackings(
    options: GetTrackingsOptions
  ): Promise<GetTrackingsResponse> {
    const {
      search = "",
      memberId = "all",
      status = "all",
      sortKey = "updatedAt",
      sortOrder = "desc",
      page = 1,
      pageSize = 10,
    } = options

    const where: Prisma.TrackingWhereInput = {}

    if (memberId && memberId !== "all") {
      where.OR = [{ maleId: memberId }, { femaleId: memberId }]
    }

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

    const trackings = await TrackingRepository.findTrackings({
      where,
      orderBy,
    })

    const parsedTrackings = trackings.map((t) => {
      const malePersonal = safeParse(t.male?.personalDetails)
      const femalePersonal = safeParse(t.female?.personalDetails)
      const malePhotos = safeParse(t.male?.photos)
      const femalePhotos = safeParse(t.female?.photos)

      return {
        ...t,
        male: t.male
          ? {
              ...t.male,
              personalDetails: malePersonal,
              photos: malePhotos,
            }
          : null,
        female: t.female
          ? {
              ...t.female,
              personalDetails: femalePersonal,
              photos: femalePhotos,
            }
          : null,
      }
    })

    let filteredTrackings = parsedTrackings
    if (search) {
      const term = search.toLowerCase()
      filteredTrackings = parsedTrackings.filter((t) => {
        const mName = t.male?.personalDetails?.name?.toLowerCase() || ""
        const fName = t.female?.personalDetails?.name?.toLowerCase() || ""
        const mId = String(t.male?.customId || "")
        const fId = String(t.female?.customId || "")
        return (
          mName.includes(term) ||
          fName.includes(term) ||
          mId.includes(term) ||
          fId.includes(term)
        )
      })
    }

    if (sortKey === "status") {
      filteredTrackings.sort((a, b) => {
        const rankA = statusRank[a.status] || 999
        const rankB = statusRank[b.status] || 999
        return sortOrder === "asc" ? rankA - rankB : rankB - rankA
      })
    }

    const filteredCount = filteredTrackings.length
    const validPage = Math.max(1, page)
    const totalPages = Math.ceil(filteredCount / pageSize) || 1
    const skip = (validPage - 1) * pageSize
    const paginatedTrackings = filteredTrackings.slice(skip, skip + pageSize)

    const allTrackingsForMembers =
      await TrackingRepository.findAllMembersForTrackings()
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

    const totalCount = await TrackingRepository.countTrackings()

    return {
      success: true,
      trackings: paginatedTrackings,
      totalCount,
      filteredCount,
      page: validPage,
      pageSize,
      totalPages,
      allMembers,
    }
  }

  static async getTrackingById(id: string) {
    const tracking = await TrackingRepository.findTrackingById(id)
    if (!tracking) {
      return { success: false, message: "Tracking not found" }
    }

    const parsedMale = tracking.male
      ? {
          ...tracking.male,
          personalDetails: safeParse(tracking.male.personalDetails),
          career: safeParse(tracking.male.career),
          appearance: safeParse(tracking.male.appearance),
          personality: safeParse(tracking.male.personality),
          lifestyle: safeParse(tracking.male.lifestyle),
          relationshipGoals: safeParse(tracking.male.relationshipGoals),
          idealPartner: safeParse(tracking.male.idealPartner),
          financial: safeParse(tracking.male.financial),
          photos: safeParse(tracking.male.photos),
        }
      : null

    const parsedFemale = tracking.female
      ? {
          ...tracking.female,
          personalDetails: safeParse(tracking.female.personalDetails),
          career: safeParse(tracking.female.career),
          appearance: safeParse(tracking.female.appearance),
          personality: safeParse(tracking.female.personality),
          lifestyle: safeParse(tracking.female.lifestyle),
          relationshipGoals: safeParse(tracking.female.relationshipGoals),
          idealPartner: safeParse(tracking.female.idealPartner),
          financial: safeParse(tracking.female.financial),
          photos: safeParse(tracking.female.photos),
        }
      : null

    return {
      success: true,
      tracking: {
        ...tracking,
        male: parsedMale,
        female: parsedFemale,
      },
    }
  }

  static async createTracking(input: CreateTrackingInput) {
    const { maleId, femaleId, matchPercentage } = input

    if (!maleId || !femaleId) {
      return { success: false, message: "maleId and femaleId are required" }
    }

    const existingSoulmate = await TrackingRepository.findActiveTrackingBetween(
      maleId,
      femaleId
    )

    if (existingSoulmate) {
      return {
        success: false,
        message: "These soulmates are already actively connected.",
      }
    }

    const tracking = await TrackingRepository.createTracking({
      maleId,
      femaleId,
      matchPercentage,
    })

    return { success: true, tracking }
  }

  static async updateTracking(id: string, input: UpdateTrackingInput) {
    const tracking = await TrackingRepository.findTrackingById(id)
    if (!tracking) {
      return { success: false, message: "Tracking not found" }
    }

    const { status, note, changedBy = "Matchmaker" } = input

    if (!status) {
      return { success: false, message: "Missing status" }
    }

    const existingStatuses = tracking.completedStatuses || [
      TrackingStatus.INITIAL_CONNECT,
    ]
    const updatedStatusesSet = new Set([...existingStatuses, status])
    let finalStatus: TrackingStatus = status
    let closedFromStatus: TrackingStatus | undefined = undefined

    const isReviewResponse =
      status === TrackingStatus.FEMALE_ACCEPTED ||
      status === TrackingStatus.FEMALE_REJECTED ||
      status === TrackingStatus.MALE_ACCEPTED ||
      status === TrackingStatus.MALE_REJECTED

    if (isReviewResponse) {
      updatedStatusesSet.add(status)
      const maleHasResponded =
        status === TrackingStatus.MALE_ACCEPTED ||
        status === TrackingStatus.MALE_REJECTED ||
        existingStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
        existingStatuses.includes(TrackingStatus.MALE_REJECTED)

      const femaleHasResponded =
        status === TrackingStatus.FEMALE_ACCEPTED ||
        status === TrackingStatus.FEMALE_REJECTED ||
        existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
        existingStatuses.includes(TrackingStatus.FEMALE_REJECTED)

      if (maleHasResponded && femaleHasResponded) {
        const maleAccepted =
          status === TrackingStatus.MALE_ACCEPTED ||
          existingStatuses.includes(TrackingStatus.MALE_ACCEPTED)
        const femaleAccepted =
          status === TrackingStatus.FEMALE_ACCEPTED ||
          existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED)

        if (maleAccepted && femaleAccepted) {
          finalStatus = TrackingStatus.BOTH_PROFILES_ACCEPTED
          updatedStatusesSet.add(TrackingStatus.MALE_ACCEPTED)
          updatedStatusesSet.add(TrackingStatus.FEMALE_ACCEPTED)
          updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_ACCEPTED)
        } else {
          finalStatus = TrackingStatus.CLOSED
          closedFromStatus = status.includes("REJECTED")
            ? status
            : tracking.status
          updatedStatusesSet.add(TrackingStatus.CLOSED)
        }
      } else {
        finalStatus = status
      }
    } else if (status === TrackingStatus.BOTH_PROFILES_ACCEPTED) {
      finalStatus = TrackingStatus.BOTH_PROFILES_ACCEPTED
      updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_SENT)
      updatedStatusesSet.add(TrackingStatus.MALE_ACCEPTED)
      updatedStatusesSet.add(TrackingStatus.FEMALE_ACCEPTED)
      updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_ACCEPTED)
    } else if (status === TrackingStatus.BOTH_PROFILES_SENT) {
      finalStatus = TrackingStatus.BOTH_PROFILES_SENT
      updatedStatusesSet.add(TrackingStatus.INITIAL_CONNECT)
      updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_SENT)
    } else if (status === TrackingStatus.CLOSED) {
      finalStatus = TrackingStatus.CLOSED
      closedFromStatus = tracking.status
      updatedStatusesSet.add(TrackingStatus.CLOSED)
    }

    const updatedCompletedStatuses = Array.from(updatedStatusesSet)

    const dataToUpdate: Prisma.TrackingUpdateInput = {
      status: finalStatus,
      completedStatuses: updatedCompletedStatuses,
      statusHistory: {
        create: {
          status,
          changedBy,
          note: note || `Status updated to ${status}`,
        },
      },
    }

    if (closedFromStatus) {
      dataToUpdate.closedFromStatus = closedFromStatus
    }

    const updatedTracking = await TrackingRepository.updateTracking(
      id,
      dataToUpdate
    )
    return { success: true, tracking: updatedTracking }
  }

  static async deleteTracking(id: string) {
    await TrackingRepository.deleteTracking(id)
    return { success: true }
  }

  static async sendTrackingProfiles(data: {
    trackingId: string
    male: any
    female: any
  }) {
    let browser
    const { trackingId, male, female } = data

    try {
      const maleProfileUrl = `${env.BASE_URL}/print/${male.profile?.id || male.id}/profile`
      const femaleProfileUrl = `${env.BASE_URL}/print/${female.profile?.id || female.id}/profile`

      browser = await launchBrowser()

      const malePdf = await generateProfilePdf(browser, maleProfileUrl)
      const femalePdf = await generateProfilePdf(browser, femaleProfileUrl)

      const [femaleResult, maleResult] = await Promise.all([
        resend.emails.send({
          from: `${APP_INFO.name} <${EMAIL.contact}>`,
          to: EMAIL.NOTIFICATIONS,
          subject:
            "[Soulmate] A carefully selected match is waiting for your review.",
          react: SendProfileEmail({
            to: female.personalDetails,
            trackingId,
          }),
          attachments: [
            {
              filename: `Profile-ID-${male.customId}.pdf`,
              content: malePdf,
            },
          ],
        }),

        resend.emails.send({
          from: `${APP_INFO.name} <${EMAIL.contact}>`,
          to: EMAIL.NOTIFICATIONS,
          subject:
            "[Soulmate] A carefully selected match is waiting for your review.",
          react: SendProfileEmail({
            to: male.personalDetails,
            trackingId,
          }),
          attachments: [
            {
              filename: `Profile-ID-${female.customId}.pdf`,
              content: femalePdf,
            },
          ],
        }),
      ])

      if (femaleResult.error || maleResult.error) {
        console.error("Email send error:", femaleResult.error, maleResult.error)
        throw new Error("Failed to send profile emails")
      }

      const existingTracking = await prisma.tracking.findUnique({
        where: { id: trackingId },
        select: { completedStatuses: true },
      })

      const updatedCompletedStatuses = Array.from(
        new Set([
          ...(existingTracking?.completedStatuses || [
            TrackingStatus.INITIAL_CONNECT,
          ]),
          TrackingStatus.BOTH_PROFILES_SENT,
        ])
      )

      const updatedTracking = await prisma.tracking.update({
        where: { id: trackingId },
        data: {
          status: TrackingStatus.BOTH_PROFILES_SENT,
          completedStatuses: updatedCompletedStatuses,
          statusHistory: {
            create: {
              status: TrackingStatus.BOTH_PROFILES_SENT,
              changedBy: "Matchmaker",
              note: "Profiles sent to both soulmates for review",
            },
          },
        },
      })

      return { success: true as const, tracking: updatedTracking }
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }

  static async processTrackingEmailResponse(params: {
    trackingId: string
    response: string
    from: string
  }): Promise<{ success: boolean; message: string }> {
    const { trackingId, response, from } = params

    if (
      !trackingId ||
      (response !== "accepted" && response !== "rejected") ||
      (from !== "male" && from !== "female")
    ) {
      return { success: false, message: "Invalid request parameters." }
    }

    return await prisma.$transaction(async (tx) => {
      const tracking = await tx.tracking.findUnique({
        where: { id: trackingId },
        include: {
          male: { include: { profile: true } },
          female: { include: { profile: true } },
        },
      })

      if (!tracking) {
        return { success: false, message: "Tracking not found." }
      }

      const allowedInitialStatuses: TrackingStatus[] = [
        TrackingStatus.BOTH_PROFILES_SENT,
        TrackingStatus.MALE_ACCEPTED,
        TrackingStatus.MALE_REJECTED,
        TrackingStatus.FEMALE_ACCEPTED,
        TrackingStatus.FEMALE_REJECTED,
      ]

      if (!allowedInitialStatuses.includes(tracking.status)) {
        return {
          success: true,
          message:
            "This introduction is no longer active or your response has already been recorded.",
        }
      }

      const isMale = from === "male"
      const responseStatus =
        response === "accepted"
          ? isMale
            ? TrackingStatus.MALE_ACCEPTED
            : TrackingStatus.FEMALE_ACCEPTED
          : isMale
            ? TrackingStatus.MALE_REJECTED
            : TrackingStatus.FEMALE_REJECTED

      const existingStatuses = tracking.completedStatuses || [
        TrackingStatus.INITIAL_CONNECT,
        TrackingStatus.BOTH_PROFILES_SENT,
      ]

      if (
        (isMale &&
          (existingStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
            existingStatuses.includes(TrackingStatus.MALE_REJECTED))) ||
        (!isMale &&
          (existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
            existingStatuses.includes(TrackingStatus.FEMALE_REJECTED)))
      ) {
        return {
          success: true,
          message: "Your response has already been recorded. Thank you!",
        }
      }

      const updatedStatusesSet = new Set([...existingStatuses, responseStatus])
      let finalStatus: TrackingStatus = responseStatus
      let closedFromStatus: TrackingStatus | undefined = undefined

      const otherHasResponded = isMale
        ? existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
          existingStatuses.includes(TrackingStatus.FEMALE_REJECTED) ||
          tracking.status === TrackingStatus.FEMALE_ACCEPTED ||
          tracking.status === TrackingStatus.FEMALE_REJECTED
        : existingStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
          existingStatuses.includes(TrackingStatus.MALE_REJECTED) ||
          tracking.status === TrackingStatus.MALE_ACCEPTED ||
          tracking.status === TrackingStatus.MALE_REJECTED

      if (otherHasResponded) {
        const femaleAccepted = isMale
          ? existingStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
            tracking.status === TrackingStatus.FEMALE_ACCEPTED
          : responseStatus === TrackingStatus.FEMALE_ACCEPTED

        const maleAccepted = isMale
          ? responseStatus === TrackingStatus.MALE_ACCEPTED
          : existingStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
            tracking.status === TrackingStatus.MALE_ACCEPTED

        if (femaleAccepted && maleAccepted) {
          finalStatus = TrackingStatus.BOTH_PROFILES_ACCEPTED
          updatedStatusesSet.add(TrackingStatus.MALE_ACCEPTED)
          updatedStatusesSet.add(TrackingStatus.FEMALE_ACCEPTED)
          updatedStatusesSet.add(TrackingStatus.BOTH_PROFILES_ACCEPTED)
        } else {
          finalStatus = TrackingStatus.CLOSED
          closedFromStatus = responseStatus.includes("REJECTED")
            ? responseStatus
            : tracking.status
          updatedStatusesSet.add(TrackingStatus.CLOSED)
        }
      }

      const updatedCompletedStatuses = Array.from(updatedStatusesSet)

      await tx.tracking.update({
        where: { id: trackingId },
        data: {
          status: finalStatus,
          completedStatuses: updatedCompletedStatuses,
          closedFromStatus,
          statusHistory: {
            create: {
              status: responseStatus,
              changedBy: isMale ? "Male Candidate" : "Female Candidate",
              note: `Candidate ${response} the introduction.`,
            },
          },
        },
      })

      return {
        success: true,
        message: "Your response has been recorded. Thank you!",
      }
    })
  }

  // --- Tracking Notes ---
  static async getTrackingNotes(trackingId: string) {
    const notes = await TrackingRepository.findTrackingNotes(trackingId)
    return { success: true, notes }
  }

  static async addTrackingNote(
    trackingId: string,
    data: CreateTrackingNoteInput
  ) {
    const note = await TrackingRepository.createTrackingNote({
      trackingId,
      userId: data.userId,
      message: data.message,
      type: data.type,
    })
    return { success: true as const, note }
  }

  static async updateTrackingNote(
    trackingId: string,
    noteId: string,
    data: UpdateTrackingNoteInput
  ) {
    const existing = await TrackingRepository.findTrackingNoteById(noteId)
    if (!existing || existing.trackingId !== trackingId) {
      return { success: false as const, error: "Note not found" }
    }
    const note = await TrackingRepository.updateTrackingNote(noteId, data)
    return { success: true as const, note }
  }

  static async deleteTrackingNote(trackingId: string, noteId: string) {
    const existing = await TrackingRepository.findTrackingNoteById(noteId)
    if (!existing || existing.trackingId !== trackingId) {
      return { success: false as const, error: "Note not found" }
    }
    await TrackingRepository.deleteTrackingNote(noteId)
    return { success: true as const }
  }
}
