"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useMounted } from "@/hooks/use-mounted"
import { useAuthStore } from "@/stores/auth-store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user } = useAuthStore()
  const mounted = useMounted()

  useEffect(() => {
    if (mounted && !user) {
      router.replace("/auth")
    }
  }, [router, user, mounted])

  if (!mounted || !user) {
    return
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
        </header>

        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
