
import { create } from 'zustand'
import { type VisibilityState } from '@tanstack/react-table'
import { persist } from 'zustand/middleware'
import { Profile } from '@/lib/generated/prisma/client'

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
            const response = await fetch('/api/profiles')
            if (!response.ok) {
              throw new Error('Failed to fetch profiles')
            }
            const data = await response.json()
            set({ profiles: data.data, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              loading: false,
            })
          }
        },
        forceFetchProfiles: async () => {
          set({ loading: true, error: null, profiles: [] })
          try {
            const response = await fetch('/api/profiles')
            if (!response.ok) {
              throw new Error('Failed to fetch profiles')
            }
            const data = await response.json()
            set({ profiles: data.data, loading: false })
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
      name: 'profile-table-settings',
      partialize: state => ({ columnVisibility: state.columnVisibility }),
    },
  ),
)
