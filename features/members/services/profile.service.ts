import { ProfileStatus } from "@/lib/generated/prisma/enums"
import {
  findAllProfiles,
  findProfileById,
  updateProfile,
  updateApplicationPersonalityAbout,
  findGalleryProfiles,
} from "../repositories/profile.repository"

function parseJSONField(field: any): any {
  if (typeof field === "string") {
    try {
      return JSON.parse(field)
    } catch {
      return {}
    }
  }
  return field || {}
}

export async function getProfiles() {
  return findAllProfiles()
}

export async function getProfileDetails(id: string) {
  const profile = await findProfileById(id)
  if (!profile) return null

  const parsedApplication = {
    ...profile.applicationForm,
    personalDetails: parseJSONField(profile.applicationForm.personalDetails),
    career: parseJSONField(profile.applicationForm.career),
    appearance: parseJSONField(profile.applicationForm.appearance),
    personality: parseJSONField(profile.applicationForm.personality),
    lifestyle: parseJSONField(profile.applicationForm.lifestyle),
    relationshipGoals: parseJSONField(profile.applicationForm.relationshipGoals),
    idealPartner: parseJSONField(profile.applicationForm.idealPartner),
    financial: parseJSONField(profile.applicationForm.financial),
    photos: parseJSONField(profile.applicationForm.photos),
  }

  return {
    ...profile,
    applicationForm: parsedApplication,
  }
}

export async function updateProfileDetails(
  id: string,
  payload: { status?: ProfileStatus; about?: string }
) {
  const profile = await findProfileById(id)
  if (!profile) {
    return { ok: false, error: "Profile not found" } as const
  }

  const profileUpdateData: { status?: ProfileStatus } = {}
  if (payload.status) {
    profileUpdateData.status = payload.status
  }

  if (payload.about !== undefined) {
    await updateApplicationPersonalityAbout(
      profile.applicationFormId,
      payload.about
    )

    if (profile.status === ProfileStatus.PENDING) {
      profileUpdateData.status = ProfileStatus.COMPLETED
    }
  }

  if (Object.keys(profileUpdateData).length > 0) {
    await updateProfile(id, profileUpdateData)
  }

  const updatedProfile = await findProfileById(id)
  return { ok: true, profile: updatedProfile } as const
}

export async function getGalleryProfilesList(filters?: {
  gender?: string
  nickname?: string
  customId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  let profiles = await findGalleryProfiles()

  const gender = filters?.gender || "All"
  const nickname = filters?.nickname || ""
  const customId = filters?.customId || ""
  const sortBy = filters?.sortBy || "createdAt"
  const sortOrder = filters?.sortOrder === "asc" ? "asc" : "desc"

  if (gender !== "All") {
    profiles = profiles.filter((p) => {
      const personal = p.applicationForm?.personalDetails as any
      return personal?.gender?.toLowerCase() === gender.toLowerCase()
    })
  }

  if (nickname) {
    profiles = profiles.filter((p) => {
      const personal = p.applicationForm?.personalDetails as any
      return personal?.nickname?.toLowerCase().includes(nickname.toLowerCase())
    })
  }

  if (customId) {
    profiles = profiles.filter((p) =>
      String(p.applicationForm?.customId).padStart(4, "0").includes(customId)
    )
  }

  profiles.sort((a, b) => {
    let aVal: any
    let bVal: any

    switch (sortBy) {
      case "customId":
        aVal = a.applicationForm?.customId
        bVal = b.applicationForm?.customId
        break
      case "nickname":
        aVal = ((a.applicationForm?.personalDetails as any)?.nickname || "").toLowerCase()
        bVal = ((b.applicationForm?.personalDetails as any)?.nickname || "").toLowerCase()
        break
      case "createdAt":
      default:
        aVal = new Date(a.createdAt).getTime()
        bVal = new Date(b.createdAt).getTime()
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  return profiles
}

export async function getGalleryProfileDetails(id: string) {
  const profile = await findProfileById(id)
  if (!profile) return null

  return {
    ...profile,
    customId: profile.applicationForm?.customId,
    personalDetails: parseJSONField(profile.applicationForm?.personalDetails),
    career: parseJSONField(profile.applicationForm?.career),
    appearance: parseJSONField(profile.applicationForm?.appearance),
    personality: parseJSONField(profile.applicationForm?.personality),
    lifestyle: parseJSONField(profile.applicationForm?.lifestyle),
    relationshipGoals: parseJSONField(profile.applicationForm?.relationshipGoals),
    idealPartner: parseJSONField(profile.applicationForm?.idealPartner),
    financial: parseJSONField(profile.applicationForm?.financial),
    photos: parseJSONField(profile.applicationForm?.photos),
  }
}

