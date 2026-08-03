
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type VisibilityState } from '@tanstack/react-table'

type ApplicationFormState = {
  applications: any[]
  loading: boolean
  error: string | null
  columnVisibility: VisibilityState
  actions: {
    fetchApplications: () => Promise<void>
    forceFetchApplications: () => Promise<void>
    setColumnVisibility: (updater: React.SetStateAction<VisibilityState>) => void
  }
}

const defaultColumnVisibility: VisibilityState = {
  phone: true,
  nationality: true,
  currentLocation: true,
  dob: true,
  createdAt: true,
  'user.name': true,
  'user.email': true,
  'user.phone': true,
}

export const useApplicationFormStore = create<ApplicationFormState>()(
  persist(
    (set, get) => ({
      applications: [],
      loading: false,
      error: null,
      columnVisibility: defaultColumnVisibility,
      actions: {
        fetchApplications: async () => {
          if (get().applications.length > 0) {
            return
          }
          set({ loading: true, error: null })
          try {
            const response = await fetch('/api/application-form')
            if (!response.ok) {
              throw new Error('Failed to fetch applications')
            }
            const data = await response.json()
            set({ applications: data.applications, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              loading: false,
            })
          }
        },
        forceFetchApplications: async () => {
          set({ loading: true, error: null, applications: [] })
          try {
            const response = await fetch('/api/application-form')
            if (!response.ok) {
              throw new Error('Failed to fetch applications')
            }
            const data = await response.json()
            set({ applications: data.applications, loading: false })
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
      name: 'application-form-table-settings',
      partialize: state => ({ columnVisibility: state.columnVisibility }),
    },
  ),
)
