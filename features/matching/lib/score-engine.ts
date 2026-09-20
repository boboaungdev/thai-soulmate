/**
 * Match Score Engine
 * ------------------
 * Single source of truth for all match compatibility calculations.
 * Pure functions — no DB access, no side effects.
 *
 * Used by:
 *   - MatchingService.calculateMatches  (dashboard list, card badges)
 *   - MatchingService.getMatchComparison (detail view, print page)
 *
 * Scoring model:
 *   - Each criterion has a fixed possible-points weight.
 *   - Score = sum of male→female earned points.
 *   - Deal-breaker penalties are subtracted from raw score before % conversion.
 *   - matchPercentage = max(0, round((rawScore - penalties) / totalPossible × 100))
 */

import type {
  MatchBreakdownItem,
  MatchCriteriaMap,
  DealBreakerPenalty,
} from "../types"

// ─────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────

export type ParsedApplicant = {
  personalDetails: Record<string, any>
  career: Record<string, any>
  appearance: Record<string, any>
  personality: Record<string, any>
  lifestyle: Record<string, any>
  relationshipGoals: Record<string, any>
  idealPartner: Record<string, any>
  financial: Record<string, any>
  photos: Record<string, any>
  [key: string]: any
}

export type ScoreResult = {
  /** 0–100, already clamped */
  matchPercentage: number
  /** Full per-criterion breakdown for both directions */
  breakdown: MatchBreakdownItem[]
  /** Only the triggered deal-breaker penalties for both sides */
  dealBreakerPenalties: DealBreakerPenalty[]
}

// ─────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────

export const DEFAULT_CRITERIA: MatchCriteriaMap = {
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

// ─────────────────────────────────────────────────────────
// Low-level helpers
// ─────────────────────────────────────────────────────────

const normalize = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()

const toArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

const displayValue = (value: unknown): string => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ")
  if (value === undefined || value === null || value === "")
    return "Not provided"
  return String(value)
}

export const calculateAge = (dob: string | Date | null | undefined): number => {
  if (!dob) return 0
  const birthDate = new Date(dob)
  if (Number.isNaN(birthDate.getTime())) return 0
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

const parseAgeRange = (range: unknown): [number, number] | null => {
  const value = String(range ?? "").trim()
  if (!value) return null
  if (value.endsWith("+")) {
    const min = parseInt(value, 10)
    return Number.isFinite(min) ? [min, 120] : null
  }
  const [min, max] = value.split("-").map((p) => parseInt(p, 10))
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null
  return [min, max]
}

const heightToCm = (value: unknown): number => {
  const n = parseFloat(String(value ?? "").replace(/[^\d.]/g, ""))
  return Number.isFinite(n) ? n : 0
}

const matchesHeightRange = (
  preferredRange: unknown,
  actualHeight: unknown
): boolean => {
  const h = heightToCm(actualHeight)
  const range = normalize(preferredRange)
  if (!h || !range) return false
  if (range.includes("under")) return h < 152
  if (range.includes("5.6") || range.includes("5.9"))
    return h >= 168 && h <= 180
  if (range.includes("5") && range.includes("5.5")) return h >= 152 && h <= 167
  if (range.includes("6")) return h >= 183
  return false
}

const matchesWeightRange = (
  preferredRange: unknown,
  actualWeight: unknown
): boolean => {
  const w = parseFloat(String(actualWeight ?? "").replace(/[^\d.]/g, ""))
  const range = normalize(preferredRange)
  if (!w || !range) return false
  if (range.includes("under 50")) return w < 50
  if (range.includes("50-60")) return w >= 50 && w <= 60
  if (range.includes("60-70")) return w >= 60 && w <= 70
  if (range.includes("over 70")) return w > 70
  return false
}

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
): boolean => {
  const n = normalize(preferred)
  if (!n || n === "any" || n === "not important") return true
  const target = REGION_ALIASES[n] ?? n
  if (REGIONS.includes(target)) return normalize(actualRegion) === target
  return normalize(actualCountry) === n
}

const matchExact = (preferred: unknown, actual: unknown): boolean => {
  const n = normalize(preferred)
  if (!n || n === "not important" || n === "any") return true
  return n === normalize(actual)
}

const intersectionCount = (preferred: unknown, actual: unknown): number => {
  const actualSet = new Set(toArray(actual).map(normalize))
  return toArray(preferred).filter((item) => actualSet.has(normalize(item)))
    .length
}

const hasIntersection = (preferred: unknown, actual: unknown): boolean =>
  intersectionCount(preferred, actual) > 0

const getFluencyPoints = (a: number, b: number): number =>
  Math.round(Math.max(0, 1 - Math.abs(a - b) / 100) * 5)

const cmToFeetAndInches = (cm: number | string | null | undefined): string => {
  const v = Number(cm)
  if (!v || Number.isNaN(v)) return ""
  const totalInches = v / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return `(${feet}'${inches}")`
}

// ─────────────────────────────────────────────────────────
// Breakdown item factory
// ─────────────────────────────────────────────────────────

type BreakdownInput = {
  key: string
  category: string
  label: string
  // male → female direction
  malePreference: unknown
  femaleValue: unknown
  malePrefMatch: boolean
  // female → male direction
  femalePreference: unknown
  maleValue: unknown
  femalePrefMatch: boolean
  /** Max possible points for this criterion */
  possiblePoints: number
  /** Override earned points if partial scoring is needed (male direction) */
  maleEarned?: number
  /** Override earned points if partial scoring is needed (female direction) */
  femaleEarned?: number
}

function makeBreakdownItem(input: BreakdownInput): MatchBreakdownItem {
  const maleEarned =
    input.maleEarned ?? (input.malePrefMatch ? input.possiblePoints : 0)
  const femaleEarned =
    input.femaleEarned ?? (input.femalePrefMatch ? input.possiblePoints : 0)

  return {
    key: input.key,
    category: input.category,
    label: input.label,
    malePreference: displayValue(input.malePreference),
    femaleValue: displayValue(input.femaleValue),
    malePrefMatch: input.malePrefMatch,
    femalePreference: displayValue(input.femalePreference),
    maleValue: displayValue(input.maleValue),
    femalePrefMatch: input.femalePrefMatch,
    weight: input.possiblePoints,
    malePoints: maleEarned,
    femalePoints: femaleEarned,
    malePossiblePoints: input.possiblePoints,
    femalePossiblePoints: input.possiblePoints,
  }
}

// ─────────────────────────────────────────────────────────
// Core engine
// ─────────────────────────────────────────────────────────

/**
 * Compute a compatibility score between a male and female applicant.
 *
 * @param male    - Pre-parsed male applicant (all JSON fields already parsed to objects)
 * @param female  - Pre-parsed female applicant
 * @param enabled - Optional criteria toggle map (defaults to all enabled)
 */
export function computeMatchScore(
  male: ParsedApplicant,
  female: ParsedApplicant,
  enabled: MatchCriteriaMap = DEFAULT_CRITERIA
): ScoreResult {
  const maleIdeal = male.idealPartner ?? {}
  const femaleIdeal = female.idealPartner ?? {}

  const maleAge = calculateAge(male.personalDetails?.dob)
  const femaleAge = calculateAge(female.personalDetails?.dob)

  const maleAgeRange = parseAgeRange(maleIdeal.ageRange)
  const femaleAgeRange = parseAgeRange(femaleIdeal.ageRange)

  // Fluency
  const maleEnglish = Number(male.appearance?.englishFluency?.[0] ?? 0)
  const maleThai = Number(male.appearance?.thaiFluency?.[0] ?? 0)
  const femaleEnglish = Number(female.appearance?.englishFluency?.[0] ?? 0)
  const femaleThai = Number(female.appearance?.thaiFluency?.[0] ?? 0)
  const englishPts = getFluencyPoints(maleEnglish, femaleEnglish)
  const thaiPts = getFluencyPoints(maleThai, femaleThai)

  // Qualities: use bestQualities, fall back to lifestyle.values
  const femaleQualities = female.personality?.bestQualities?.length
    ? female.personality.bestQualities
    : (female.lifestyle?.values ?? [])
  const maleQualities = male.personality?.bestQualities?.length
    ? male.personality.bestQualities
    : (male.lifestyle?.values ?? [])

  // Hobbies: shared interests between male and female
  const maleInterests = male.lifestyle?.interests ?? []
  const femaleInterests = female.lifestyle?.interests ?? []
  const hobbiesIntersect = intersectionCount(maleInterests, femaleInterests)
  const hobbiesPossible = Math.max(toArray(maleInterests).length, 1)
  const hobbiesFemaleIntersect = intersectionCount(
    femaleInterests,
    maleInterests
  )
  const hobbiesFemalePossible = Math.max(toArray(femaleInterests).length, 1)

  // Qualities intersection
  const qualitiesIntersect = intersectionCount(
    maleIdeal.qualities,
    femaleQualities
  )
  const qualitiesPossible = Math.max(toArray(maleIdeal.qualities).length, 1)
  const qualitiesFemaleIntersect = intersectionCount(
    femaleIdeal.qualities,
    maleQualities
  )
  const qualitiesFemalePossible = Math.max(
    toArray(femaleIdeal.qualities).length,
    1
  )

  // Personality intersection
  const personalityIntersect = intersectionCount(
    maleIdeal.personality,
    female.personality?.personality
  )
  const personalityPossible = Math.max(toArray(maleIdeal.personality).length, 1)
  const personalityFemaleIntersect = intersectionCount(
    femaleIdeal.personality,
    male.personality?.personality
  )
  const personalityFemalePossible = Math.max(
    toArray(femaleIdeal.personality).length,
    1
  )

  // ─────────────────────────────────────────
  // Relocation signal: does the person signal openness to relocate?
  // We check relationshipGoals.relocate for "yes / maybe / open / willing"
  // ─────────────────────────────────────────
  const isOpenToRelocate = (val: unknown): boolean => {
    const n = normalize(val)
    return (
      n.includes("yes") ||
      n.includes("maybe") ||
      n.includes("open") ||
      n.includes("willing")
    )
  }

  const breakdown: MatchBreakdownItem[] = []

  // ── Age Range ────────────────────────────
  if (enabled["Ideal Partner Age Range"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "ageRange",
        category: "Ideal Partner",
        label: "Age Range",
        malePreference: maleIdeal.ageRange,
        femaleValue: femaleAge ? `${femaleAge} years old` : "Not provided",
        malePrefMatch: Boolean(
          maleAgeRange &&
          femaleAge >= maleAgeRange[0] &&
          femaleAge <= maleAgeRange[1]
        ),
        femalePreference: femaleIdeal.ageRange,
        maleValue: maleAge ? `${maleAge} years old` : "Not provided",
        femalePrefMatch: Boolean(
          femaleAgeRange &&
          maleAge >= femaleAgeRange[0] &&
          maleAge <= femaleAgeRange[1]
        ),
        possiblePoints: 16,
      })
    )
  }

  // ── Height ───────────────────────────────
  if (enabled["Ideal Partner Height"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "height",
        category: "Ideal Partner",
        label: "Height",
        malePreference: maleIdeal.height,
        femaleValue: female.appearance?.height
          ? `${female.appearance.height} cm ${cmToFeetAndInches(female.appearance.height)}`
          : "Not provided",
        malePrefMatch: matchesHeightRange(
          maleIdeal.height,
          female.appearance?.height
        ),
        femalePreference: femaleIdeal.height,
        maleValue: male.appearance?.height
          ? `${male.appearance.height} cm ${cmToFeetAndInches(male.appearance.height)}`
          : "Not provided",
        femalePrefMatch: matchesHeightRange(
          femaleIdeal.height,
          male.appearance?.height
        ),
        possiblePoints: 8,
      })
    )
  }

  // ── Weight ───────────────────────────────
  if (enabled["Ideal Partner Weight"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "weight",
        category: "Ideal Partner",
        label: "Weight",
        malePreference: maleIdeal.weight,
        femaleValue: female.appearance?.weight
          ? `${female.appearance.weight} kg`
          : "Not provided",
        malePrefMatch: matchesWeightRange(
          maleIdeal.weight,
          female.appearance?.weight
        ),
        femalePreference: femaleIdeal.weight,
        maleValue: male.appearance?.weight
          ? `${male.appearance.weight} kg`
          : "Not provided",
        femalePrefMatch: matchesWeightRange(
          femaleIdeal.weight,
          male.appearance?.weight
        ),
        possiblePoints: 6,
      })
    )
  }

  // ── Nationality ──────────────────────────
  if (enabled["Ideal Partner Nationality"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "nationality",
        category: "Ideal Partner",
        label: "Nationality",
        malePreference: maleIdeal.nationality,
        femaleValue: female.personalDetails?.nationality,
        malePrefMatch: matchRegion(
          maleIdeal.nationality,
          female.personalDetails?.nationality,
          female.personalDetails?.nationalityRegion
        ),
        femalePreference: femaleIdeal.nationality,
        maleValue: male.personalDetails?.nationality,
        femalePrefMatch: matchRegion(
          femaleIdeal.nationality,
          male.personalDetails?.nationality,
          male.personalDetails?.nationalityRegion
        ),
        possiblePoints: 10,
      })
    )
  }

  // ── Location ─────────────────────────────
  if (enabled["Ideal Partner Location"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "location",
        category: "Ideal Partner",
        label: "Location",
        malePreference: maleIdeal.location,
        femaleValue: female.personalDetails?.currentLocation,
        malePrefMatch: matchRegion(
          maleIdeal.location,
          female.personalDetails?.currentLocation,
          female.personalDetails?.currentLocationRegion
        ),
        femalePreference: femaleIdeal.location,
        maleValue: male.personalDetails?.currentLocation,
        femalePrefMatch: matchRegion(
          femaleIdeal.location,
          male.personalDetails?.currentLocation,
          male.personalDetails?.currentLocationRegion
        ),
        possiblePoints: 8,
      })
    )
  }

  // ── Education ────────────────────────────
  if (enabled["Ideal Partner Education"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "education",
        category: "Ideal Partner",
        label: "Education",
        malePreference: maleIdeal.education,
        femaleValue: female.career?.education,
        malePrefMatch: matchExact(
          maleIdeal.education,
          female.career?.education
        ),
        femalePreference: femaleIdeal.education,
        maleValue: male.career?.education,
        femalePrefMatch: matchExact(
          femaleIdeal.education,
          male.career?.education
        ),
        possiblePoints: 8,
      })
    )
  }

  // ── Personality ──────────────────────────
  if (enabled["Ideal Partner Personality"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "personality",
        category: "Ideal Partner",
        label: "Personality",
        malePreference: maleIdeal.personality,
        femaleValue: female.personality?.personality,
        malePrefMatch: hasIntersection(
          maleIdeal.personality,
          female.personality?.personality
        ),
        femalePreference: femaleIdeal.personality,
        maleValue: male.personality?.personality,
        femalePrefMatch: hasIntersection(
          femaleIdeal.personality,
          male.personality?.personality
        ),
        possiblePoints: personalityPossible,
        maleEarned: personalityIntersect,
        femaleEarned: personalityFemaleIntersect,
      })
    )
  }

  // ── Qualities ────────────────────────────
  if (enabled["Ideal Partner Qualities"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "qualities",
        category: "Ideal Partner",
        label: "Qualities",
        malePreference: maleIdeal.qualities,
        femaleValue: femaleQualities,
        malePrefMatch: hasIntersection(maleIdeal.qualities, femaleQualities),
        femalePreference: femaleIdeal.qualities,
        maleValue: maleQualities,
        femalePrefMatch: hasIntersection(femaleIdeal.qualities, maleQualities),
        possiblePoints: qualitiesPossible,
        maleEarned: qualitiesIntersect,
        femaleEarned: qualitiesFemaleIntersect,
      })
    )
  }

  // ── Relocation ───────────────────────────
  // We signal whether each person is open to relocating, rather than matching a preference field.
  if (enabled["Relocation Preference"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "relocation",
        category: "Profile Signals",
        label: "Relocation",
        malePreference: "Open to relocating",
        femaleValue: female.relationshipGoals?.relocate ?? "Not provided",
        malePrefMatch: isOpenToRelocate(female.relationshipGoals?.relocate),
        femalePreference: "Open to relocating",
        maleValue: male.relationshipGoals?.relocate ?? "Not provided",
        femalePrefMatch: isOpenToRelocate(male.relationshipGoals?.relocate),
        possiblePoints: 6,
      })
    )
  }

  // ── Smoking ──────────────────────────────
  // Behavioural signal: "Never" or "Occasionally" is a clean match.
  if (enabled["Smoking Preference"]) {
    const femaleSmokes = ["never", "occasionally"].includes(
      normalize(female.lifestyle?.smoking)
    )
    const maleSmokes = ["never", "occasionally"].includes(
      normalize(male.lifestyle?.smoking)
    )
    breakdown.push(
      makeBreakdownItem({
        key: "smoking",
        category: "Lifestyle",
        label: "Smoking",
        malePreference: "Never or Occasionally",
        femaleValue: female.lifestyle?.smoking ?? "Not provided",
        malePrefMatch: femaleSmokes,
        femalePreference: "Never or Occasionally",
        maleValue: male.lifestyle?.smoking ?? "Not provided",
        femalePrefMatch: maleSmokes,
        possiblePoints: 5,
      })
    )
  }

  // ── Drinking ─────────────────────────────
  // Behavioural signal: anything except "Frequently" is fine.
  if (enabled["Drinking Preference"]) {
    const femaleDrinksOk =
      normalize(female.lifestyle?.drinking) !== "frequently"
    const maleDrinksOk = normalize(male.lifestyle?.drinking) !== "frequently"
    breakdown.push(
      makeBreakdownItem({
        key: "drinking",
        category: "Lifestyle",
        label: "Drinking",
        malePreference: "Not frequently",
        femaleValue: female.lifestyle?.drinking ?? "Not provided",
        malePrefMatch: femaleDrinksOk,
        femalePreference: "Not frequently",
        maleValue: male.lifestyle?.drinking ?? "Not provided",
        femalePrefMatch: maleDrinksOk,
        possiblePoints: 5,
      })
    )
  }

  // ── Children ─────────────────────────────
  // Match if female has no children OR is open to future children.
  if (enabled["Children Preference"]) {
    const femaleChildrenOk =
      normalize(female.personality?.hasChildren) === "no" ||
      normalize(female.lifestyle?.futureChildren) !== "no"
    const maleChildrenOk =
      normalize(male.personality?.hasChildren) === "no" ||
      normalize(male.lifestyle?.futureChildren) !== "no"

    const femaleChildrenDisplay =
      female.personality?.hasChildren === "Yes"
        ? `Has children (${female.personality?.childrenCount ?? 0})`
        : (female.lifestyle?.futureChildren ?? "Not provided")
    const maleChildrenDisplay =
      male.personality?.hasChildren === "Yes"
        ? `Has children (${male.personality?.childrenCount ?? 0})`
        : (male.lifestyle?.futureChildren ?? "Not provided")

    breakdown.push(
      makeBreakdownItem({
        key: "children",
        category: "Lifestyle",
        label: "Children",
        malePreference: "No children or open to future children",
        femaleValue: femaleChildrenDisplay,
        malePrefMatch: femaleChildrenOk,
        femalePreference: "No children or open to future children",
        maleValue: maleChildrenDisplay,
        femalePrefMatch: maleChildrenOk,
        possiblePoints: 5,
      })
    )
  }

  // ── Hobbies ──────────────────────────────
  if (enabled["Hobbies"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "hobbies",
        category: "Lifestyle",
        label: "Hobbies",
        malePreference: maleInterests,
        femaleValue: femaleInterests,
        malePrefMatch: hobbiesIntersect > 0,
        femalePreference: femaleInterests,
        maleValue: maleInterests,
        femalePrefMatch: hobbiesFemaleIntersect > 0,
        possiblePoints: hobbiesPossible,
        maleEarned: hobbiesIntersect,
        femaleEarned: hobbiesFemaleIntersect,
      })
    )
  }

  // ── English Fluency ──────────────────────
  if (enabled["Languages Spoken %"]) {
    breakdown.push(
      makeBreakdownItem({
        key: "languageEnglish",
        category: "Languages",
        label: "English Fluency",
        malePreference: `${maleEnglish}%`,
        femaleValue: `${femaleEnglish}%`,
        malePrefMatch: englishPts > 0,
        femalePreference: `${femaleEnglish}%`,
        maleValue: `${maleEnglish}%`,
        femalePrefMatch: englishPts > 0,
        possiblePoints: 5,
        maleEarned: englishPts,
        femaleEarned: englishPts,
      })
    )

    // ── Thai Fluency ─────────────────────────
    breakdown.push(
      makeBreakdownItem({
        key: "languageThai",
        category: "Languages",
        label: "Thai Fluency",
        malePreference: `${maleThai}%`,
        femaleValue: `${femaleThai}%`,
        malePrefMatch: thaiPts > 0,
        femalePreference: `${femaleThai}%`,
        maleValue: `${maleThai}%`,
        femalePrefMatch: thaiPts > 0,
        possiblePoints: 5,
        maleEarned: thaiPts,
        femaleEarned: thaiPts,
      })
    )
  }

  // ─────────────────────────────────────────
  // Deal-breaker penalties
  // Applied to the raw score BEFORE converting to %.
  // Penalty values are in "points" matching the same scale as criterion weights.
  // ─────────────────────────────────────────
  const maleDealBreakers = toArray(male.idealPartner?.dealBreakers)
    .map(normalize)
    .join(" ")
  const femaleDealBreakers = toArray(female.idealPartner?.dealBreakers)
    .map(normalize)
    .join(" ")

  const allPenalties: DealBreakerPenalty[] = [
    // Male's deal breakers checked against the female
    {
      key: "male-dealBreaker-smoking",
      label: "Male's smoking deal breaker",
      matched:
        maleDealBreakers.includes("smok") &&
        normalize(female.lifestyle?.smoking) !== "never",
      penalty: 40,
    },
    {
      key: "male-dealBreaker-drinking",
      label: "Male's drinking deal breaker",
      matched:
        maleDealBreakers.includes("drink") &&
        normalize(female.lifestyle?.drinking) === "frequently",
      penalty: 30,
    },
    {
      key: "male-dealBreaker-children",
      label: "Male's children deal breaker",
      matched:
        maleDealBreakers.includes("children") &&
        normalize(female.personality?.hasChildren) === "yes",
      penalty: 30,
    },
    // Female's deal breakers checked against the male (informational — not used in score)
    {
      key: "female-dealBreaker-smoking",
      label: "Female's smoking deal breaker",
      matched:
        femaleDealBreakers.includes("smok") &&
        normalize(male.lifestyle?.smoking) !== "never",
      penalty: 40,
    },
    {
      key: "female-dealBreaker-drinking",
      label: "Female's drinking deal breaker",
      matched:
        femaleDealBreakers.includes("drink") &&
        normalize(male.lifestyle?.drinking) === "frequently",
      penalty: 30,
    },
    {
      key: "female-dealBreaker-children",
      label: "Female's children deal breaker",
      matched:
        femaleDealBreakers.includes("children") &&
        normalize(male.personality?.hasChildren) === "yes",
      penalty: 30,
    },
  ]

  const triggeredPenalties = enabled["Deal Breakers"]
    ? allPenalties.filter((p) => p.matched)
    : []

  // ─────────────────────────────────────────
  // Final score (male→female direction only)
  // ─────────────────────────────────────────
  const rawScore = breakdown.reduce((sum, item) => sum + item.malePoints, 0)
  const totalPossible = breakdown.reduce(
    (sum, item) => sum + item.malePossiblePoints,
    0
  )

  // Only male's deal-breaker penalties affect the score
  const malePenaltyTotal = triggeredPenalties
    .filter((p) => p.key.startsWith("male-"))
    .reduce((sum, p) => sum + p.penalty, 0)

  const matchPercentage =
    totalPossible > 0
      ? Math.max(
          0,
          Math.round(((rawScore - malePenaltyTotal) / totalPossible) * 100)
        )
      : 0

  return {
    matchPercentage,
    breakdown,
    dealBreakerPenalties: triggeredPenalties,
  }
}
