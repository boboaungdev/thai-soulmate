import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type VisibilityState } from "@tanstack/react-table"
import { getRegisterInterestsAction } from "../actions/interest.action"

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
  "_count.notes": true,
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
          const res = await getRegisterInterestsAction()
          if (res.ok) {
            set({ users: res.data, loading: false })
          } else {
            set({ error: res.error, loading: false })
          }
        },
        forceFetchUsers: async () => {
          set({ loading: true, error: null, users: [] })
          const res = await getRegisterInterestsAction()
          if (res.ok) {
            set({ users: res.data, loading: false })
          } else {
            set({ error: res.error, loading: false })
          }
        },
        setColumnVisibility: (updater) => {
          const newVisibility =
            typeof updater === "function"
              ? updater(get().columnVisibility)
              : updater
          set({ columnVisibility: newVisibility })
        },
      },
    }),
    {
      name: "register-interest-table-settings",
      partialize: (state) => ({ columnVisibility: state.columnVisibility }),
    }
  )
)
