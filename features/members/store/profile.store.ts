import { create } from "zustand"
import { type VisibilityState } from "@tanstack/react-table"
import { persist } from "zustand/middleware"
import { Profile } from "@/lib/generated/prisma/client"
import { getProfilesAction } from "../actions/profile.action"

type ProfileState = {
  profiles: Profile[]
  loading: boolean
  error: string | null
  columnVisibility: VisibilityState
  actions: {
    fetchProfiles: () => Promise<void>
    forceFetchProfiles: () => Promise<void>
    setColumnVisibility: (updater: React.SetStateAction<VisibilityState>) => void
  }
}

const defaultColumnVisibility: VisibilityState = {
  nationality: false,
  currentLocation: false,
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      loading: false,
      error: null,
      columnVisibility: defaultColumnVisibility,
      actions: {
        fetchProfiles: async () => {
          if (get().profiles.length > 0) {
            return
          }
          set({ loading: true, error: null })
          try {
            const res = await getProfilesAction()
            if (!res.success) {
              throw new Error(res.error || "Failed to fetch profiles")
            }
            set({ profiles: res.data || [], loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "An unknown error occurred",
              loading: false,
            })
          }
        },
        forceFetchProfiles: async () => {
          set({ loading: true, error: null, profiles: [] })
          try {
            const res = await getProfilesAction()
            if (!res.success) {
              throw new Error(res.error || "Failed to fetch profiles")
            }
            set({ profiles: res.data || [], loading: false })
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
      name: "profile-table-settings",
      partialize: (state) => ({ columnVisibility: state.columnVisibility }),
    }
  )
)

