import { prisma } from "@/lib/prisma"
import type { ApplicationFormStatus } from "@/lib/generated/prisma/client"

export async function findAllApplications() {
  return prisma.applicationForm.findMany({
    include: {
      membership: true,
      notes: {
        select: { id: true },
      },
      asMale: {
        select: {
          id: true,
          femaleId: true,
          status: true,
          completedStatuses: true,
          closedFromStatus: true,
          createdAt: true,
        },
      },
      asFemale: {
        select: {
          id: true,
          maleId: true,
          status: true,
          completedStatuses: true,
          closedFromStatus: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function findApplicationById(id: string) {
  return prisma.applicationForm.findUnique({
    where: { id },
    include: {
      notes: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      membership: true,
    },
  })
}

export async function findApplicationByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim()
  return prisma.applicationForm.findFirst({
    where: {
      personalDetails: {
        path: ["email"],
        equals: normalizedEmail,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      customId: true,
      status: true,
      personalDetails: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function createApplicationWithRelations(payload: any) {
  return prisma.$transaction(async (tx) => {
    const application = await tx.applicationForm.create({
      data: {
        status: "RECEIVED",
        personalDetails: payload.personalDetails,
        career: payload.career,
        appearance: payload.appearance,
        personality: payload.personality,
        lifestyle: payload.lifestyle,
        relationshipGoals: payload.relationshipGoals,
        idealPartner: payload.idealPartner,
        financial: payload.financial,
        photos: payload.photos,
      },
    })

    await tx.profile.create({
      data: {
        applicationFormId: application.id,
        status: "PENDING",
      },
    })

    if (payload.plan && payload.plan !== "NONE") {
      await tx.membership.create({
        data: {
          applicationFormId: application.id,
          plan: payload.plan,
        },
      })
    }

    return application
  })
}

export async function updateApplicationStatus(id: string, status: ApplicationFormStatus) {
  return prisma.applicationForm.update({
    where: { id },
    data: { status },
  })
}

export async function deleteApplication(id: string) {
  return prisma.applicationForm.delete({
    where: { id },
  })
}
