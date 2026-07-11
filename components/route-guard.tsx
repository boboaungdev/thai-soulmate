"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData && pathname === "/") {
      router.replace("/dashboard")
      // We don't set isChecking to false here because we are redirecting.
      // The new page will have its own render cycle.
    } else {
      setIsChecking(false)
    }
  }, [pathname, router])

  if (isChecking) {
    // You can replace this with a more sophisticated loading skeleton if you like.
    // This will be shown very briefly while the redirect occurs.
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
