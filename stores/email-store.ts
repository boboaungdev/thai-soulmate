import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface DbEmailMessage {
  id: string
  resendId?: string | null
  mailbox: string
  folder: "INBOX" | "SENT" | "DRAFT" | "TRASH" | "ARCHIVE" | "SPAM"
  direction: "INBOUND" | "OUTBOUND"
  fromEmail: string
  fromName?: string | null
  toEmails: string[]
  ccEmails: string[]
  bccEmails: string[]
  replyTo?: string | null
  subject: string
  preview?: string | null
  bodyText?: string | null
  bodyHtml: string
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  isTrash: boolean
  attachments: Array<{
    id: string
    filename: string
    contentType: string
    size: number
    url: string
    r2Key: string
    isInline: boolean
  }>
  sentAt?: string | null
  receivedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface MailboxSettings {
  displayName?: string
  signatureText?: string
  signatureImageUrl?: string | null
  signatureSize?: "sm" | "md" | "lg"
  notificationEmails?: string[]
}

interface EmailStoreState {
  emailsByAccount: Record<string, DbEmailMessage[]>
  settingsByAccount: Record<string, MailboxSettings>
  isFetchingByAccount: Record<string, boolean>
  hasInitialLoaded: Record<string, boolean>

  // Actions
  setEmails: (account: string, emails: DbEmailMessage[]) => void
  addEmail: (account: string, email: DbEmailMessage) => void
  updateEmail: (id: string, partial: Partial<DbEmailMessage>) => void
  deleteEmails: (ids: string[]) => void
  setSettings: (account: string, settings: MailboxSettings) => void
  fetchEmails: (
    account: string,
    folder: string,
    searchQuery?: string,
    userEmail?: string
  ) => Promise<void>
  fetchSettings: (account: string) => Promise<void>
}

export function getEmailCacheKey(
  account: string,
  folder: string = "inbox",
  userEmail: string = ""
): string {
  const normAccount = (account || "contact").toLowerCase()
  const normFolder = (folder || "inbox").toLowerCase()
  if (normAccount === "personal") {
    return `personal:${(userEmail || "").toLowerCase()}:${normFolder}`
  }
  return `${normAccount}:${normFolder}`
}

export const useEmailStore = create<EmailStoreState>()(
  persist(
    (set, get) => ({
      emailsByAccount: {},
      settingsByAccount: {},
      isFetchingByAccount: {},
      hasInitialLoaded: {},

      setEmails: (account, emails) =>
        set((state) => ({
          emailsByAccount: { ...state.emailsByAccount, [account]: emails },
          hasInitialLoaded: { ...state.hasInitialLoaded, [account]: true },
        })),

      addEmail: (account, email) =>
        set((state) => {
          const prev = state.emailsByAccount[account] || []
          if (prev.some((e) => e.id === email.id)) return state
          return {
            emailsByAccount: {
              ...state.emailsByAccount,
              [account]: [email, ...prev],
            },
          }
        }),

      updateEmail: (id, partial) =>
        set((state) => {
          const updatedEmailsByAccount: Record<string, DbEmailMessage[]> = {}
          for (const [acc, list] of Object.entries(state.emailsByAccount)) {
            updatedEmailsByAccount[acc] = list.map((msg) =>
              msg.id === id ? { ...msg, ...partial } : msg
            )
          }
          return { emailsByAccount: updatedEmailsByAccount }
        }),

      deleteEmails: (ids) =>
        set((state) => {
          const idSet = new Set(ids)
          const updatedEmailsByAccount: Record<string, DbEmailMessage[]> = {}
          for (const [acc, list] of Object.entries(state.emailsByAccount)) {
            updatedEmailsByAccount[acc] = list.filter(
              (msg) => !idSet.has(msg.id)
            )
          }
          return { emailsByAccount: updatedEmailsByAccount }
        }),

      setSettings: (account, settings) =>
        set((state) => ({
          settingsByAccount: {
            ...state.settingsByAccount,
            [account]: settings,
          },
        })),

      fetchEmails: async (
        account,
        folder,
        searchQuery = "",
        userEmail = ""
      ) => {
        if (folder === "settings") return

        const cacheKey = getEmailCacheKey(account, folder, userEmail)

        const state = get()
        if (state.isFetchingByAccount[cacheKey]) return

        set((s) => ({
          isFetchingByAccount: { ...s.isFetchingByAccount, [cacheKey]: true },
        }))

        try {
          const userEmailParam =
            account === "personal" && userEmail
              ? `&userEmail=${encodeURIComponent(userEmail)}`
              : ""
          const res = await fetch(
            `/api/email?mailbox=${encodeURIComponent(
              account
            )}&folder=${encodeURIComponent(folder)}&q=${encodeURIComponent(
              searchQuery
            )}${userEmailParam}`
          )
          const json = await res.json()
          if (json.success && Array.isArray(json.data)) {
            set((s) => ({
              emailsByAccount: {
                ...s.emailsByAccount,
                [cacheKey]: json.data,
              },
              hasInitialLoaded: {
                ...s.hasInitialLoaded,
                [cacheKey]: true,
              },
            }))
          }
        } catch (err) {
          console.error(`Failed to fetch emails for ${account}:`, err)
        } finally {
          set((s) => ({
            isFetchingByAccount: {
              ...s.isFetchingByAccount,
              [cacheKey]: false,
            },
          }))
        }
      },

      fetchSettings: async (account) => {
        try {
          const res = await fetch(
            `/api/email/settings?mailbox=${encodeURIComponent(account)}`
          )
          const json = await res.json()
          if (json.success && json.data) {
            set((s) => ({
              settingsByAccount: {
                ...s.settingsByAccount,
                [account]: {
                  displayName: json.data.displayName,
                  signatureText: json.data.signatureText,
                  signatureImageUrl: json.data.signatureImageUrl,
                  signatureSize: json.data.signatureSize,
                  notificationEmails: json.data.notificationEmails,
                },
              },
            }))
          }
        } catch (err) {
          console.error(`Failed to fetch settings for ${account}:`, err)
        }
      },
    }),
    {
      name: "thai-soulmate-email-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        emailsByAccount: state.emailsByAccount,
        settingsByAccount: state.settingsByAccount,
        hasInitialLoaded: state.hasInitialLoaded,
      }),
    }
  )
)
