"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { AppNavBar } from "@/components/app-nav-bar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useMounted } from "@/hooks/use-mounted"
import { useAuthStore } from "@/stores/auth-store"

const allowedRoutes = {
  ADMIN: ["/dashboard"], // Admin can access all dashboard routes
  STAFF: [
    "/dashboard/staff-dashboard",
    "/dashboard/application-form",
    "/dashboard/matching",
    "/dashboard/payment",
    "/dashboard/register-interest",
    "/dashboard/tracking",
    "/dashboard/profiles",
    "/dashboard/profile",
    "/dashboard/settings",
  ],
  USER: [
    "/dashboard/user-dashboard",
    "/dashboard/billing",
    "/dashboard/gallery",
    "/dashboard/my-soulmate",
    "/dashboard/my-tracking",
    "/dashboard/profile",
    "/dashboard/settings",
  ],
} as const

const dashboardHome = {
  ADMIN: "/dashboard/admin-dashboard",
  STAFF: "/dashboard/staff-dashboard",
  USER: "/dashboard/user-dashboard",
} as const

function isAllowedRoute(role: keyof typeof allowedRoutes, pathname: string) {
  if (role === "ADMIN") {
    return true
  }

  return allowedRoutes[role].some((route) => pathname.startsWith(route))
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const mounted = useMounted()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!mounted) return

    // Not authenticated
    if (!user) {
      router.replace("/auth")
      return
    }

    // Redirect /dashboard to the correct dashboard
    if (pathname === "/dashboard") {
      router.replace(dashboardHome[user.role])
      return
    }

    // Redirect unauthorized users
    if (!isAllowedRoute(user.role, pathname)) {
      router.replace(dashboardHome[user.role])
    }
  }, [mounted, pathname, router, user])

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
