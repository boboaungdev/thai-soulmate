"use server"

import { revalidatePath } from "next/cache"
import { TrackingService } from "../services/tracking.service"
import {
  GetTrackingsOptions,
  CreateTrackingInput,
  UpdateTrackingInput,
  CreateTrackingNoteInput,
  UpdateTrackingNoteInput,
} from "../types"

export async function getTrackingsAction(options: GetTrackingsOptions) {
  try {
    return await TrackingService.getTrackings(options)
  } catch (error) {
    console.error("getTrackingsAction error:", error)
    return {
      success: false,
      trackings: [],
      totalCount: 0,
      filteredCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      allMembers: [],
      message: error instanceof Error ? error.message : "Failed to fetch trackings",
    }
  }
}

export async function getTrackingByIdAction(id: string) {
  try {
    return await TrackingService.getTrackingById(id)
  } catch (error) {
    console.error("getTrackingByIdAction error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch tracking",
    }
  }
}

export async function createTrackingAction(input: CreateTrackingInput) {
  try {
    const result = await TrackingService.createTracking(input)
    revalidatePath("/dashboard/tracking")
    return result
  } catch (error) {
    console.error("createTrackingAction error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create tracking",
    }
  }
}

export async function updateTrackingAction(id: string, input: UpdateTrackingInput) {
  try {
    const result = await TrackingService.updateTracking(id, input)
    revalidatePath("/dashboard/tracking")
    revalidatePath(`/dashboard/tracking/${id}`)
    return result
  } catch (error) {
    console.error("updateTrackingAction error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update tracking",
    }
  }
}

export async function deleteTrackingAction(id: string) {
  try {
    const result = await TrackingService.deleteTracking(id)
    revalidatePath("/dashboard/tracking")
    return result
  } catch (error) {
    console.error("deleteTrackingAction error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete tracking",
    }
  }
}

export async function sendTrackingProfilesAction(data: {
  trackingId: string
  male: any
  female: any
}): Promise<{ success: true; tracking: any } | { success: false; message: string }> {
  try {
    const result = await TrackingService.sendTrackingProfiles(data)
    revalidatePath(`/dashboard/tracking/${data.trackingId}`)
    revalidatePath("/dashboard/tracking")
    return { success: true as const, tracking: result.tracking }
  } catch (error) {
    console.error("sendTrackingProfilesAction error:", error)
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Failed to send profile emails",
    }
  }
}

export async function processTrackingEmailResponseAction(data: {
  trackingId: string
  response: string
  from: string
}) {
  try {
    return await TrackingService.processTrackingEmailResponse(data)
  } catch (error) {
    console.error("processTrackingEmailResponseAction error:", error)
    return {
      success: false,
      message: "An unexpected error occurred while processing your response.",
    }
  }
}

// --- Tracking Notes Actions ---
export async function getTrackingNotesAction(trackingId: string) {
  try {
    return await TrackingService.getTrackingNotes(trackingId)
  } catch (error) {
    console.error("getTrackingNotesAction error:", error)
    return {
      success: false,
      notes: [],
      error: error instanceof Error ? error.message : "Failed to fetch notes",
    }
  }
}

export async function addTrackingNoteAction(
  trackingId: string,
  data: CreateTrackingNoteInput
): Promise<{ success: true; note: any } | { success: false; error: string }> {
  try {
    const result = await TrackingService.addTrackingNote(trackingId, data)
    revalidatePath(`/dashboard/tracking/${trackingId}`)
    return { success: true as const, note: result.note }
  } catch (error) {
    console.error("addTrackingNoteAction error:", error)
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to add note",
    }
  }
}

export async function updateTrackingNoteAction(
  trackingId: string,
  noteId: string,
  data: UpdateTrackingNoteInput
): Promise<{ success: true; note: any } | { success: false; error: string }> {
  try {
    const result = await TrackingService.updateTrackingNote(trackingId, noteId, data)
    revalidatePath(`/dashboard/tracking/${trackingId}`)
    if (result.success) {
      return { success: true as const, note: result.note }
    }
    return { success: false as const, error: result.error }
  } catch (error) {
    console.error("updateTrackingNoteAction error:", error)
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to update note",
    }
  }
}

export async function deleteTrackingNoteAction(trackingId: string, noteId: string) {
  try {
    const result = await TrackingService.deleteTrackingNote(trackingId, noteId)
    revalidatePath(`/dashboard/tracking/${trackingId}`)
    return result
  } catch (error) {
    console.error("deleteTrackingNoteAction error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete note",
    }
  }
}
