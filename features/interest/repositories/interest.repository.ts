import { prisma } from "@/lib/prisma"
import type { RegisterInterestStatus } from "@/lib/generated/prisma/enums"
import type { Prisma } from "@/lib/generated/prisma/client"

export async function findInterestByEmail(email: string) {
  return prisma.registerInterest.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      notes: true,
      _count: {
        select: { notes: true },
      },
    },
  })
}

export async function findInterestById(id: string) {
  return prisma.registerInterest.findUnique({
    where: { id },
    include: {
      notes: true,
      _count: {
        select: { notes: true },
      },
    },
  })
}

export async function findAllInterests() {
  return prisma.registerInterest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      notes: true,
      _count: {
        select: { notes: true },
      },
    },
  })
}

export async function upsertInterest(data: {
  email: string
  prefix: string
  name: string
  dob?: Date | null
  gender: string
  nationality: string
  nationalityRegion: string
  currentLocation: string
  currentLocationRegion: string
  relationshipGoal?: string | null
  phoneCountry: string
  phone: string
  preferredContactDate?: Date | null
  preferredContactTime?: string | null
  source: string
  otherSource?: string | null
}) {
  return prisma.registerInterest.upsert({
    where: { email: data.email.toLowerCase() },
    update: data,
    create: data,
  })
}

export async function updateInterestStatus(id: string, status: RegisterInterestStatus) {
  return prisma.registerInterest.update({
    where: { id },
    data: { status },
  })
}

export async function deleteInterest(id: string) {
  return prisma.registerInterest.delete({
    where: { id },
  })
}

export async function findExistingApplicationByEmail(email: string) {
  return prisma.applicationForm.findFirst({
    where: {
      personalDetails: {
        path: ["email"],
        equals: email.toLowerCase(),
      },
    },
    select: {
      id: true,
      customId: true,
      status: true,
      personalDetails: true,
    },
  })
}
