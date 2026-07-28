"use client"

import { useEffect } from "react"
import { usePathname, useRouter, notFound } from "next/navigation"

import { AppNavBar } from "@/components/app-nav-bar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useMounted } from "@/hooks/use-mounted"
import { useAuthStore } from "@/stores/auth-store"

const adminPaths = ["/dashboard/admin-dashboard", "/dashboard/login-user"]
const staffPaths = [
  "/dashboard/staff-dashboard",
  "/dashboard/application-form",
  "/dashboard/matching",
  "/dashboard/payment",
  "/dashboard/register-interest",
  "/dashboard/tracking",
]
const userPaths = ["/dashboard/billing", "/dashboard/gallery"]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuthStore()
  const mounted = useMounted()

  useEffect(() => {
    if (mounted && !user) {
      router.replace("/auth")
      return
    }

    if (mounted && user) {
      const { role } = user

      if (role === "ADMIN") {
        const isAccessingAllowedPath = adminPaths.some((path) =>
          pathname.startsWith(path)
        )
        if (!isAccessingAllowedPath) {
          return notFound()
        }
      } else if (role === "STAFF") {
        const isAccessingAllowedPath = staffPaths.some((path) =>
          pathname.startsWith(path)
        )
        if (!isAccessingAllowedPath) {
          return notFound()
        }
      } else if (role === "USER") {
        const isAccessingAllowedPath = userPaths.some((path) =>
          pathname.startsWith(path)
        )
        if (!isAccessingAllowedPath) {
          return notFound()
        }
      }
    }
  }, [router, user, mounted, pathname])

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
