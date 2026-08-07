
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type VisibilityState } from '@tanstack/react-table'
import { Contact } from '@/lib/generated/prisma/client'

type ContactState = {
  contacts: Contact[]
  loading: boolean
  error: string | null
  columnVisibility: VisibilityState
  actions: {
    fetchContacts: () => Promise<void>
    forceFetchContacts: () => Promise<void>
    setColumnVisibility: (updater: React.SetStateAction<VisibilityState>) => void
  }
}

const defaultColumnVisibility: VisibilityState = {
  select: true,
  name: true,
  email: true,
  subject: true,
  message: false,
  createdAt: true,
  actions: true,
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      loading: false,
      error: null,
      columnVisibility: defaultColumnVisibility,
      actions: {
        fetchContacts: async () => {
          if (get().contacts.length > 0) {
            return
          }
          set({ loading: true, error: null })
          try {
            const response = await fetch('/api/contact')
            if (!response.ok) {
              throw new Error('Failed to fetch contacts')
            }
            const contacts = await response.json()
            set({ contacts, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              loading: false,
            })
          }
        },
        forceFetchContacts: async () => {
          set({ loading: true, error: null, contacts: [] })
          try {
            const response = await fetch('/api/contact')
            if (!response.ok) {
              throw new Error('Failed to fetch contacts')
            }
            const contacts = await response.json()
            set({ contacts, loading: false })
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
      name: 'contact-table-settings',
      partialize: state => ({ columnVisibility: state.columnVisibility }),
    },
  ),
)
