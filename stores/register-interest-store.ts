
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type VisibilityState } from '@tanstack/react-table'

type RegisterInterestState = {
  users: any[]
  loading: boolean
  error: string | null
  columnVisibility: VisibilityState
  actions: {
    fetchUsers: () => Promise<void>
    forceFetchUsers: () => Promise<void>
    setColumnVisibility: (updater: React.SetStateAction<VisibilityState>) => void
  }
}

const defaultColumnVisibility: VisibilityState = {
  phone: true,
  nationality: false,
  currentLocation: false,
  dob: false,
  createdAt: true,
  '_count.notes': true,
}

export const useRegisterInterestStore = create<RegisterInterestState>()(
  persist(
    (set, get) => ({
      users: [],
      loading: false,
      error: null,
      columnVisibility: defaultColumnVisibility,
      actions: {
        fetchUsers: async () => {
          if (get().users.length > 0) {
            return
          }
          set({ loading: true, error: null })
          try {
            const response = await fetch('/api/register-interest')
            if (!response.ok) {
              throw new Error('Failed to fetch users')
            }
            const users = await response.json()
            set({ users, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              loading: false,
            })
          }
        },
        forceFetchUsers: async () => {
          set({ loading: true, error: null, users: [] })
          try {
            const response = await fetch('/api/register-interest')
            if (!response.ok) {
              throw new Error('Failed to fetch users')
            }
            const users = await response.json()
            set({ users, loading: false })
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
      name: 'register-interest-table-settings',
      partialize: state => ({ columnVisibility: state.columnVisibility }),
    },
  ),
)
