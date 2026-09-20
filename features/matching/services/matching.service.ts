import { Prisma } from "@/lib/generated/prisma/client"
import { MatchingRepository } from "../repositories/matching.repository"
import {
  computeMatchScore,
  calculateAge,
  DEFAULT_CRITERIA,
  ParsedApplicant,
} from "../lib/score-engine"
import {
  GetMatchesOptions,
  MatchCriteriaMap,
  MatchResult,
  MatchComparisonResult,
} from "../types"

// ─────────────────────────────────────────────────────────
// JSON parsing helpers
// ─────────────────────────────────────────────────────────

const safeParse = (json: unknown): any => {
  if (!json) return {}
  if (typeof json === "object") return json
  try {
    return JSON.parse(String(json))
  } catch {
    return {}
  }
}

// ─────────────────────────────────────────────────────────
// Tracking helpers
// ─────────────────────────────────────────────────────────

const computeTrackingStats = (trackings: any[]) => {
  const list = trackings || []
  return {
    totalTrackings: list.length,
    activeTrackings: list.filter((t) => t.status !== "CLOSED").length,
    rejectedByHim: list.filter(
      (t) =>
        (t.completedStatuses || []).includes("MALE_REJECTED") ||
        t.status === "MALE_REJECTED" ||
        (t.status === "CLOSED" && t.closedFromStatus === "MALE_REJECTED")
    ).length,
    rejectedByHer: list.filter(
      (t) =>
        (t.completedStatuses || []).includes("FEMALE_REJECTED") ||
        t.status === "FEMALE_REJECTED" ||
        (t.status === "CLOSED" && t.closedFromStatus === "FEMALE_REJECTED")
    ).length,
    matchedSuccess: list.filter(
      (t) =>
        (t.completedStatuses || []).includes("MATCHED") ||
        t.status === "MATCHED" ||
        (t.completedStatuses || []).includes("BOTH_PROFILES_ACCEPTED")
    ).length,
  }
}

const computePairHistory = (femaleTrackings: any[], maleId: string | null) => {
  if (!maleId) {
    return {
      hasExistingTracking: false,
      matchCount: 0,
      hasActiveTracking: false,
      activeTrackingId: null,
      latestTrackingId: null,
      latestStatus: null,
      latestClosedFromStatus: null,
      latestCompletedStatuses: [],
      latestDate: null,
    }
  }

  const pairTrackings = (femaleTrackings || [])
    .filter((t: any) => t.maleId === maleId)
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const activeTracking = pairTrackings.find((t: any) => t.status !== "CLOSED")
  const latest = pairTrackings[0]

  return {
    hasExistingTracking: pairTrackings.length > 0,
    matchCount: pairTrackings.length,
    hasActiveTracking: !!activeTracking,
    activeTrackingId: activeTracking ? activeTracking.id : null,
    latestTrackingId: latest ? latest.id : null,
    latestStatus: latest ? latest.status : null,
    latestClosedFromStatus: latest ? latest.closedFromStatus : null,
    latestCompletedStatuses: latest ? latest.completedStatuses || [] : [],
    latestDate: latest ? latest.createdAt : null,
  }
}

// ─────────────────────────────────────────────────────────
// Applicant parser
// ─────────────────────────────────────────────────────────

const parseApplicant = (
  applicant: any,
  selectedMaleId?: string | null
): ParsedApplicant => {
  const asFemale: any[] = applicant.asFemale || []
  const asMale: any[] = applicant.asMale || []
  const trackings =
    applicant.personalDetails?.gender === "Male" ? asMale : asFemale

  return {
    ...applicant,
    personalDetails: safeParse(applicant.personalDetails),
    career: safeParse(applicant.career),
    appearance: safeParse(applicant.appearance),
    personality: safeParse(applicant.personality),
    lifestyle: safeParse(applicant.lifestyle),
    relationshipGoals: safeParse(applicant.relationshipGoals),
    idealPartner: safeParse(applicant.idealPartner),
    financial: safeParse(applicant.financial),
    photos: safeParse(applicant.photos),
    isVip:
      applicant.membership?.plan === "FEMALE_VIP_ONE_MONTH" ||
      applicant.membership?.plan === "FEMALE_VIP_THREE_MONTHS" ||
      applicant.membership?.plan === "FEMALE_VIP_SIX_MONTHS",
    trackingStats: computeTrackingStats(trackings),
    pairHistory: computePairHistory(asFemale, selectedMaleId ?? null),
  }
}

// ─────────────────────────────────────────────────────────
// DB filter / sort helpers
// ─────────────────────────────────────────────────────────

const buildFemaleWhere = (filter: string): Prisma.ApplicationFormWhereInput => {
  const where: Prisma.ApplicationFormWhereInput = {
    personalDetails: { path: ["gender"], equals: "Female" },
  }
  if (filter === "vip") {
    where.membership = {
      is: {
        plan: {
          in: [
            "FEMALE_VIP_ONE_MONTH",
            "FEMALE_VIP_THREE_MONTHS",
            "FEMALE_VIP_SIX_MONTHS",
          ],
        },
      },
    }
  }
  if (filter === "free") {
    where.OR = [
      { membership: null },
      { membership: { is: { plan: "FEMALE_FREE" } } },
    ]
  }
  return where
}

const parseCriteria = (param: string | null | undefined): MatchCriteriaMap => {
  if (!param) return DEFAULT_CRITERIA
  try {
    return { ...DEFAULT_CRITERIA, ...JSON.parse(param) }
  } catch {
    return DEFAULT_CRITERIA
  }
}

const parseMatchRange = (range: string): [number, number] | null => {
  if (range === "all") return null
  const parts = range.split("-")
  if (parts.length !== 2) return null
  const min = parseInt(parts[0], 10)
  const max = parseInt(parts[1], 10)
  if (isNaN(min) || isNaN(max)) return null
  return [Math.min(min, max), Math.max(min, max)]
}

const compareValues = (a: unknown, b: unknown, order: string) => {
  const dir = order === "asc" ? 1 : -1
  if (typeof a === "number" && typeof b === "number") return (a - b) * dir
  return String(a ?? "").localeCompare(String(b ?? "")) * dir
}

const sortResults = (
  matches: MatchResult[],
  sortKey: string,
  sortOrder: string
) => {
  matches.sort((a, b) => {
    switch (sortKey) {
      case "age":
        return compareValues(
          calculateAge(a.applicant.personalDetails?.dob),
          calculateAge(b.applicant.personalDetails?.dob),
          sortOrder
        )
      case "createdAt":
        return compareValues(
          new Date(a.applicant.createdAt).getTime(),
          new Date(b.applicant.createdAt).getTime(),
          sortOrder
        )
      case "customId":
        return compareValues(
          a.applicant.customId,
          b.applicant.customId,
          sortOrder
        )
      case "score":
      default:
        return compareValues(a.score, b.score, sortOrder)
    }
  })
}

// ─────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────

export class MatchingService {
  /**
   * Calculate match scores for all females against a selected male.
   * Used by the dashboard matching list page.
   */
  static async calculateMatches(
    options: GetMatchesOptions
  ): Promise<MatchResult[]> {
    const {
      userId,
      criteria,
      filter = "all",
      matchRange = "all",
      sortKey = "score",
      sortOrder = "desc",
    } = options

    const enabledCriteria = parseCriteria(criteria)
    const femaleWhere = buildFemaleWhere(filter)

    const [maleApplicant, femaleApplicants] = await Promise.all([
      userId ? MatchingRepository.findMaleApplicant(userId) : null,
      MatchingRepository.findFemaleApplicants(femaleWhere),
    ])

    const parsedMale = maleApplicant
      ? parseApplicant(maleApplicant, maleApplicant.id)
      : null

    const parsedFemales = femaleApplicants.map((f) =>
      parseApplicant(f, parsedMale?.id)
    )

    if (!parsedMale) {
      // No male selected — return all females with score 0
      const basicMatches: MatchResult[] = parsedFemales.map((female) => ({
        score: 0,
        applicant: female,
      }))
      sortResults(basicMatches, sortKey, sortOrder)
      return basicMatches
    }

    let matches: MatchResult[] = parsedFemales.map((female) => {
      const { matchPercentage } = computeMatchScore(
        parsedMale,
        female,
        enabledCriteria
      )
      return { score: matchPercentage, applicant: female }
    })

    const scoreRange = parseMatchRange(matchRange)
    if (scoreRange) {
      matches = matches.filter(
        (m) => m.score >= scoreRange[0] && m.score <= scoreRange[1]
      )
    }

    sortResults(matches, sortKey, sortOrder)
    return matches
  }

  /**
   * Full match comparison between a specific male and female.
   * Used by the detail view (/matching/[maleId]/[femaleId]) and the print page.
   */
  static async getMatchComparison(
    maleId: string,
    femaleId: string
  ): Promise<{
    success: boolean
    data?: MatchComparisonResult
    error?: string
  }> {
    const { maleApplicant, femaleApplicant, pairTrackings } =
      await MatchingRepository.findComparisonApplicants(maleId, femaleId)

    if (!maleApplicant || !femaleApplicant) {
      return { success: false, error: "Applicant not found" }
    }

    const parsedMale = parseApplicant(maleApplicant, maleApplicant.id)
    const parsedFemale = parseApplicant(femaleApplicant, maleApplicant.id)

    const { matchPercentage, breakdown, dealBreakerPenalties } =
      computeMatchScore(parsedMale, parsedFemale)

    return {
      success: true,
      data: {
        male: parsedMale,
        female: parsedFemale,
        pairTrackings,
        matchPercentage,
        matchBreakdown: breakdown,
        dealBreakerPenalties,
      },
    }
  }
}
