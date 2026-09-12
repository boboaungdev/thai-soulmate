import { Prisma } from "@/lib/generated/prisma/client"
import { MatchingRepository } from "../repositories/matching.repository"
import {
  GetMatchesOptions,
  MatchBreakdownItem,
  MatchCriteriaMap,
  MatchResult,
  DealBreakerPenalty,
  MatchComparisonResult,
} from "../types"

// Helper to safely parse JSON properties
const safeParse = (json: unknown): any => {
  if (!json) return {}
  if (typeof json === "object") return json
  try {
    return JSON.parse(String(json))
  } catch {
    return {}
  }
}

// Helper to calculate age from DOB
const calculateAge = (dob: string | Date | null | undefined): number => {
  if (!dob) return 0
  const birthDate = new Date(dob)
  if (Number.isNaN(birthDate.getTime())) return 0

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }
  return age
}

const defaultCriteria: MatchCriteriaMap = {
  "Ideal Partner Age Range": true,
  "Ideal Partner Height": true,
  "Ideal Partner Weight": true,
  "Ideal Partner Nationality": true,
  "Ideal Partner Location": true,
  "Ideal Partner Education": true,
  "Ideal Partner Qualities": true,
  "Ideal Partner Personality": true,
  "Deal Breakers": true,
  "Relocation Preference": true,
  "Smoking Preference": true,
  "Drinking Preference": true,
  "Children Preference": true,
  Hobbies: true,
  "Languages Spoken %": true,
}

const toArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()

const displayValue = (value: unknown) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ")
  if (value === undefined || value === null || value === "")
    return "Not provided"
  return String(value)
}

const matchExact = (preferred: unknown, actual: unknown) => {
  const normalizedPreferred = normalize(preferred)
  if (
    !normalizedPreferred ||
    normalizedPreferred === "not important" ||
    normalizedPreferred === "any"
  ) {
    return true
  }
  return normalizedPreferred === normalize(actual)
}

const parseAgeRange = (range: unknown): [number, number] | null => {
  const value = String(range ?? "").trim()
  if (!value) return null

  if (value.endsWith("+")) {
    const min = Number.parseInt(value, 10)
    return Number.isFinite(min) ? [min, 120] : null
  }

  const [min, max] = value.split("-").map((part) => Number.parseInt(part, 10))
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null
  return [min, max]
}

const heightToCm = (value: unknown) => {
  const numeric = Number.parseFloat(String(value ?? "").replace(/[^\d.]/g, ""))
  return Number.isFinite(numeric) ? numeric : 0
}

const matchesHeightRange = (preferredRange: unknown, actualHeight: unknown) => {
  const height = heightToCm(actualHeight)
  const range = normalize(preferredRange)
  if (!height || !range) return false

  if (range.includes("under")) return height < 152
  if (range.includes("5.6") || range.includes("5.9")) {
    return height >= 168 && height <= 180
  }
  if (range.includes("5") && range.includes("5.5")) {
    return height >= 152 && height <= 167
  }
  if (range.includes("6")) return height >= 183
  return false
}

const matchesWeightRange = (preferredRange: unknown, actualWeight: unknown) => {
  const weight = Number.parseFloat(
    String(actualWeight ?? "").replace(/[^\d.]/g, "")
  )
  const range = normalize(preferredRange)
  if (!weight || !range) return false

  if (range.includes("under 50")) return weight < 50
  if (range.includes("50-60")) return weight >= 50 && weight <= 60
  if (range.includes("60-70")) return weight >= 60 && weight <= 70
  if (range.includes("over 70")) return weight > 70
  return false
}

const intersectionCount = (preferred: unknown, actual: unknown) => {
  const actualItems = new Set(toArray(actual).map(normalize))
  return toArray(preferred).filter((item) => actualItems.has(normalize(item)))
    .length
}

const getFluencyPoints = (first: number, second: number) =>
  Math.round(Math.max(0, 1 - Math.abs(first - second) / 100) * 5)

const REGIONS = [
  "asia",
  "europe",
  "africa",
  "oceania",
  "americas",
  "polar",
  "antarctic ocean",
  "antarctic",
  "any",
]

const REGION_ALIASES: Record<string, string> = {
  asian: "asia",
  european: "europe",
  african: "africa",
  oceanian: "oceania",
  american: "americas",
}

const matchRegion = (
  preferred: unknown,
  actualCountry: unknown,
  actualRegion: unknown
) => {
  const normalizedPreferred = normalize(preferred)
  if (
    !normalizedPreferred ||
    normalizedPreferred === "any" ||
    normalizedPreferred === "not important"
  ) {
    return true
  }

  const targetRegion =
    REGION_ALIASES[normalizedPreferred] || normalizedPreferred

  if (REGIONS.includes(targetRegion)) {
    return normalize(actualRegion) === targetRegion
  }

  return normalize(actualCountry) === normalizedPreferred
}

const addCriterionScore = ({
  enabled,
  points,
  possiblePoints,
  matched,
  score,
  possibleScore,
}: {
  enabled: boolean
  weight: number
  points?: number
  possiblePoints?: number
  matched: boolean
  score: number
  possibleScore: number
}) => ({
  score: score + (enabled ? (points ?? (matched ? 1 : 0)) : 0),
  possibleScore: possibleScore + (enabled ? (possiblePoints ?? 1) : 0),
})

const parseCriteria = (criteriaParam: string | null | undefined) => {
  if (!criteriaParam) return defaultCriteria

  try {
    return {
      ...defaultCriteria,
      ...JSON.parse(criteriaParam),
    }
  } catch {
    return defaultCriteria
  }
}

const computeTrackingStats = (trackings: any[]) => {
  const list = trackings || []
  const totalTrackings = list.length
  const activeTrackings = list.filter((t) => t.status !== "CLOSED").length
  const rejectedByHim = list.filter(
    (t) =>
      (t.completedStatuses || []).includes("MALE_REJECTED") ||
      t.status === "MALE_REJECTED" ||
      (t.status === "CLOSED" && t.closedFromStatus === "MALE_REJECTED")
  ).length
  const rejectedByHer = list.filter(
    (t) =>
      (t.completedStatuses || []).includes("FEMALE_REJECTED") ||
      t.status === "FEMALE_REJECTED" ||
      (t.status === "CLOSED" && t.closedFromStatus === "FEMALE_REJECTED")
  ).length
  const matchedSuccess = list.filter(
    (t) =>
      (t.completedStatuses || []).includes("MATCHED") ||
      t.status === "MATCHED" ||
      (t.completedStatuses || []).includes("BOTH_PROFILES_ACCEPTED")
  ).length

  return {
    totalTrackings,
    activeTrackings,
    rejectedByHim,
    rejectedByHer,
    matchedSuccess,
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

  const hasExistingTracking = pairTrackings.length > 0
  const activeTracking = pairTrackings.find((t: any) => t.status !== "CLOSED")
  const latest = pairTrackings[0]

  return {
    hasExistingTracking,
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

const parseApplicant = (applicant: any, selectedMaleId?: string | null) => {
  const asFemale = applicant.asFemale || []
  const asMale = applicant.asMale || []
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
    pairHistory: computePairHistory(asFemale, selectedMaleId || null),
  }
}

const buildFemaleWhere = (filter: string): Prisma.ApplicationFormWhereInput => {
  const where: Prisma.ApplicationFormWhereInput = {
    personalDetails: {
      path: ["gender"],
      equals: "Female",
    },
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

const compareValues = (a: unknown, b: unknown, order: string) => {
  const direction = order === "asc" ? 1 : -1
  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * direction
  }

  return String(a ?? "").localeCompare(String(b ?? "")) * direction
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

const parseMatchRangeParam = (range: string): [number, number] | null => {
  if (range === "all") return null
  const parts = range.split("-")
  if (parts.length !== 2) return null
  const min = parseInt(parts[0], 10)
  const max = parseInt(parts[1], 10)
  if (isNaN(min) || isNaN(max)) return null
  return [Math.min(min, max), Math.max(min, max)]
}

export class MatchingService {
  static async calculateMatches(options: GetMatchesOptions): Promise<MatchResult[]> {
    const {
      userId,
      criteria,
      filter = "all",
      matchRange = "all",
      sortKey = "score",
      sortOrder = "desc",
    } = options

    const activeCriteria = parseCriteria(criteria)
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
      const basicMatches: MatchResult[] = parsedFemales.map((female) => ({
        score: 0,
        applicant: female,
      }))
      sortResults(basicMatches, sortKey, sortOrder)
      return basicMatches
    }

    const maleIdealPartner = parsedMale.idealPartner || {}
    const malePreferredAgeRange = parseAgeRange(maleIdealPartner.ageRange)

    let matches: MatchResult[] = parsedFemales.map((female) => {
      const femalePersonal = female.personalDetails || {}
      const femaleLifestyle = female.lifestyle || {}
      const femaleAppearance = female.appearance || {}
      const femaleCareer = female.career || {}
      const femalePersonality = female.personality || {}

      let score = 0
      let totalPossibleScore = 0

      // Age Range
      const femaleAge = calculateAge(femalePersonal.dob)
      const ageMatches =
        malePreferredAgeRange && femaleAge > 0
          ? femaleAge >= malePreferredAgeRange[0] &&
            femaleAge <= malePreferredAgeRange[1]
          : true

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Age Range"],
        weight: 10,
        matched: Boolean(ageMatches),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Height
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Height"],
        weight: 5,
        matched: matchesHeightRange(
          maleIdealPartner.height,
          femaleAppearance.height
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Weight
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Weight"],
        weight: 5,
        matched: matchesWeightRange(
          maleIdealPartner.weight,
          femaleAppearance.weight
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Nationality
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Nationality"],
        weight: 5,
        matched: matchRegion(
          maleIdealPartner.nationality,
          femalePersonal.nationality,
          femalePersonal.nationalityRegion
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Location
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Location"],
        weight: 5,
        matched: matchRegion(
          maleIdealPartner.currentLocation,
          femalePersonal.currentLocation,
          femalePersonal.currentLocationRegion
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Education
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Education"],
        weight: 5,
        matched: matchExact(
          maleIdealPartner.education,
          femaleCareer.education
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Qualities
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Qualities"],
        weight: 10,
        matched:
          intersectionCount(
            maleIdealPartner.qualities,
            femalePersonality.qualities
          ) > 0,
        points: intersectionCount(
          maleIdealPartner.qualities,
          femalePersonality.qualities
        ),
        possiblePoints: Math.max(toArray(maleIdealPartner.qualities).length, 1),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Personality
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Personality"],
        weight: 5,
        matched:
          intersectionCount(
            maleIdealPartner.personalityTraits,
            femalePersonality.characterTraits
          ) > 0,
        points: intersectionCount(
          maleIdealPartner.personalityTraits,
          femalePersonality.characterTraits
        ),
        possiblePoints: Math.max(
          toArray(maleIdealPartner.personalityTraits).length,
          1
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Relocation
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Relocation Preference"],
        weight: 5,
        matched: matchExact(
          maleIdealPartner.relocation,
          femalePersonal.willingToRelocate
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Smoking
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Smoking Preference"],
        weight: 5,
        matched: matchExact(
          maleIdealPartner.smoking,
          femaleLifestyle.smoking
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Drinking
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Drinking Preference"],
        weight: 5,
        matched: matchExact(
          maleIdealPartner.drinking,
          femaleLifestyle.drinking
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Children
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Children Preference"],
        weight: 5,
        matched: matchExact(
          maleIdealPartner.children,
          femalePersonality.hasChildren
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Hobbies
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria.Hobbies,
        weight: 10,
        matched:
          intersectionCount(
            parsedMale.lifestyle.interests,
            femaleLifestyle.interests
          ) > 0,
        points: intersectionCount(
          parsedMale.lifestyle.interests,
          femaleLifestyle.interests
        ),
        possiblePoints: Math.max(
          toArray(parsedMale.lifestyle.interests).length,
          1
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // English Fluency
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Languages Spoken %"],
        weight: 5,
        matched:
          getFluencyPoints(
            Number(parsedMale.appearance?.englishFluency?.[0] ?? 0),
            Number(femaleAppearance.englishFluency?.[0] ?? 0)
          ) > 0,
        points: getFluencyPoints(
          Number(parsedMale.appearance?.englishFluency?.[0] ?? 0),
          Number(femaleAppearance.englishFluency?.[0] ?? 0)
        ),
        possiblePoints: 5,
        score,
        possibleScore: totalPossibleScore,
      }))

      // Thai Fluency
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Languages Spoken %"],
        weight: 5,
        matched:
          getFluencyPoints(
            Number(parsedMale.appearance?.thaiFluency?.[0] ?? 0),
            Number(femaleAppearance.thaiFluency?.[0] ?? 0)
          ) > 0,
        points: getFluencyPoints(
          Number(parsedMale.appearance?.thaiFluency?.[0] ?? 0),
          Number(femaleAppearance.thaiFluency?.[0] ?? 0)
        ),
        possiblePoints: 5,
        score,
        possibleScore: totalPossibleScore,
      }))

      // Deal breakers
      if (activeCriteria["Deal Breakers"]) {
        const dealBreakers = toArray(maleIdealPartner.dealBreakers)
          .map(normalize)
          .join(" ")
        if (
          dealBreakers.includes("smok") &&
          femaleLifestyle.smoking !== "Never"
        ) {
          score -= 40
        }
        if (
          dealBreakers.includes("drink") &&
          normalize(femaleLifestyle.drinking) === "frequently"
        ) {
          score -= 30
        }
        if (
          dealBreakers.includes("children") &&
          normalize(femalePersonality.hasChildren) === "yes"
        ) {
          score -= 30
        }
      }

      const finalScore =
        totalPossibleScore > 0
          ? Math.round((score / totalPossibleScore) * 100)
          : 100

      return {
        score: Math.max(0, finalScore),
        applicant: female,
      }
    })

    const scoreRange = parseMatchRangeParam(matchRange)
    if (scoreRange) {
      matches = matches.filter(
        (match) => match.score >= scoreRange[0] && match.score <= scoreRange[1]
      )
    }

    sortResults(matches, sortKey, sortOrder)
    return matches
  }

  static async getMatchComparison(
    maleId: string,
    femaleId: string
  ): Promise<{ success: boolean; data?: MatchComparisonResult; error?: string }> {
    const { maleApplicant, femaleApplicant, pairTrackings } =
      await MatchingRepository.findComparisonApplicants(maleId, femaleId)

    if (!maleApplicant || !femaleApplicant) {
      return { success: false, error: "Applicant not found" }
    }

    const parsedMale = {
      ...maleApplicant,
      personalDetails: safeParse(maleApplicant.personalDetails),
      career: safeParse(maleApplicant.career),
      appearance: safeParse(maleApplicant.appearance),
      personality: safeParse(maleApplicant.personality),
      lifestyle: safeParse(maleApplicant.lifestyle),
      relationshipGoals: safeParse(maleApplicant.relationshipGoals),
      idealPartner: safeParse(maleApplicant.idealPartner),
      financial: safeParse(maleApplicant.financial),
      photos: safeParse(maleApplicant.photos),
    }

    const parsedFemale = {
      ...femaleApplicant,
      personalDetails: safeParse(femaleApplicant.personalDetails),
      career: safeParse(femaleApplicant.career),
      appearance: safeParse(femaleApplicant.appearance),
      personality: safeParse(femaleApplicant.personality),
      lifestyle: safeParse(femaleApplicant.lifestyle),
      relationshipGoals: safeParse(femaleApplicant.relationshipGoals),
      idealPartner: safeParse(femaleApplicant.idealPartner),
      financial: safeParse(femaleApplicant.financial),
      photos: safeParse(femaleApplicant.photos),
    }

    const hasIntersection = (preferred: unknown, actual: unknown) =>
      toArray(preferred).some((item) =>
        toArray(actual).map(normalize).includes(normalize(item))
      )

    const getMatchPoints = (
      preferred: unknown,
      actual: unknown,
      matched: boolean
    ) => {
      const preferredItems = toArray(preferred)
      const actualItems = new Set(toArray(actual).map(normalize))

      if (preferredItems.length > 0) {
        return {
          points: preferredItems.filter((item) => actualItems.has(normalize(item)))
            .length,
          possiblePoints: preferredItems.length,
        }
      }

      return { points: matched ? 1 : 0, possiblePoints: 1 }
    }

    const cmToFeetAndInches = (cm: number | string | null | undefined): string => {
      const cmValue = Number(cm)
      if (!cmValue || Number.isNaN(cmValue)) {
        return ""
      }
      const totalInches = cmValue / 2.54
      const feet = Math.floor(totalInches / 12)
      const inches = Math.round(totalInches % 12)
      return `(${feet}'${inches}")`
    }

    const createBreakdownItem = ({
      key,
      category,
      label,
      malePreference,
      femaleValue,
      malePrefMatch,
      femalePreference,
      maleValue,
      femalePrefMatch,
      weight: _weight,
      malePoints: malePointsOverride,
      femalePoints: femalePointsOverride,
      possiblePoints: possiblePointsOverride,
    }: {
      key: string
      category: string
      label: string
      malePreference: unknown
      femaleValue: unknown
      malePrefMatch: boolean
      femalePreference: unknown
      maleValue: unknown
      femalePrefMatch: boolean
      weight: number
      malePoints?: number
      femalePoints?: number
      possiblePoints?: number
    }): MatchBreakdownItem => {
      void _weight
      const maleScore = getMatchPoints(malePreference, femaleValue, malePrefMatch)
      const femaleScore = getMatchPoints(
        femalePreference,
        maleValue,
        femalePrefMatch
      )

      return {
        key,
        category,
        label,
        malePreference: displayValue(malePreference),
        femaleValue: displayValue(femaleValue),
        malePrefMatch,
        femalePreference: displayValue(femalePreference),
        maleValue: displayValue(maleValue),
        femalePrefMatch,
        weight: possiblePointsOverride ?? maleScore.possiblePoints,
        malePoints: malePointsOverride ?? maleScore.points,
        femalePoints: femalePointsOverride ?? femaleScore.points,
        malePossiblePoints: possiblePointsOverride ?? maleScore.possiblePoints,
        femalePossiblePoints: possiblePointsOverride ?? maleScore.possiblePoints,
      }
    }

    const maleAge = calculateAge(parsedMale.personalDetails?.dob)
    const femaleAge = calculateAge(parsedFemale.personalDetails?.dob)
    const maleAgeRange = parseAgeRange(parsedMale.idealPartner?.ageRange)
    const femaleAgeRange = parseAgeRange(parsedFemale.idealPartner?.ageRange)

    const maleDealBreakers = toArray(parsedMale.idealPartner?.dealBreakers)
      .map(normalize)
      .join(" ")
    const femaleDealBreakers = toArray(parsedFemale.idealPartner?.dealBreakers)
      .map(normalize)
      .join(" ")

    const maleEnglishFluency = Number(parsedMale.appearance?.englishFluency?.[0] ?? 0)
    const maleThaiFluency = Number(parsedMale.appearance?.thaiFluency?.[0] ?? 0)
    const femaleEnglishFluency = Number(
      parsedFemale.appearance?.englishFluency?.[0] ?? 0
    )
    const femaleThaiFluency = Number(parsedFemale.appearance?.thaiFluency?.[0] ?? 0)
    const englishFluencyPoints = getFluencyPoints(
      maleEnglishFluency,
      femaleEnglishFluency
    )
    const thaiFluencyPoints = getFluencyPoints(maleThaiFluency, femaleThaiFluency)

    const breakdown: MatchBreakdownItem[] = [
      createBreakdownItem({
        key: "ageRange",
        category: "Ideal Partner",
        label: "Age Range",
        malePreference: parsedMale.idealPartner?.ageRange,
        femaleValue: femaleAge ? `${femaleAge} years old` : "Not provided",
        malePrefMatch: Boolean(
          maleAgeRange &&
          femaleAge >= maleAgeRange[0] &&
          femaleAge <= maleAgeRange[1]
        ),
        femalePreference: parsedFemale.idealPartner?.ageRange,
        maleValue: maleAge ? `${maleAge} years old` : "Not provided",
        femalePrefMatch: Boolean(
          femaleAgeRange &&
          maleAge >= femaleAgeRange[0] &&
          maleAge <= femaleAgeRange[1]
        ),
        weight: 16,
      }),
      createBreakdownItem({
        key: "height",
        category: "Ideal Partner",
        label: "Height",
        malePreference: parsedMale.idealPartner?.height,
        femaleValue: parsedFemale.appearance?.height
          ? `${parsedFemale.appearance.height} cm ${cmToFeetAndInches(
              parsedFemale.appearance.height
            )}`
          : "Not provided",
        malePrefMatch: matchesHeightRange(
          parsedMale.idealPartner?.height,
          parsedFemale.appearance?.height
        ),
        femalePreference: parsedFemale.idealPartner?.height,
        maleValue: parsedMale.appearance?.height
          ? `${parsedMale.appearance.height} cm ${cmToFeetAndInches(
              parsedMale.appearance.height
            )}`
          : "Not provided",
        femalePrefMatch: matchesHeightRange(
          parsedFemale.idealPartner?.height,
          parsedMale.appearance?.height
        ),
        weight: 8,
      }),
      createBreakdownItem({
        key: "weight",
        category: "Ideal Partner",
        label: "Weight",
        malePreference: parsedMale.idealPartner?.weight,
        femaleValue: parsedFemale.appearance?.weight
          ? `${parsedFemale.appearance.weight} kg`
          : "Not provided",
        malePrefMatch: matchesWeightRange(
          parsedMale.idealPartner?.weight,
          parsedFemale.appearance?.weight
        ),
        femalePreference: parsedFemale.idealPartner?.weight,
        maleValue: parsedMale.appearance?.weight
          ? `${parsedMale.appearance.weight} kg`
          : "Not provided",
        femalePrefMatch: matchesWeightRange(
          parsedFemale.idealPartner?.weight,
          parsedMale.appearance?.weight
        ),
        weight: 6,
      }),
      createBreakdownItem({
        key: "nationality",
        category: "Ideal Partner",
        label: "Nationality",
        malePreference: parsedMale.idealPartner?.nationality,
        femaleValue: parsedFemale.personalDetails?.nationality,
        malePrefMatch: matchRegion(
          parsedMale.idealPartner?.nationality,
          parsedFemale.personalDetails?.nationality,
          parsedFemale.personalDetails?.nationalityRegion
        ),
        femalePreference: parsedFemale.idealPartner?.nationality,
        maleValue: parsedMale.personalDetails?.nationality,
        femalePrefMatch: matchRegion(
          parsedFemale.idealPartner?.nationality,
          parsedMale.personalDetails?.nationality,
          parsedMale.personalDetails?.nationalityRegion
        ),
        weight: 10,
      }),
      createBreakdownItem({
        key: "location",
        category: "Ideal Partner",
        label: "Location",
        malePreference: parsedMale.idealPartner?.location,
        femaleValue: parsedFemale.personalDetails?.currentLocation,
        malePrefMatch: matchRegion(
          parsedMale.idealPartner?.location,
          parsedFemale.personalDetails?.currentLocation,
          parsedFemale.personalDetails?.currentLocationRegion
        ),
        femalePreference: parsedFemale.idealPartner?.location,
        maleValue: parsedMale.personalDetails?.currentLocation,
        femalePrefMatch: matchRegion(
          parsedFemale.idealPartner?.location,
          parsedMale.personalDetails?.currentLocation,
          parsedMale.personalDetails?.currentLocationRegion
        ),
        weight: 8,
      }),
      createBreakdownItem({
        key: "education",
        category: "Ideal Partner",
        label: "Education",
        malePreference: parsedMale.idealPartner?.education,
        femaleValue: parsedFemale.career?.education,
        malePrefMatch: matchExact(
          parsedMale.idealPartner?.education,
          parsedFemale.career?.education
        ),
        femalePreference: parsedFemale.idealPartner?.education,
        maleValue: parsedMale.career?.education,
        femalePrefMatch: matchExact(
          parsedFemale.idealPartner?.education,
          parsedMale.career?.education
        ),
        weight: 8,
      }),
      createBreakdownItem({
        key: "personality",
        category: "Ideal Partner",
        label: "Personality",
        malePreference: parsedMale.idealPartner?.personality,
        femaleValue: parsedFemale.personality?.personality,
        malePrefMatch: hasIntersection(
          parsedMale.idealPartner?.personality,
          parsedFemale.personality?.personality
        ),
        femalePreference: parsedFemale.idealPartner?.personality,
        maleValue: parsedMale.personality?.personality,
        femalePrefMatch: hasIntersection(
          parsedFemale.idealPartner?.personality,
          parsedMale.personality?.personality
        ),
        weight: 10,
      }),
      createBreakdownItem({
        key: "qualities",
        category: "Ideal Partner",
        label: "Qualities",
        malePreference: parsedMale.idealPartner?.qualities,
        femaleValue: parsedFemale.personality?.bestQualities?.length
          ? parsedFemale.personality.bestQualities
          : parsedFemale.lifestyle?.values,
        malePrefMatch: hasIntersection(
          parsedMale.idealPartner?.qualities,
          parsedFemale.personality?.bestQualities?.length
            ? parsedFemale.personality.bestQualities
            : parsedFemale.lifestyle?.values
        ),
        femalePreference: parsedFemale.idealPartner?.qualities,
        maleValue: parsedMale.personality?.bestQualities?.length
          ? parsedMale.personality.bestQualities
          : parsedMale.lifestyle?.values,
        femalePrefMatch: hasIntersection(
          parsedFemale.idealPartner?.qualities,
          parsedMale.personality?.bestQualities?.length
            ? parsedMale.personality.bestQualities
            : parsedMale.lifestyle?.values
        ),
        weight: 10,
      }),
      createBreakdownItem({
        key: "relocation",
        category: "Profile Signals",
        label: "Relocation",
        malePreference: "Yes or Maybe",
        femaleValue: parsedFemale.relationshipGoals?.relocate,
        malePrefMatch:
          ["yes", "maybe"].includes(
            normalize(parsedFemale.relationshipGoals?.relocate)
          ) ||
          normalize(parsedFemale.relationshipGoals?.relocate).includes("yes") ||
          normalize(parsedFemale.relationshipGoals?.relocate).includes("open") ||
          normalize(parsedFemale.relationshipGoals?.relocate).includes("willing"),
        femalePreference: "Yes or Maybe",
        maleValue: parsedMale.relationshipGoals?.relocate,
        femalePrefMatch:
          ["yes", "maybe"].includes(
            normalize(parsedMale.relationshipGoals?.relocate)
          ) ||
          normalize(parsedMale.relationshipGoals?.relocate).includes("yes") ||
          normalize(parsedMale.relationshipGoals?.relocate).includes("open") ||
          normalize(parsedMale.relationshipGoals?.relocate).includes("willing"),
        weight: 6,
      }),
      createBreakdownItem({
        key: "smoking",
        category: "Lifestyle",
        label: "Smoking",
        malePreference: "Never or Occasionally",
        femaleValue: parsedFemale.lifestyle?.smoking,
        malePrefMatch: ["never", "occasionally"].includes(
          normalize(parsedFemale.lifestyle?.smoking)
        ),
        femalePreference: "Never or Occasionally",
        maleValue: parsedMale.lifestyle?.smoking,
        femalePrefMatch: ["never", "occasionally"].includes(
          normalize(parsedMale.lifestyle?.smoking)
        ),
        weight: 5,
      }),
      createBreakdownItem({
        key: "drinking",
        category: "Lifestyle",
        label: "Drinking",
        malePreference: "Not frequently",
        femaleValue: parsedFemale.lifestyle?.drinking,
        malePrefMatch: normalize(parsedFemale.lifestyle?.drinking) !== "frequently",
        femalePreference: "Not frequently",
        maleValue: parsedMale.lifestyle?.drinking,
        femalePrefMatch: normalize(parsedMale.lifestyle?.drinking) !== "frequently",
        weight: 5,
      }),
      createBreakdownItem({
        key: "children",
        category: "Lifestyle",
        label: "Children",
        malePreference: "No children or open to future children",
        femaleValue:
          parsedFemale.personality?.hasChildren === "Yes"
            ? `Has children (${parsedFemale.personality?.childrenCount ?? 0})`
            : parsedFemale.lifestyle?.futureChildren,
        malePrefMatch:
          normalize(parsedFemale.personality?.hasChildren) === "no" ||
          normalize(parsedFemale.lifestyle?.futureChildren) !== "no",
        femalePreference: "No children or open to future children",
        maleValue:
          parsedMale.personality?.hasChildren === "Yes"
            ? `Has children (${parsedMale.personality?.childrenCount ?? 0})`
            : parsedMale.lifestyle?.futureChildren,
        femalePrefMatch:
          normalize(parsedMale.personality?.hasChildren) === "no" ||
          normalize(parsedMale.lifestyle?.futureChildren) !== "no",
        weight: 5,
      }),
      createBreakdownItem({
        key: "hobbies",
        category: "Lifestyle",
        label: "Hobbies",
        malePreference: parsedMale.lifestyle?.interests,
        femaleValue: parsedFemale.lifestyle?.interests,
        malePrefMatch: hasIntersection(
          parsedMale.lifestyle?.interests,
          parsedFemale.lifestyle?.interests
        ),
        femalePreference: parsedFemale.lifestyle?.interests,
        maleValue: parsedMale.lifestyle?.interests,
        femalePrefMatch: hasIntersection(
          parsedFemale.lifestyle?.interests,
          parsedMale.lifestyle?.interests
        ),
        weight: 5,
      }),
      createBreakdownItem({
        key: "languageEnglish",
        category: "Languages",
        label: "English Fluency",
        malePreference: `${maleEnglishFluency}%`,
        femaleValue: `${femaleEnglishFluency}%`,
        malePrefMatch: englishFluencyPoints > 0,
        femalePreference: `${femaleEnglishFluency}%`,
        maleValue: `${maleEnglishFluency}%`,
        femalePrefMatch: englishFluencyPoints > 0,
        weight: 5,
        malePoints: englishFluencyPoints,
        femalePoints: englishFluencyPoints,
        possiblePoints: 5,
      }),
      createBreakdownItem({
        key: "languageThai",
        category: "Languages",
        label: "Thai Fluency",
        malePreference: `${maleThaiFluency}%`,
        femaleValue: `${femaleThaiFluency}%`,
        malePrefMatch: thaiFluencyPoints > 0,
        femalePreference: `${femaleThaiFluency}%`,
        maleValue: `${maleThaiFluency}%`,
        femalePrefMatch: thaiFluencyPoints > 0,
        weight: 5,
        femalePoints: thaiFluencyPoints,
        malePoints: thaiFluencyPoints,
        possiblePoints: 5,
      }),
    ]

    let score = breakdown.reduce((total, item) => total + item.malePoints, 0)

    const totalPossibleScore = breakdown.reduce(
      (total, item) => total + item.malePossiblePoints,
      0
    )

    const malePenalties: DealBreakerPenalty[] = [
      {
        key: "dealBreakerSmoking",
        label: "Male's smoking deal breaker",
        matched:
          maleDealBreakers.includes("smok") &&
          parsedFemale.lifestyle?.smoking !== "Never",
        penalty: 40,
      },
      {
        key: "dealBreakerDrinking",
        label: "Male's drinking deal breaker",
        matched:
          maleDealBreakers.includes("drink") &&
          normalize(parsedFemale.lifestyle?.drinking) === "frequently",
        penalty: 30,
      },
      {
        key: "dealBreakerChildren",
        label: "Male's children deal breaker",
        matched:
          maleDealBreakers.includes("children") &&
          normalize(parsedFemale.personality?.hasChildren) === "yes",
        penalty: 30,
      },
    ].filter((item) => item.matched)

    const femalePenalties: DealBreakerPenalty[] = [
      {
        key: "dealBreakerSmoking",
        label: "Female's smoking deal breaker",
        matched:
          femaleDealBreakers.includes("smok") &&
          parsedMale.lifestyle?.smoking !== "Never",
        penalty: 40,
      },
      {
        key: "dealBreakerDrinking",
        label: "Female's drinking deal breaker",
        matched:
          femaleDealBreakers.includes("drink") &&
          normalize(parsedMale.lifestyle?.drinking) === "frequently",
        penalty: 30,
      },
      {
        key: "dealBreakerChildren",
        label: "Female's children deal breaker",
        matched:
          femaleDealBreakers.includes("children") &&
          normalize(parsedMale.personality?.hasChildren) === "yes",
        penalty: 30,
      },
    ].filter((item) => item.matched)

    score -= malePenalties.reduce((total, item) => total + item.penalty, 0)

    const matchPercentage = Math.max(
      0,
      Math.round((score / totalPossibleScore) * 100)
    )

    return {
      success: true,
      data: {
        male: parsedMale,
        female: parsedFemale,
        pairTrackings,
        matchPercentage,
        matchBreakdown: breakdown,
        dealBreakerPenalties: [...malePenalties, ...femalePenalties],
      },
    }
  }
}
