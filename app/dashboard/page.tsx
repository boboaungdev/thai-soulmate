"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.replace("/auth")
    }
    setLoading(false)
  }, [router])

  if (loading || !user) {
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
