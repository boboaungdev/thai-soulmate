"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/stores/auth-store"

export function AuthPageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, router])

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-10 w-48" />
      </div>
    )
  }

  return <>{children}</>
}
