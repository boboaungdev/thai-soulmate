"use server"

import { revalidatePath } from "next/cache"
import { ProfileStatus } from "@/lib/generated/prisma/enums"
import {
  getProfiles,
  getProfileDetails,
  updateProfileDetails,
  getGalleryProfilesList,
  getGalleryProfileDetails,
} from "../services/profile.service"

export async function getProfilesAction() {
  try {
    const data = await getProfiles()
    return { success: true, data: JSON.parse(JSON.stringify(data)) }
  } catch (error: any) {
    console.error("getProfilesAction error:", error)
    return { success: false, error: error?.message || "Failed to fetch profiles", data: [] }
  }
}

export async function getProfileByIdAction(id: string) {
  try {
    const profile = await getProfileDetails(id)
    if (!profile) {
      return { success: false, message: "Profile not found", profile: null }
    }
    return { success: true, profile: JSON.parse(JSON.stringify(profile)) }
  } catch (error: any) {
    console.error("getProfileByIdAction error:", error)
    return { success: false, message: error?.message || "Failed to fetch profile", profile: null }
  }
}

export async function updateProfileAction(
  id: string,
  payload: { status?: ProfileStatus; about?: string }
) {
  try {
    const outcome = await updateProfileDetails(id, payload)
    if (!outcome.ok) {
      return { success: false, message: outcome.error }
    }
    revalidatePath("/dashboard/profiles")
    revalidatePath(`/dashboard/profiles/${id}`)
    return { success: true, profile: JSON.parse(JSON.stringify(outcome.profile)) }
  } catch (error: any) {
    console.error("updateProfileAction error:", error)
    return { success: false, message: error?.message || "Failed to update profile" }
  }
}

export async function getGalleryProfilesAction(filters?: {
  gender?: string
  nickname?: string
  customId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  try {
    const data = await getGalleryProfilesList(filters)
    return { success: true, data: JSON.parse(JSON.stringify(data)) }
  } catch (error: any) {
    console.error("getGalleryProfilesAction error:", error)
    return { success: false, error: error?.message || "Failed to fetch gallery", data: [] }
  }
}

export async function getGalleryProfileByIdAction(id: string) {
  try {
    const profile = await getGalleryProfileDetails(id)
    if (!profile) {
      return { success: false, message: "Profile not found", profile: null }
    }
    return { success: true, profile: JSON.parse(JSON.stringify(profile)) }
  } catch (error: any) {
    console.error("getGalleryProfileByIdAction error:", error)
    return { success: false, message: error?.message || "Failed to fetch profile", profile: null }
  }
}

