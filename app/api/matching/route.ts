import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"

type MatchResult = {
  score: number
  applicant: any
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

// Helper to safely parse JSON properties which might be strings or objects
const safeParse = (json: unknown): any => {
  if (!json) return {}
  if (typeof json === "object") return json // It's already an object
  try {
    return JSON.parse(String(json))
  } catch {
    return {}
  }
}

const defaultCriteria: Record<string, boolean> = {
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

const hasValue = (value: unknown) => normalize(value).length > 0

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

const intersects = (preferred: unknown, actual: unknown) =>
  toArray(preferred).some((item) =>
    toArray(actual).map(normalize).includes(normalize(item))
  )

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

  if (REGIONS.includes(normalizedPreferred)) {
    return normalize(actualRegion) === normalizedPreferred
  }

  return normalize(actualCountry) === normalizedPreferred
}

const addCriterionScore = ({
  enabled,
  weight,
  matched,
  score,
  possibleScore,
}: {
  enabled: boolean
  weight: number
  matched: boolean
  score: number
  possibleScore: number
}) => ({
  score: score + (enabled && matched ? weight : 0),
  possibleScore: possibleScore + (enabled ? weight : 0),
})

const parseCriteria = (criteriaParam: string | null) => {
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

const parseApplicant = (applicant: any) => ({
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
})

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
  // The ranges are like "90-100", so we need to find min and max of the two.
  return [Math.min(min, max), Math.max(min, max)]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const activeCriteria = parseCriteria(searchParams.get("criteria"))
  const filter = searchParams.get("filter") ?? "all"
  const matchRange = searchParams.get("matchRange") ?? "all"
  const sortKey = searchParams.get("sortKey") ?? "score"
  const sortOrder = searchParams.get("sortOrder") ?? "desc"

  try {
    const femaleWhere = buildFemaleWhere(filter)

    if (!userId) {
      // Initial state: no male selected, so show every female application.
      const femaleApplicants = await prisma.applicationForm.findMany({
        where: femaleWhere,
        include: { membership: true },
      })

      let matches = femaleApplicants.map((applicant) => ({
        score: 0,
        applicant: parseApplicant(applicant),
      }))

      const scoreRange = parseMatchRangeParam(matchRange)
      if (scoreRange) {
        matches = matches.filter(
          (match) =>
            match.score >= scoreRange[0] && match.score <= scoreRange[1]
        )
      }

      sortResults(matches, sortKey, sortOrder)

      return NextResponse.json(matches) // No matches if range doesn't include 0
    }

    // If a userId is provided, perform matching logic
    const maleApplicant = await prisma.applicationForm.findUnique({
      where: { id: userId },
      include: { membership: true },
    })

    if (!maleApplicant) {
      return NextResponse.json(
        { error: "Male applicant not found" },
        { status: 404 }
      )
    }

    const parsedMale = parseApplicant(maleApplicant)
    const malePersonalDetails = parsedMale.personalDetails
    if (malePersonalDetails?.gender !== "Male") {
      return NextResponse.json(
        { error: "Selected user is not male" },
        { status: 400 }
      )
    }

    const femaleApplicants = await prisma.applicationForm.findMany({
      where: {
        ...femaleWhere,
        NOT: {
          id: userId,
        },
      },
      include: { membership: true },
    })

    const maleIdealPartner = parsedMale.idealPartner

    if (!Object.keys(maleIdealPartner).length) {
      return NextResponse.json(
        { error: "Ideal partner details not found for male applicant" },
        { status: 400 }
      )
    }

    let matches: MatchResult[] = femaleApplicants.map((femaleApplicant) => {
      let score = 0
      let totalPossibleScore = 0

      const parsedFemale = parseApplicant(femaleApplicant)
      const femalePersonalDetails = parsedFemale.personalDetails
      const femaleAppearance = parsedFemale.appearance
      const femaleCareer = parsedFemale.career
      const femalePersonality = parsedFemale.personality
      const femaleLifestyle = parsedFemale.lifestyle
      // const femaleFinancial = parsedFemale.financial
      const femaleRelationshipGoals = parsedFemale.relationshipGoals

      // Age range match
      const ageRange = parseAgeRange(maleIdealPartner.ageRange)
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Age Range"],
        weight: 16,
        matched: Boolean(
          ageRange &&
          calculateAge(femalePersonalDetails.dob) >= ageRange[0] &&
          calculateAge(femalePersonalDetails.dob) <= ageRange[1]
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Height"],
        weight: 8,
        matched: matchesHeightRange(
          maleIdealPartner.height,
          femaleAppearance.height
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Ideal Partner Weight match
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Weight"],
        weight: 6, // Assigning a weight, consistent with the other route.
        matched: matchesWeightRange(
          maleIdealPartner.weight,
          femaleAppearance.weight
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Nationality"],
        weight: 10,
        matched: matchRegion(
          maleIdealPartner.nationality,
          femalePersonalDetails.nationality,
          femalePersonalDetails.nationalityRegion
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Location"],
        weight: 8,
        matched: matchRegion(
          maleIdealPartner.location,
          femalePersonalDetails.currentLocation,
          femalePersonalDetails.currentLocationRegion
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Education match
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Education"],
        weight: 8,
        matched: matchExact(maleIdealPartner.education, femaleCareer.education),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Personality match
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Personality"],
        weight: 10,
        matched: intersects(
          maleIdealPartner.personality,
          femalePersonality.personality
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      // Qualities match
      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Ideal Partner Qualities"],
        weight: 10,
        matched: intersects(
          maleIdealPartner.qualities,
          femalePersonality.bestQualities
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Relocation Preference"],
        weight: 6,
        matched: ["yes", "maybe"].includes(
          normalize(femaleRelationshipGoals.relocate)
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Smoking Preference"],
        weight: 5,
        matched: ["never", "occasionally"].includes(
          normalize(femaleLifestyle.smoking)
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Drinking Preference"],
        weight: 5,
        matched: normalize(femaleLifestyle.drinking) !== "frequently",
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Children Preference"],
        weight: 5,
        matched:
          normalize(femalePersonality.hasChildren) === "no" ||
          normalize(femaleLifestyle.futureChildren) !== "no",
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria.Hobbies,
        weight: 5,
        matched: intersects(
          parsedMale.lifestyle.interests,
          femaleLifestyle.interests
        ),
        score,
        possibleScore: totalPossibleScore,
      }))

      ;({ score, possibleScore: totalPossibleScore } = addCriterionScore({
        enabled: activeCriteria["Languages Spoken %"],
        weight: 4,
        matched:
          (Number(parsedMale.appearance?.englishFluency?.[0] ?? 0) >= 50 &&
            Number(femaleAppearance.englishFluency?.[0] ?? 90) >= 50) ||
          (Number(parsedMale.appearance?.thaiFluency?.[0] ?? 0) >= 50 &&
            Number(femaleAppearance.thaiFluency?.[0] ?? 60) >= 50),
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
        applicant: parsedFemale,
      }
    })

    const scoreRange = parseMatchRangeParam(matchRange)
    if (scoreRange) {
      matches = matches.filter(
        (match) => match.score >= scoreRange[0] && match.score <= scoreRange[1]
      )
    }

    sortResults(matches, sortKey, sortOrder)

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Matching API Error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
