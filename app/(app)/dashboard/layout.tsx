"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useMounted } from "@/hooks/use-mounted"
import { useAuthStore } from "@/stores/auth-store"
import { AppNavBar } from "@/components/app-nav-bar"

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
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppNavBar />
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
