"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/stores/auth-store"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    // This check now relies on the persisted state from Zustand.
    // We add a small delay to allow Zustand to hydrate from localStorage.
    const timer = setTimeout(() => {
      if (!user) {
        router.replace("/auth")
      }
    }, 100) // A short delay to prevent flicker if the user is logged in.
    return () => clearTimeout(timer)
  }, [router, user])

  if (!user) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="flex-1" />
      </div>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <p className="text-muted-foreground">
          Welcome to your dashboard, {user.name}!
        </p>
      </div>
    </main>
  )
}
