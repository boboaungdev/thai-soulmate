import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"

export class MatchingRepository {
  static async findMaleApplicant(maleId: string) {
    return prisma.applicationForm.findUnique({
      where: { id: maleId },
      include: {
        membership: true,
        asMale: {
          select: {
            id: true,
            femaleId: true,
            status: true,
            closedFromStatus: true,
            completedStatuses: true,
            createdAt: true,
          },
        },
      },
    })
  }

  static async findFemaleApplicants(where: Prisma.ApplicationFormWhereInput) {
    return prisma.applicationForm.findMany({
      where,
      include: {
        membership: true,
        asFemale: {
          select: {
            id: true,
            maleId: true,
            status: true,
            closedFromStatus: true,
            completedStatuses: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  static async findComparisonApplicants(maleId: string, femaleId: string) {
    const [maleApplicant, femaleApplicant, pairTrackings] = await Promise.all([
      prisma.applicationForm.findUnique({
        where: { id: maleId },
        include: {
          membership: true,
        },
      }),
      prisma.applicationForm.findUnique({
        where: { id: femaleId },
        include: {
          membership: true,
        },
      }),
      prisma.tracking.findMany({
        where: {
          maleId,
          femaleId,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ])

    return {
      maleApplicant,
      femaleApplicant,
      pairTrackings,
    }
  }
}

