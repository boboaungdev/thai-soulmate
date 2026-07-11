import { Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { RouteGuard } from "@/components/route-guard"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Thai Soulmate",
  description: "Your journey to finding a soulmate starts here.",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body
        className={cn(
          "antialiased",
          fontMono.variable,
          "font-sans",
          inter.variable
        )}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col overflow-x-clip">
            <NavBar />
            <main className="flex-1">
              <RouteGuard>{children}</RouteGuard>
            </main>
            <Footer />
          </div>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
