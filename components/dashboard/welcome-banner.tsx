"use client"

import * as React from "react"
import { Sun, Sunrise, Sunset, Moon, Sparkles, Shield, User2, Users2, Code } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const roleIcons: Record<string, React.ElementType> = {
  DEV: Code,
  ADMIN: Shield,
  STAFF: Users2,
  MEMBER: User2,
}

const roleBadgeStyles: Record<string, string> = {
  DEV: "border-purple-500/40 bg-purple-500/15 text-purple-600 dark:text-purple-300",
  ADMIN: "border-[#D3A753]/40 bg-[#D3A753]/15 text-[#8A2535] dark:text-[#E791A7]",
  STAFF: "border-blue-500/40 bg-blue-500/15 text-blue-600 dark:text-blue-300",
  MEMBER: "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
}

export function WelcomeBanner({
  subtitle,
  className,
}: {
  subtitle?: string
  className?: string
}) {
  const { user } = useAuthStore()
  const [mounted, setMounted] = React.useState(false)
  const [currentDateStr, setCurrentDateStr] = React.useState("")
  const [currentTimeStr, setCurrentTimeStr] = React.useState("")
  const [greeting, setGreeting] = React.useState("Welcome")
  const [GreetingIcon, setGreetingIcon] = React.useState<React.ElementType>(Sparkles)

  React.useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const mins = String(now.getMinutes()).padStart(2, "0")
      const formattedTime = `${String(hours).padStart(2, "0")}:${mins}`

      const formattedDate = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })

      setCurrentTimeStr(formattedTime)
      setCurrentDateStr(formattedDate)

      if (hours >= 5 && hours < 12) {
        setGreeting("Good morning")
        setGreetingIcon(Sunrise)
      } else if (hours >= 12 && hours < 17) {
        setGreeting("Good afternoon")
        setGreetingIcon(Sun)
      } else if (hours >= 17 && hours < 22) {
        setGreeting("Good evening")
        setGreetingIcon(Sunset)
      } else {
        setGreeting("Good evening")
        setGreetingIcon(Moon)
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const displayName = user?.name || (user?.role === "ADMIN" ? "Admin" : "Valued Member")
  const userRole = user?.role || "MEMBER"
  const RoleIcon = roleIcons[userRole] || User2
  const badgeStyle = roleBadgeStyles[userRole] || roleBadgeStyles.MEMBER

  const defaultSubtitle =
    userRole === "ADMIN" || userRole === "DEV"
      ? "Here is your system overview and platform metrics for today."
      : "Welcome back to your Thai Soulmate matchmaking dashboard."

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-r from-card via-card to-muted/30 p-5 shadow-xs transition-all sm:p-6",
        className
      )}
    >
      {/* Decorative background glow accents */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#D3A753]/10 blur-3xl dark:bg-[#D3A753]/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#CA617D]/10 blur-3xl dark:bg-[#CA617D]/15"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: User Avatar + Greeting & Name */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 shrink-0 rounded-2xl border-2 border-border/80 shadow-xs ring-2 ring-[#D3A753]/20 sm:h-16 sm:w-16">
            <AvatarImage src={user?.avatar} alt={displayName} />
            <AvatarFallback className="rounded-2xl bg-gradient-to-br from-[#8A2535] to-[#5A0816] text-base font-bold text-white sm:text-lg">
              {user?.fallback || displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                {mounted && <GreetingIcon className="h-3.5 w-3.5 text-[#D3A753]" />}
                <span>{greeting},</span>
              </span>
              <Badge
                variant="outline"
                className={cn("gap-1 px-2 py-0.5 text-[11px] font-semibold", badgeStyle)}
              >
                <RoleIcon className="h-3 w-3" />
                <span>{userRole}</span>
              </Badge>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {displayName}
            </h1>

            <p className="text-xs text-muted-foreground sm:text-sm">
              {subtitle || defaultSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Live Date & 24-Hour Clock Pill */}
        {mounted && currentDateStr && (
          <div className="flex shrink-0 flex-col items-start gap-1 rounded-xl border border-border/60 bg-background/80 px-4 py-2.5 backdrop-blur-xs sm:items-end">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-foreground sm:text-lg">
                {currentTimeStr}
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              {currentDateStr}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default WelcomeBanner
