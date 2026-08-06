
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type VisibilityState } from '@tanstack/react-table'
import { WebsiteReview } from '@/lib/generated/prisma/client'

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
  firstImpression: true,
  easeOfUse: true,
  designBranding: true,
  understandingService: false,
  trustSafety: false,
  contentQuality: false,
  registrationProcess: false,
  pricingValue: false,
  overallExperience: true,
  matchmakingSpecific: false,
  reviewerInfo: false,
  createdAt: true,
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
            const response = await fetch('/api/website-review')
            if (!response.ok) {
              throw new Error('Failed to fetch reviews')
            }
            const reviews = await response.json()
            set({ reviews, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              loading: false,
            })
          }
        },
        forceFetchReviews: async () => {
          set({ loading: true, error: null, reviews: [] })
          try {
            const response = await fetch('/api/website-review')
            if (!response.ok) {
              throw new Error('Failed to fetch reviews')
            }
            const reviews = await response.json()
            set({ reviews, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              loading: false,
            })
          }
        },
        setColumnVisibility: updater => {
          const newVisibility =
            typeof updater === 'function' ? updater(get().columnVisibility) : updater
          set({ columnVisibility: newVisibility })
        },
      },
    }),
    {
      name: 'website-review-table-settings',
      partialize: state => ({ columnVisibility: state.columnVisibility }),
    },
  ),
)
