import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface User {
  id: string
  name?: string
  email: string
  role: string
  avatar?: string
  fallback?: string
}

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        const fallback =
          user?.name
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() ||
          user?.email[0].toUpperCase() ||
          ""
        set({ user: user ? { ...user, fallback } : null })
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
