import { prisma } from "@/lib/prisma"
import { ProfileStatus } from "@/lib/generated/prisma/enums"

export async function findAllProfiles() {
  const profiles = await prisma.profile.findMany({
    include: {
      notes: true,
      applicationForm: {
        include: {
          membership: true,
        },
      },
    },
    orderBy: {
      applicationForm: {
        customId: "asc",
      },
    },
  })

  return profiles.map(({ applicationForm, ...profile }) => ({
    ...applicationForm,
    ...profile,
  }))
}

export async function findProfileById(id: string) {
  return prisma.profile.findUnique({
    where: { id },
    include: {
      applicationForm: true,
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
    },
  })
}

export async function updateProfile(id: string, data: { status?: ProfileStatus }) {
  return prisma.profile.update({
    where: { id },
    data,
    include: {
      applicationForm: true,
    },
  })
}

export async function updateApplicationPersonalityAbout(
  applicationFormId: string,
  about: string
) {
  const app = await prisma.applicationForm.findUnique({
    where: { id: applicationFormId },
    select: { personality: true },
  })

  const personality: any =
    typeof app?.personality === "string"
      ? JSON.parse(app.personality)
      : app?.personality || {}

  personality.about = about

  return prisma.applicationForm.update({
    where: { id: applicationFormId },
    data: { personality },
  })
}

export async function findGalleryProfiles() {
  return prisma.profile.findMany({
    include: {
      applicationForm: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

