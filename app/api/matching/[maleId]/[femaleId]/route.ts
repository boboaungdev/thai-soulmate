import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ maleId: string; femaleId: string }> }
) {
  const { maleId, femaleId } = await params;

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

    return NextResponse.json({ male: parsedMale, female: parsedFemale })
  } catch (error) {
    console.error("Comparison API Error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
