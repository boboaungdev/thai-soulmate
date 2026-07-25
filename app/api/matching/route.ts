import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApplicationForm } from "@/lib/generated/prisma/client"

type MatchResult = {
  score: number
  applicant: ApplicationForm
}

// Helper to calculate age from DOB
const calculateAge = (dob: Date): number => {
  const diff = Date.now() - dob.getTime()
  const ageDate = new Date(diff)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

// Helper to safely parse JSON properties which might be strings or objects
const safeParse = (json: string | object | null): any => {
  if (!json) return null
  if (typeof json === "object") return json // It's already an object
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const criteriaParam = searchParams.get("criteria")

  let activeCriteria: Record<string, boolean> | null = null
  if (criteriaParam) {
    try {
      activeCriteria = JSON.parse(criteriaParam)
    } catch {
      // Ignore invalid criteria
    }
  }

  try {
    if (!userId) {
      // If no userId is provided, return all female applicants
      const femaleApplicants = await prisma.applicationForm.findMany({
        where: {
          personalDetails: {
            path: ["gender"],
            equals: "Female",
          },
        },
      })
      return NextResponse.json(femaleApplicants)
    }

    // If a userId is provided, perform matching logic
    const maleApplicant = await prisma.applicationForm.findUnique({
      where: { id: userId },
    })

    if (!maleApplicant) {
      return NextResponse.json(
        { error: "Male applicant not found" },
        { status: 404 }
      )
    }

    const malePersonalDetails = safeParse(maleApplicant.personalDetails)
    if (malePersonalDetails?.gender !== "Male") {
      return NextResponse.json(
        { error: "Selected user is not male" },
        { status: 400 }
      )
    }

    const femaleApplicants = await prisma.applicationForm.findMany({
      where: {
        NOT: {
          id: userId,
        },
        personalDetails: {
          path: ["gender"],
          equals: "Female",
        },
      },
    })

    const maleIdealPartner = safeParse(maleApplicant.idealPartner)

    if (!maleIdealPartner) {
      return NextResponse.json(
        { error: "Ideal partner details not found for male applicant" },
        { status: 400 }
      )
    }

    const matches: MatchResult[] = femaleApplicants.map((femaleApplicant) => {
      let score = 0
      let totalPossibleScore = 0

      const femalePersonalDetails = safeParse(femaleApplicant.personalDetails)
      const femaleAppearance = safeParse(femaleApplicant.appearance)
      const femaleCareer = safeParse(femaleApplicant.career)
      const femalePersonality = safeParse(femaleApplicant.personality)
      const femaleLifestyle = safeParse(femaleApplicant.lifestyle)

      if (
        !femalePersonalDetails ||
        !femaleAppearance ||
        !femaleCareer ||
        !femalePersonality ||
        !femaleLifestyle
      ) {
        return { score: 0, applicant: femaleApplicant }
      }

      // Age range match
      if (activeCriteria?.["Ideal Partner Age Range"]) {
        totalPossibleScore += 20
        const femaleAge = calculateAge(new Date(femalePersonalDetails.dob))
        const [minAge, maxAge] = maleIdealPartner.ageRange
          .split("-")
          .map(Number)
        if (femaleAge >= minAge && femaleAge <= maxAge) {
          score += 20
        }
      }

      // Education match
      if (activeCriteria?.["Ideal Partner Education"]) {
        totalPossibleScore += 10
        if (femaleCareer.education === maleIdealPartner.education) {
          score += 10
        }
      }

      // Nationality match
      if (activeCriteria?.["Ideal Partner Nationality"]) {
        totalPossibleScore += 15
        if (
          maleIdealPartner.nationality === "ASIAN" &&
          femalePersonalDetails.nationality
        ) {
          // This is a simplification. A more robust solution would involve a list of Asian countries.
          score += 15
        } else if (
          femalePersonalDetails.nationality === maleIdealPartner.nationality
        ) {
          score += 15
        }
      }

      // Personality match
      if (activeCriteria?.["Ideal Partner Personality"]) {
        totalPossibleScore += 20
        const personalityMatchCount = maleIdealPartner.personality.filter(
          (p: string) => femalePersonality.personality?.includes(p)
        ).length
        score += Math.min(personalityMatchCount * 5, 20)
      }

      // Qualities match
      if (activeCriteria?.["Ideal Partner Qualities"]) {
        totalPossibleScore += 20
        const qualitiesMatchCount = maleIdealPartner.qualities.filter(
          (q: string) => femalePersonality.bestQualities?.includes(q)
        ).length
        score += Math.min(qualitiesMatchCount * 5, 20)
      }

      const finalScore =
        totalPossibleScore > 0
          ? Math.round((score / totalPossibleScore) * 100)
          : 100

      // Deal breakers
      let dealBreakerPenalty = 0
      if (activeCriteria?.["Deal Breakers"]) {
        if (
          maleIdealPartner.dealBreakers?.includes("Smoker") &&
          femaleLifestyle.smoking !== "Never"
        ) {
          dealBreakerPenalty = 100
        }
      }

      const finalScoreWithPenalty = finalScore - dealBreakerPenalty

      return {
        score: Math.max(0, finalScoreWithPenalty),
        applicant: femaleApplicant,
      }
    })

    // Sort by score in descending order
    matches.sort((a, b) => b.score - a.score)

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Matching API Error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
