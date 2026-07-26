import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

const calculateAge = (dob: string | Date | null | undefined) => {
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

const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()

const toArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

const hasValue = (value: unknown) => normalize(value).length > 0

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

const hasIntersection = (preferred: unknown, actual: unknown) =>
  toArray(preferred).some((item) =>
    toArray(actual).map(normalize).includes(normalize(item))
  )

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

type MatchBreakdownItem = {
  key: string
  category: string
  label: string
  malePreference: string
  femaleValue: string
  matched: boolean
  weight: number
}

const createBreakdownItem = ({
  key,
  category,
  label,
  malePreference,
  femaleValue,
  matched,
  weight,
}: {
  key: string
  category: string
  label: string
  malePreference: unknown
  femaleValue: unknown
  matched: boolean
  weight: number
}): MatchBreakdownItem => ({
  key,
  category,
  label,
  malePreference: displayValue(malePreference),
  femaleValue: displayValue(femaleValue),
  matched,
  weight,
})

const calculateMatchDetails = (male: any, female: any) => {
  const femaleAge = calculateAge(female.personalDetails?.dob)
  const ageRange = parseAgeRange(male.idealPartner?.ageRange)
  const dealBreakers = toArray(male.idealPartner?.dealBreakers)
    .map(normalize)
    .join(" ")

  const breakdown: MatchBreakdownItem[] = [
    createBreakdownItem({
      key: "ageRange",
      category: "Ideal Partner",
      label: "Age Range",
      malePreference: male.idealPartner?.ageRange,
      femaleValue: femaleAge ? `${femaleAge} years old` : undefined,
      matched: Boolean(
        ageRange && femaleAge >= ageRange[0] && femaleAge <= ageRange[1]
      ),
      weight: 16,
    }),
    createBreakdownItem({
      key: "height",
      category: "Ideal Partner",
      label: "Height",
      malePreference: male.idealPartner?.height,
      femaleValue: female.appearance?.height
        ? `${female.appearance.height} cm`
        : undefined,
      matched: matchesHeightRange(
        male.idealPartner?.height,
        female.appearance?.height
      ),
      weight: 8,
    }),
    createBreakdownItem({
      key: "nationality",
      category: "Ideal Partner",
      label: "Nationality",
      malePreference: male.idealPartner?.nationality,
      femaleValue: female.personalDetails?.nationality,
      matched:
        normalize(male.idealPartner?.nationality) === "asian"
          ? hasValue(female.personalDetails?.nationality)
          : matchExact(
              male.idealPartner?.nationality,
              female.personalDetails?.nationality
            ),
      weight: 10,
    }),
    createBreakdownItem({
      key: "location",
      category: "Ideal Partner",
      label: "Location",
      malePreference: male.idealPartner?.location,
      femaleValue: female.personalDetails?.currentLocation,
      matched: matchExact(
        male.idealPartner?.location,
        female.personalDetails?.currentLocation
      ),
      weight: 8,
    }),
    createBreakdownItem({
      key: "education",
      category: "Ideal Partner",
      label: "Education",
      malePreference: male.idealPartner?.education,
      femaleValue: female.career?.education,
      matched: matchExact(
        male.idealPartner?.education,
        female.career?.education
      ),
      weight: 8,
    }),
    createBreakdownItem({
      key: "personality",
      category: "Ideal Partner",
      label: "Personality",
      malePreference: male.idealPartner?.personality,
      femaleValue: female.personality?.personality,
      matched: hasIntersection(
        male.idealPartner?.personality,
        female.personality?.personality
      ),
      weight: 10,
    }),
    createBreakdownItem({
      key: "qualities",
      category: "Ideal Partner",
      label: "Qualities",
      malePreference: male.idealPartner?.qualities,
      femaleValue: female.personality?.bestQualities,
      matched: hasIntersection(
        male.idealPartner?.qualities,
        female.personality?.bestQualities
      ),
      weight: 10,
    }),
    createBreakdownItem({
      key: "income",
      category: "Profile Signals",
      label: "Income",
      malePreference: "Income provided",
      femaleValue: female.financial?.income,
      matched: hasValue(female.financial?.income),
      weight: 6,
    }),
    createBreakdownItem({
      key: "relocation",
      category: "Profile Signals",
      label: "Relocation",
      malePreference: "Yes or Maybe",
      femaleValue: female.relationshipGoals?.relocate,
      matched: ["yes", "maybe"].includes(
        normalize(female.relationshipGoals?.relocate)
      ),
      weight: 6,
    }),
    createBreakdownItem({
      key: "smoking",
      category: "Lifestyle",
      label: "Smoking",
      malePreference: "Never or Occasionally",
      femaleValue: female.lifestyle?.smoking,
      matched: ["never", "occasionally"].includes(
        normalize(female.lifestyle?.smoking)
      ),
      weight: 5,
    }),
    createBreakdownItem({
      key: "drinking",
      category: "Lifestyle",
      label: "Drinking",
      malePreference: "Not frequently",
      femaleValue: female.lifestyle?.drinking,
      matched: normalize(female.lifestyle?.drinking) !== "frequently",
      weight: 5,
    }),
    createBreakdownItem({
      key: "children",
      category: "Lifestyle",
      label: "Children",
      malePreference: "No children or open to future children",
      femaleValue:
        female.personality?.hasChildren === "Yes"
          ? `Has children (${female.personality?.childrenCount ?? 0})`
          : female.lifestyle?.futureChildren,
      matched:
        normalize(female.personality?.hasChildren) === "no" ||
        normalize(female.lifestyle?.futureChildren) !== "no",
      weight: 5,
    }),
    createBreakdownItem({
      key: "hobbies",
      category: "Lifestyle",
      label: "Hobbies",
      malePreference: "Interests provided",
      femaleValue: female.lifestyle?.interests,
      matched: toArray(female.lifestyle?.interests).length > 0,
      weight: 5,
    }),
    createBreakdownItem({
      key: "languages",
      category: "Languages",
      label: "Languages Spoken",
      malePreference: "English or Thai fluency 50%+",
      femaleValue: `English ${female.appearance?.englishFluency?.[0] ?? 0}%, Thai ${
        female.appearance?.thaiFluency?.[0] ?? 0
      }%`,
      matched:
        Number(female.appearance?.englishFluency?.[0] ?? 0) >= 50 ||
        Number(female.appearance?.thaiFluency?.[0] ?? 0) >= 50,
      weight: 4,
    }),
  ]

  let score = breakdown.reduce(
    (total, item) => total + (item.matched ? item.weight : 0),
    0
  )
  const totalPossibleScore = breakdown.reduce(
    (total, item) => total + item.weight,
    0
  )

  const penalties = [
    {
      key: "dealBreakerSmoking",
      label: "Smoking deal breaker",
      matched:
        dealBreakers.includes("smok") && female.lifestyle?.smoking !== "Never",
      penalty: 40,
    },
    {
      key: "dealBreakerDrinking",
      label: "Drinking deal breaker",
      matched:
        dealBreakers.includes("drink") &&
        normalize(female.lifestyle?.drinking) === "frequently",
      penalty: 30,
    },
    {
      key: "dealBreakerChildren",
      label: "Children deal breaker",
      matched:
        dealBreakers.includes("children") &&
        normalize(female.personality?.hasChildren) === "yes",
      penalty: 30,
    },
  ].filter((item) => item.matched)

  score -= penalties.reduce((total, item) => total + item.penalty, 0)

  return {
    matchPercentage: Math.max(
      0,
      Math.round((score / totalPossibleScore) * 100)
    ),
    matchBreakdown: breakdown,
    dealBreakerPenalties: penalties,
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ maleId: string; femaleId: string }> }
) {
  const { maleId, femaleId } = await params

  if (!maleId || !femaleId) {
    return NextResponse.json(
      { error: "Missing maleId or femaleId" },
      { status: 400 }
    )
  }

  try {
    const maleApplicant = await prisma.applicationForm.findUnique({
      where: { id: maleId },
    })

    const femaleApplicant = await prisma.applicationForm.findUnique({
      where: { id: femaleId },
    })

    if (!maleApplicant || !femaleApplicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 }
      )
    }

    // Parse all JSON fields for both applicants
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

    const matchDetails = calculateMatchDetails(parsedMale, parsedFemale)

    return NextResponse.json({
      male: parsedMale,
      female: parsedFemale,
      ...matchDetails,
    })
  } catch (error) {
    console.error("Comparison API Error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
