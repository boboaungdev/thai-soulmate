"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // This effect should only run on the client side.
    // We check if we are on the home page and if the user data exists.
    const userData = localStorage.getItem("user")
    if (userData && pathname === "/") {
      // If so, we start the redirect and show the loading indicator.
      setIsRedirecting(true)
      router.replace("/dashboard")
    }
    // For any other case, we don't need to do anything, and no loading spinner will be shown.
  }, [pathname, router])

  if (isRedirecting) {
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
