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

const matchesWeightRange = (preferredRange: unknown, actualWeight: unknown) => {
  const weight = Number.parseFloat(String(actualWeight ?? "").replace(/[^\d.]/g, ""))
  const range = normalize(preferredRange)
  if (!weight || !range) return false

  if (range.includes("under 50")) return weight < 50
  if (range.includes("50-60")) return weight >= 50 && weight <= 60
  if (range.includes("60-70")) return weight >= 60 && weight <= 70
  if (range.includes("over 70")) return weight > 70
  return false
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

type MatchBreakdownItem = {
  key: string
  category: string
  label: string
  malePreference: string
  femaleValue: string
  malePrefMatch: boolean
  femalePreference: string
  maleValue: string
  femalePrefMatch: boolean
  weight: number
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
  weight,
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
}): MatchBreakdownItem => ({
  key,
  category,
  label,
  malePreference: displayValue(malePreference),
  femaleValue: displayValue(femaleValue),
  malePrefMatch,
  femalePreference: displayValue(femalePreference),
  maleValue: displayValue(maleValue),
  femalePrefMatch,
  weight,
})

const calculateMatchDetails = (male: any, female: any) => {
  const maleAge = calculateAge(male.personalDetails?.dob)
  const femaleAge = calculateAge(female.personalDetails?.dob)
  const maleAgeRange = parseAgeRange(male.idealPartner?.ageRange)
  const femaleAgeRange = parseAgeRange(female.idealPartner?.ageRange)

  const maleDealBreakers = toArray(male.idealPartner?.dealBreakers)
    .map(normalize)
    .join(" ")
  const femaleDealBreakers = toArray(female.idealPartner?.dealBreakers)
    .map(normalize)
    .join(" ")

  const breakdown: MatchBreakdownItem[] = [
    createBreakdownItem({
      key: "ageRange",
      category: "Ideal Partner",
      label: "Age Range",
      malePreference: male.idealPartner?.ageRange,
      femaleValue: femaleAge ? `${femaleAge} years old` : "Not provided",
      malePrefMatch: Boolean(
        maleAgeRange && femaleAge >= maleAgeRange[0] && femaleAge <= maleAgeRange[1]
      ),
      femalePreference: female.idealPartner?.ageRange,
      maleValue: maleAge ? `${maleAge} years old` : "Not provided",
      femalePrefMatch: Boolean(
        femaleAgeRange && maleAge >= femaleAgeRange[0] && maleAge <= femaleAgeRange[1]
      ),
      weight: 16,
    }),
    createBreakdownItem({
      key: "height",
      category: "Ideal Partner",
      label: "Height",
      malePreference: male.idealPartner?.height,
      femaleValue: female.appearance?.height
        ? `${female.appearance.height} cm ${cmToFeetAndInches(
            female.appearance.height
          )}`
        : "Not provided",
      malePrefMatch: matchesHeightRange(
        male.idealPartner?.height,
        female.appearance?.height
      ),
      femalePreference: female.idealPartner?.height,
      maleValue: male.appearance?.height
        ? `${male.appearance.height} cm ${cmToFeetAndInches(
            male.appearance.height
          )}`
        : "Not provided",
      femalePrefMatch: matchesHeightRange(
        female.idealPartner?.height,
        male.appearance?.height
      ),
      weight: 8,
    }),
    createBreakdownItem({
      key: "weight",
      category: "Ideal Partner",
      label: "Weight",
      malePreference: male.idealPartner?.weight,
      femaleValue: female.appearance?.weight ? `${female.appearance.weight} kg` : "Not provided",
      malePrefMatch: matchesWeightRange(
        male.idealPartner?.weight,
        female.appearance?.weight
      ),
      femalePreference: female.idealPartner?.weight,
      maleValue: male.appearance?.weight ? `${male.appearance.weight} kg` : "Not provided",
      femalePrefMatch: matchesWeightRange(
        female.idealPartner?.weight,
        male.appearance?.weight
      ),
      weight: 6,
    }),
    createBreakdownItem({
      key: "nationality",
      category: "Ideal Partner",
      label: "Nationality",
      malePreference: male.idealPartner?.nationality,
      femaleValue: female.personalDetails?.nationality,
      malePrefMatch:
        normalize(male.idealPartner?.nationality) === "asian"
          ? hasValue(female.personalDetails?.nationality)
          : matchExact(
              male.idealPartner?.nationality,
              female.personalDetails?.nationality
            ),
      femalePreference: female.idealPartner?.nationality,
      maleValue: male.personalDetails?.nationality,
      femalePrefMatch:
        normalize(female.idealPartner?.nationality) === "asian"
          ? hasValue(male.personalDetails?.nationality)
          : matchExact(
              female.idealPartner?.nationality,
              male.personalDetails?.nationality
            ),
      weight: 10,
    }),
    createBreakdownItem({
      key: "location",
      category: "Ideal Partner",
      label: "Location",
      malePreference: male.idealPartner?.location,
      femaleValue: female.personalDetails?.currentLocation,
      malePrefMatch: matchExact(
        male.idealPartner?.location,
        female.personalDetails?.currentLocation
      ),
      femalePreference: female.idealPartner?.location,
      maleValue: male.personalDetails?.currentLocation,
      femalePrefMatch: matchExact(
        female.idealPartner?.location,
        male.personalDetails?.currentLocation
      ),
      weight: 8,
    }),
    createBreakdownItem({
      key: "education",
      category: "Ideal Partner",
      label: "Education",
      malePreference: male.idealPartner?.education,
      femaleValue: female.career?.education,
      malePrefMatch: matchExact(
        male.idealPartner?.education,
        female.career?.education
      ),
      femalePreference: female.idealPartner?.education,
      maleValue: male.career?.education,
      femalePrefMatch: matchExact(
        female.idealPartner?.education,
        male.career?.education
      ),
      weight: 8,
    }),
    createBreakdownItem({
      key: "personality",
      category: "Ideal Partner",
      label: "Personality",
      malePreference: male.idealPartner?.personality,
      femaleValue: female.personality?.personality,
      malePrefMatch: hasIntersection(
        male.idealPartner?.personality,
        female.personality?.personality
      ),
      femalePreference: female.idealPartner?.personality,
      maleValue: male.personality?.personality,
      femalePrefMatch: hasIntersection(
        female.idealPartner?.personality,
        male.personality?.personality
      ),
      weight: 10,
    }),
    createBreakdownItem({
      key: "qualities",
      category: "Ideal Partner",
      label: "Qualities",
      malePreference: male.idealPartner?.qualities,
      femaleValue: female.personality?.bestQualities,
      malePrefMatch: hasIntersection(
        male.idealPartner?.qualities,
        female.personality?.bestQualities
      ),
      femalePreference: female.idealPartner?.qualities,
      maleValue: male.personality?.bestQualities,
      femalePrefMatch: hasIntersection(
        female.idealPartner?.qualities,
        male.personality?.bestQualities
      ),
      weight: 10,
    }),
    createBreakdownItem({
      key: "relocation",
      category: "Profile Signals",
      label: "Relocation",
      malePreference: "Yes or Maybe",
      femaleValue: female.relationshipGoals?.relocate,
      malePrefMatch: ["yes", "maybe"].includes(
        normalize(female.relationshipGoals?.relocate)
      ),
      femalePreference: "Yes or Maybe",
      maleValue: male.relationshipGoals?.relocate,
      femalePrefMatch: ["yes", "maybe"].includes(
        normalize(male.relationshipGoals?.relocate)
      ),
      weight: 6,
    }),
    createBreakdownItem({
      key: "smoking",
      category: "Lifestyle",
      label: "Smoking",
      malePreference: "Never or Occasionally",
      femaleValue: female.lifestyle?.smoking,
      malePrefMatch: ["never", "occasionally"].includes(
        normalize(female.lifestyle?.smoking)
      ),
      femalePreference: "Never or Occasionally",
      maleValue: male.lifestyle?.smoking,
      femalePrefMatch: ["never", "occasionally"].includes(
        normalize(male.lifestyle?.smoking)
      ),
      weight: 5,
    }),
    createBreakdownItem({
      key: "drinking",
      category: "Lifestyle",
      label: "Drinking",
      malePreference: "Not frequently",
      femaleValue: female.lifestyle?.drinking,
      malePrefMatch: normalize(female.lifestyle?.drinking) !== "frequently",
      femalePreference: "Not frequently",
      maleValue: male.lifestyle?.drinking,
      femalePrefMatch: normalize(male.lifestyle?.drinking) !== "frequently",
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
      malePrefMatch:
        normalize(female.personality?.hasChildren) === "no" ||
        normalize(female.lifestyle?.futureChildren) !== "no",
      femalePreference: "No children or open to future children",
      maleValue:
        male.personality?.hasChildren === "Yes"
          ? `Has children (${male.personality?.childrenCount ?? 0})`
          : male.lifestyle?.futureChildren,
      femalePrefMatch:
        normalize(male.personality?.hasChildren) === "no" ||
        normalize(male.lifestyle?.futureChildren) !== "no",
      weight: 5,
    }),
    createBreakdownItem({
      key: "hobbies",
      category: "Lifestyle",
      label: "Hobbies",
      malePreference: male.lifestyle?.interests,
      femaleValue: female.lifestyle?.interests,
      malePrefMatch: hasIntersection(
        male.lifestyle?.interests,
        female.lifestyle?.interests
      ),
      femalePreference: female.lifestyle?.interests,
      maleValue: male.lifestyle?.interests,
      femalePrefMatch: hasIntersection(
        female.lifestyle?.interests,
        male.lifestyle?.interests
      ),
      weight: 5,
    }),
    createBreakdownItem({
      key: "languages",
      category: "Languages",
      label: "Languages Spoken",
      malePreference: `English ${male.appearance?.englishFluency?.[0] ?? 0}%, Thai ${
        male.appearance?.thaiFluency?.[0] ?? 0
      }%`,
      femaleValue: `English ${
        female.appearance?.englishFluency?.[0] ?? 90
      }%, Thai ${female.appearance?.thaiFluency?.[0] ?? 60}%`,
      malePrefMatch:
        (Number(male.appearance?.englishFluency?.[0] ?? 0) >= 50 &&
          Number(female.appearance?.englishFluency?.[0] ?? 90) >= 50) ||
        (Number(male.appearance?.thaiFluency?.[0] ?? 0) >= 50 &&
          Number(female.appearance?.thaiFluency?.[0] ?? 60) >= 50),
      femalePreference: `English ${
        female.appearance?.englishFluency?.[0] ?? 0
      }%, Thai ${female.appearance?.thaiFluency?.[0] ?? 0}%`,
      maleValue: `English ${male.appearance?.englishFluency?.[0] ?? 90}%, Thai ${
        male.appearance?.thaiFluency?.[0] ?? 60
      }%`,
      femalePrefMatch:
        (Number(female.appearance?.englishFluency?.[0] ?? 0) >= 50 &&
          Number(male.appearance?.englishFluency?.[0] ?? 90) >= 50) ||
        (Number(female.appearance?.thaiFluency?.[0] ?? 0) >= 50 &&
          Number(male.appearance?.thaiFluency?.[0] ?? 60) >= 50),
      weight: 4,
    }),
  ]

  let score = breakdown.reduce((total, item) => {
    let itemScore = 0
    if (item.malePrefMatch) itemScore += item.weight / 2
    if (item.femalePrefMatch) itemScore += item.weight / 2
    return total + itemScore
  }, 0)

  const totalPossibleScore = breakdown.reduce(
    (total, item) => total + item.weight,
    0
  )

  const malePenalties = [
    {
      key: "dealBreakerSmoking",
      label: "Male's smoking deal breaker",
      matched:
        maleDealBreakers.includes("smok") &&
        female.lifestyle?.smoking !== "Never",
      penalty: 40,
    },
    {
      key: "dealBreakerDrinking",
      label: "Male's drinking deal breaker",
      matched:
        maleDealBreakers.includes("drink") &&
        normalize(female.lifestyle?.drinking) === "frequently",
      penalty: 30,
    },
    {
      key: "dealBreakerChildren",
      label: "Male's children deal breaker",
      matched:
        maleDealBreakers.includes("children") &&
        normalize(female.personality?.hasChildren) === "yes",
      penalty: 30,
    },
  ].filter((item) => item.matched)

  const femalePenalties = [
    {
      key: "dealBreakerSmoking",
      label: "Female's smoking deal breaker",
      matched:
        femaleDealBreakers.includes("smok") &&
        male.lifestyle?.smoking !== "Never",
      penalty: 40,
    },
    {
      key: "dealBreakerDrinking",
      label: "Female's drinking deal breaker",
      matched:
        femaleDealBreakers.includes("drink") &&
        normalize(male.lifestyle?.drinking) === "frequently",
      penalty: 30,
    },
    {
      key: "dealBreakerChildren",
      label: "Female's children deal breaker",
      matched:
        femaleDealBreakers.includes("children") &&
        normalize(male.personality?.hasChildren) === "yes",
      penalty: 30,
    },
  ].filter((item) => item.matched)

  const penalties = [...malePenalties, ...femalePenalties]
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
