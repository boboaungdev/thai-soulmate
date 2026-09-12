import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type VisibilityState } from "@tanstack/react-table"
import { WebsiteReview } from "../types/review.types"
import { getReviewsAction } from "../actions/review.action"

type WebsiteReviewState = {
  reviews: WebsiteReview[]
  loading: boolean
  error: string | null
  columnVisibility: VisibilityState
  actions: {
    fetchReviews: () => Promise<void>
    forceFetchReviews: () => Promise<void>
    setColumnVisibility: (updater: React.SetStateAction<VisibilityState>) => void
  }
}

const defaultColumnVisibility: VisibilityState = {
  select: true,
  designRating: true,
  formEaseRating: true,
  easeOfUseRating: false,
  overallExperienceRating: false,
  wouldRecommend: false,
  serviceUnderstood: false,
  feltSafe: true,
  easyEnglish: true,
  createdAt: true,
  actions: true,
}

export const useWebsiteReviewStore = create<WebsiteReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      loading: false,
      error: null,
      columnVisibility: defaultColumnVisibility,
      actions: {
        fetchReviews: async () => {
          if (get().reviews.length > 0) {
            return
          }
          set({ loading: true, error: null })
          try {
            const res = await getReviewsAction()
            if (!res.success) {
              throw new Error(res.error || "Failed to fetch reviews")
            }
            set({ reviews: res.data || [], loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "An unknown error occurred",
              loading: false,
            })
          }
        },
        forceFetchReviews: async () => {
          set({ loading: true, error: null, reviews: [] })
          try {
            const res = await getReviewsAction()
            if (!res.success) {
              throw new Error(res.error || "Failed to fetch reviews")
            }
            set({ reviews: res.data || [], loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "An unknown error occurred",
              loading: false,
            })
          }
        },
        setColumnVisibility: (updater) => {
          const newVisibility =
            typeof updater === "function" ? updater(get().columnVisibility) : updater
          set({ columnVisibility: newVisibility })
        },
      },
    }),
    {
      name: "website-review-table-settings",
      partialize: (state) => ({ columnVisibility: state.columnVisibility }),
    }
  )
)

