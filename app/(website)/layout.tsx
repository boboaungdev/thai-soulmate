import { Suspense } from "react"

import { Footer } from "@/components/footer"
import { NavBar } from "@/components/nav-bar"

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <Suspense fallback={null}>
        <NavBar />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  )
}
