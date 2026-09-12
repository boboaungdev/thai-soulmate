"use server"

import { reviewService } from "../services/review.service"
import { websiteReviewSchema } from "../schemas/review.schema"
import { revalidatePath } from "next/cache"

export async function getReviewsAction() {
  try {
    const reviews = await reviewService.getReviews()
    return { success: true as const, data: reviews }
  } catch (error: any) {
    console.error("getReviewsAction error:", error)
    return {
      success: false as const,
      error: error?.message || "Failed to fetch reviews.",
    }
  }
}

export async function getReviewByIdAction(id: string) {
  try {
    if (!id) {
      return { success: false as const, error: "Review ID is required." }
    }
    const review = await reviewService.getReviewById(id)
    if (!review) {
      return { success: false as const, error: "Review not found." }
    }
    return { success: true as const, data: review }
  } catch (error: any) {
    console.error("getReviewByIdAction error:", error)
    return {
      success: false as const,
      error: error?.message || "Failed to fetch review.",
    }
  }
}

export async function submitReviewAction(rawData: unknown) {
  try {
    const parsed = websiteReviewSchema.safeParse(rawData)
    if (!parsed.success) {
      return {
        success: false as const,
        error: "Validation error: " + parsed.error.issues.map((i) => i.message).join(", "),
      }
    }

    const review = await reviewService.submitReview(parsed.data)
    revalidatePath("/dashboard/website-review")
    return { success: true as const, data: review }
  } catch (error: any) {
    console.error("submitReviewAction error:", error)
    return {
      success: false as const,
      error: error?.message || "Failed to submit review.",
    }
  }
}

export async function deleteReviewAction(id: string) {
  try {
    if (!id) {
      return { success: false as const, error: "Review ID is required." }
    }
    await reviewService.deleteReview(id)
    revalidatePath("/dashboard/website-review")
    return { success: true as const }
  } catch (error: any) {
    console.error("deleteReviewAction error:", error)
    return {
      success: false as const,
      error: error?.message || "Failed to delete review.",
    }
  }
}

