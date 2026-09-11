"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ClipboardPen,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  User2,
  Shield,
  Users2,
  Form,
  GalleryHorizontal,
  DollarSign,
  HeartHandshake,
  HeartPulse,
  Heart,
  CreditCard,
  Globe2,
  Settings2,
  UserKey,
  Code,
  Moon,
  MessageCircle,
  Calendar1,
  Inbox,
  Mail,
  ChevronRight,
  Send,
  Star,
  FileText,
  Archive,
  ShieldAlert,
  Trash2,
} from "lucide-react"
import { useTheme } from "next-themes"

import { APP_INFO } from "@/constants"
import { EMAIL_ACCOUNTS, EMAIL_FOLDERS } from "@/constants/email"
import { AppName } from "@/components/app-name"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/auth-store"
import { useEmailStore } from "@/stores/email-store"
import { cn } from "@/lib/utils"

const roleIcons: Record<string, React.ElementType> = {
  DEV: Code,
  ADMIN: Shield,
  STAFF: Users2,
  MEMBER: User2,
}

const memberItems = [
  {
    title: "Dashboard",
    url: "/dashboard/member-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Gallery",
    url: "/dashboard/gallery",
    icon: GalleryHorizontal,
  },
  {
    title: "My Soulmate",
    url: "/dashboard/my-soulmate",
    icon: Heart,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: CreditCard,
  },
]

const adminItems = [
  {
    title: "Dashboard",
    url: "/dashboard/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar1,
  },
]

const memberDataItems = [
  {
    title: "Register Interest",
    url: "/dashboard/register-interest",
    icon: ClipboardPen,
  },
  {
    title: "Application Form",
    url: "/dashboard/application-form",
    icon: Form,
  },
  {
    title: "Payment",
    url: "/dashboard/payment",
    icon: DollarSign,
  },
  {
    title: "Profiles",
    url: "/dashboard/profiles",
    icon: Users2,
  },
]

const MatchmakingItems = [
  {
    title: "Matching",
    url: "/dashboard/matching",
    icon: HeartHandshake,
  },
  {
    title: "Tracking",
    url: "/dashboard/tracking",
    icon: HeartPulse,
  },
]

const securityItems = [
  {
    title: "Login User",
    url: "/dashboard/login-user",
    icon: UserKey,
  },
]

const emailFolderIcons: Record<string, React.ElementType> = {
  inbox: Inbox,
  starred: Star,
  sent: Send,
  draft: FileText,
  archive: Archive,
  spam: ShieldAlert,
  trash: Trash2,
  settings: Settings2,
}

type EmailNavigationItem = {
  title: string
  url: string
  icon: React.ElementType
  accountId?: string
  items?: {
    title: string
    url: string
    icon: React.ElementType
  }[]
}

const EMPTY_COUNTS: Record<string, number> = {}

function isRouteActive(pathname: string, itemUrl: string): boolean {
  if (itemUrl === "/") {
    return pathname === "/"
  }
  if (itemUrl === "/dashboard") {
    return pathname === "/dashboard"
  }
  return pathname === itemUrl || pathname.startsWith(itemUrl + "/")
}

function LuxuryGroupLabel({ label }: { label: string }) {
  return (
    <SidebarGroupLabel className="flex h-auto select-none items-center gap-2 px-3 pt-3.5 pb-1 text-[10px] font-bold tracking-[0.18em] text-[#D3A753]/90 uppercase group-data-[collapsible=icon]:hidden dark:text-[#D3A753]">
      <span className="size-1 rounded-full bg-[#D3A753]/60" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-[#D3A753]/25 via-[#D3A753]/10 to-transparent" />
    </SidebarGroupLabel>
  )
}

function SidebarNavItem({
  item,
  pathname,
  badge,
}: {
  item: { title: string; url: string; icon: React.ElementType }
  pathname: string
  badge?: React.ReactNode
}) {
  const active = isRouteActive(pathname, item.url)
  const Icon = item.icon

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={active}
        className={cn(
          "group/nav relative h-9.5 w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          "hover:bg-[#D3A753]/10 hover:text-[#D3A753] dark:hover:bg-[#D3A753]/12",
          active
            ? "border-l-2 border-[#D3A753] bg-gradient-to-r from-[#D3A753]/18 via-[#E791A7]/8 to-transparent font-semibold text-[#D3A753] shadow-[inset_0_1px_0_rgba(211,167,83,0.1)] group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:bg-[#D3A753]/15 group-data-[collapsible=icon]:ring-1 group-data-[collapsible=icon]:ring-[#D3A753]/50 dark:text-[#D3A753]"
            : "text-sidebar-foreground/75"
        )}
      >
        <Link href={item.url} className="flex w-full items-center">
          <Icon
            className={cn(
              "size-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110",
              active
                ? "text-[#D3A753] drop-shadow-[0_0_8px_rgba(211,167,83,0.4)]"
                : "text-muted-foreground group-hover/nav:text-[#D3A753]"
            )}
          />
          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
            {item.title}
          </span>
          {badge}
          {active && !badge && (
            <span className="ml-auto size-1.5 shrink-0 rounded-full bg-[#D3A753] shadow-[0_0_6px_#D3A753] group-data-[collapsible=icon]:hidden" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function EmailSidebarMenuItem({
  item,
  pathname,
  accountId = "contact",
}: {
  item: EmailNavigationItem
  pathname: string
  accountId?: string
}) {
  const effectiveAccId = (item.accountId || accountId).toLowerCase()
  const allFolderCounts = useEmailStore((s) => s.folderCounts)
  const folderCounts = allFolderCounts[effectiveAccId] || EMPTY_COUNTS
  const hasSubItems = Boolean(item.items && item.items.length > 0)
  const isAnySubActive = Boolean(
    item.items?.some((sub) => pathname.startsWith(sub.url))
  )

  const unreadInboxCount = folderCounts.inbox || 0

  if (!hasSubItems) {
    const active = pathname === item.url
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={active}
          className={cn(
            "group/nav relative h-9.5 w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            "hover:bg-[#D3A753]/10 hover:text-[#D3A753]",
            active
              ? "border-l-2 border-[#D3A753] bg-gradient-to-r from-[#D3A753]/18 via-[#E791A7]/8 to-transparent font-semibold text-[#D3A753] group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:bg-[#D3A753]/15 group-data-[collapsible=icon]:ring-1 group-data-[collapsible=icon]:ring-[#D3A753]/50"
              : "text-sidebar-foreground/75"
          )}
        >
          <Link href={item.url} className="flex w-full items-center">
            <item.icon
              className={cn(
                "size-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110",
                active
                  ? "text-[#D3A753] drop-shadow-[0_0_8px_rgba(211,167,83,0.4)]"
                  : "text-muted-foreground group-hover/nav:text-[#D3A753]"
              )}
            />
            <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
            {unreadInboxCount > 0 && (
              <span className="ml-auto rounded-full bg-gradient-to-r from-[#D3A753] to-[#CA617D] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs group-data-[collapsible=icon]:hidden">
                {unreadInboxCount > 99 ? "99+" : unreadInboxCount}
              </span>
            )}
            {active && unreadInboxCount === 0 && (
              <span className="ml-auto size-1.5 shrink-0 rounded-full bg-[#D3A753] shadow-[0_0_6px_#D3A753] group-data-[collapsible=icon]:hidden" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={isAnySubActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className="group/nav h-9.5 w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[#D3A753]/10 hover:text-[#D3A753]"
          >
            <item.icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover/nav:text-[#D3A753]" />
            <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
            {unreadInboxCount > 0 && (
              <span className="mr-1 ml-auto rounded-full bg-gradient-to-r from-[#D3A753] to-[#CA617D] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs group-data-[collapsible=icon]:hidden">
                {unreadInboxCount > 99 ? "99+" : unreadInboxCount}
              </span>
            )}
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub className="ml-4 space-y-0.5 border-l border-[#D3A753]/20 pl-2">
            {item.items?.map((subItem) => {
              const folderSlug = subItem.url.split("/").pop() || ""
              const count = folderCounts[folderSlug] || 0
              const isInbox = folderSlug === "inbox"
              const isDraft = folderSlug === "draft"
              const isSpam = folderSlug === "spam"
              const hasCount = count > 0 && folderSlug !== "settings"
              const isSubActive = pathname === subItem.url

              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubActive}
                    className={cn(
                      "h-8 rounded-md px-2 text-xs transition-all duration-200 hover:bg-[#D3A753]/10 hover:text-[#D3A753]",
                      isSubActive
                        ? "bg-[#D3A753]/15 font-semibold text-[#D3A753]"
                        : "text-sidebar-foreground/70"
                    )}
                  >
                    <Link href={subItem.url} className="flex w-full items-center">
                      {subItem.icon && (
                        <subItem.icon
                          className={cn(
                            "mr-2 size-3.5",
                            isSubActive ? "text-[#D3A753]" : "text-muted-foreground"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "flex-1 truncate",
                          isInbox && count > 0 && "font-semibold text-foreground"
                        )}
                      >
                        {subItem.title}
                      </span>

                      {hasCount && (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                            isInbox
                              ? "bg-gradient-to-r from-[#D3A753] to-[#CA617D] text-white"
                              : isDraft
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                : isSpam
                                  ? "bg-destructive/15 text-destructive"
                                  : "text-muted-foreground"
                          )}
                        >
                          {count > 999 ? "999+" : count}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AppSidebar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const fetchFolderCounts = useEmailStore((s) => s.fetchFolderCounts)

  React.useEffect(() => {
    if (user?.email) {
      fetchFolderCounts(user.email)
    }
  }, [user?.email, pathname, fetchFolderCounts])

  if (!user) {
    return null
  }

  const personalEmailItem: EmailNavigationItem = {
    title: user.email,
    url: "/dashboard/email/personal/inbox",
    accountId: "personal",
    icon: Mail,
    items: EMAIL_FOLDERS.map((folder) => ({
      title: folder.title,
      url: `/dashboard/email/personal/${folder.slug}`,
      icon: emailFolderIcons[folder.id] ?? Mail,
    })),
  }

  const workEmailItems: EmailNavigationItem[] = EMAIL_ACCOUNTS.map(
    (account) => ({
      title: account.email,
      url: `/dashboard/email/${account.id}/inbox`,
      accountId: account.id,
      icon: Mail,
      items: EMAIL_FOLDERS.map((folder) => ({
        title: folder.title,
        url: `/dashboard/email/${account.id}/${folder.slug}`,
        icon: emailFolderIcons[folder.id] ?? Mail,
      })),
    })
  )

  const isWebsiteActive = pathname === "/"

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/70 bg-sidebar/95 backdrop-blur-md"
    >
      {/* Brand Header - Matching Website Navbar Exactly */}
      <SidebarHeader className="relative border-b border-sidebar-border/60 p-3.5 group-data-[collapsible=icon]:p-2">
        {/* Radiant Bottom Border Accent */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#D3A753]/35 to-transparent" />

        <Link
          href="/dashboard"
          className="group flex min-w-0 items-center gap-2 sm:gap-3 group-data-[collapsible=icon]:justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative shrink-0"
          >
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[#D3A753]/20 blur-md transition-opacity group-hover:opacity-100" />
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} logo`}
              width={72}
              height={72}
              className="relative size-10 shrink-0 object-contain sm:size-11 group-data-[collapsible=icon]:size-8"
              priority
            />
          </motion.div>

          <div className="flex min-w-0 flex-1 flex-col items-center justify-center space-y-0.5 text-center group-data-[collapsible=icon]:hidden">
            <AppName className="block truncate text-base font-black tracking-tight uppercase sm:text-lg" />

            <p className="inline-flex items-center justify-center gap-1.5 text-[8px] leading-tight font-semibold tracking-[0.3em] text-[#E791A7] uppercase sm:text-[9px]">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 12 }}
                transition={{ duration: 0.6 }}
                className="h-px bg-[#CA617D]/60"
              />
              EXCLUSIVE
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 12 }}
                transition={{ duration: 0.6 }}
                className="h-px bg-[#CA617D]/60"
              />
            </p>

            <p className="truncate text-[9px] leading-tight font-medium tracking-[0.08em] text-[#D3A753] sm:text-[10px]">
              {APP_INFO.tagline}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1.5 py-1">
        {/* Main Menu */}
        <SidebarGroup>
          <LuxuryGroupLabel label="Main Menu" />

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Go to Website"
                  isActive={isWebsiteActive}
                  className={cn(
                    "group/nav relative h-9.5 w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    "hover:bg-[#D3A753]/10 hover:text-[#D3A753] dark:hover:bg-[#D3A753]/12",
                    isWebsiteActive
                      ? "border-l-2 border-[#D3A753] bg-gradient-to-r from-[#D3A753]/18 via-[#E791A7]/8 to-transparent font-semibold text-[#D3A753] shadow-[inset_0_1px_0_rgba(211,167,83,0.1)] group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:bg-[#D3A753]/15 group-data-[collapsible=icon]:ring-1 group-data-[collapsible=icon]:ring-[#D3A753]/50 dark:text-[#D3A753]"
                      : "text-sidebar-foreground/75"
                  )}
                >
                  <Link href="/" className="flex w-full items-center">
                    <Globe2
                      className={cn(
                        "size-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110",
                        isWebsiteActive
                          ? "text-[#D3A753] drop-shadow-[0_0_8px_rgba(211,167,83,0.4)]"
                          : "text-muted-foreground group-hover/nav:text-[#D3A753]"
                      )}
                    />
                    <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                      Go to Website
                    </span>
                    <span className="ml-auto flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-500 group-data-[collapsible=icon]:hidden">
                      <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Member Menu */}
        {(user.role === "MEMBER" || user.role === "DEV") && (
          <SidebarGroup>
            <LuxuryGroupLabel label="Member Menu" />

            <SidebarGroupContent>
              <SidebarMenu>
                {memberItems.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin / Staff / Dev Team Menu */}
        {user?.role !== "MEMBER" && (
          <SidebarGroup>
            <LuxuryGroupLabel
              label={
                user?.role === "ADMIN"
                  ? "Admin Menu"
                  : user?.role === "STAFF"
                    ? "Staff Menu"
                    : user?.role === "DEV"
                      ? "Dev Menu"
                      : "Team Menu"
              }
            />

            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Member Data */}
        {user?.role !== "MEMBER" && (
          <SidebarGroup>
            <LuxuryGroupLabel label="Member Data" />

            <SidebarGroupContent>
              <SidebarMenu>
                {memberDataItems.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Matchmaking */}
        {user?.role !== "MEMBER" && (
          <SidebarGroup>
            <LuxuryGroupLabel label="Matchmaking" />

            <SidebarGroupContent>
              <SidebarMenu>
                {MatchmakingItems.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Security */}
        {(user?.role === "ADMIN" || user?.role === "DEV") && (
          <SidebarGroup>
            <LuxuryGroupLabel label="Security" />

            <SidebarGroupContent>
              <SidebarMenu>
                {securityItems.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Luxury User Footer */}
      <SidebarFooter className="relative border-t border-sidebar-border/60 bg-gradient-to-t from-[#1C0E12]/30 via-transparent to-transparent p-2.5">
        {/* Subtle decorative gold gradient line at footer top */}
        <div className="pointer-events-none absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#D3A753]/35 to-transparent" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="group/footer h-13 w-full rounded-xl border border-sidebar-border/60 bg-sidebar-accent/20 p-2 transition-all duration-200 hover:border-[#D3A753]/40 hover:bg-[#D3A753]/8 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
              tooltip={user?.name ?? "Account"}
            >
              <Avatar className="size-9 shrink-0 ring-2 ring-[#D3A753]/35 ring-offset-2 ring-offset-background transition-transform duration-200 group-hover/footer:scale-105">
                <AvatarImage
                  src={user?.avatar ?? undefined}
                  alt={user?.name ?? ""}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#D3A753]/25 via-[#E791A7]/20 to-[#CA617D]/25 text-xs font-bold text-[#D3A753]">
                  {user?.fallback}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                <div className="flex w-full items-center justify-between gap-1">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {user?.name}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-1.5 py-0.2 text-[8.5px] font-bold tracking-wider uppercase",
                      user.role === "DEV" &&
                        "border-[#D3A753]/50 bg-[#D3A753]/12 text-[#D3A753]",
                      user.role === "ADMIN" &&
                        "border-[#CA617D]/50 bg-[#CA617D]/12 text-[#CA617D]",
                      user.role === "STAFF" &&
                        "border-[#E791A7]/50 bg-[#E791A7]/12 text-[#E791A7]",
                      user.role === "MEMBER" &&
                        "border-[#D3A753]/50 bg-gradient-to-r from-[#D3A753]/12 to-[#E791A7]/12 text-[#D3A753]"
                    )}
                  >
                    {user?.role}
                  </span>
                </div>
                <span className="truncate text-[11px] text-muted-foreground/80">
                  {user?.email}
                </span>
              </div>

              <ChevronUp className="ml-auto size-4 text-muted-foreground/60 transition-transform duration-200 group-hover/footer:text-[#D3A753] group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="end"
            className="w-64 rounded-xl border border-[#D3A753]/25 bg-popover/95 p-2 shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center space-x-2.5">
                <Avatar className="size-9 ring-1 ring-[#D3A753]/40">
                  <AvatarImage
                    src={user.avatar ?? undefined}
                    alt={user.name ?? ""}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#D3A753]/25 via-[#E791A7]/20 to-[#CA617D]/25 text-xs font-bold text-[#D3A753]">
                    {user.fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-xs font-semibold leading-none">
                      {user.name}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1 text-[9px] font-bold uppercase",
                        user.role === "DEV" &&
                          "border-[#D3A753]/50 bg-[#D3A753]/10 text-[#D3A753]",
                        user.role === "ADMIN" &&
                          "border-[#CA617D]/50 bg-[#CA617D]/10 text-[#CA617D]",
                        user.role === "STAFF" &&
                          "border-[#E791A7]/50 bg-[#E791A7]/10 text-[#E791A7]",
                        user.role === "MEMBER" &&
                          "border-[#D3A753]/50 bg-[#D3A753]/10 text-[#D3A753]"
                      )}
                    >
                      {React.createElement(roleIcons[user.role] || User2, {
                        className: "size-2.5",
                      })}
                      <span>{user.role.toLowerCase()}</span>
                    </Badge>
                  </div>
                  <p className="truncate text-[11px] leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1.5 bg-[#D3A753]/15" />

            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg text-xs font-medium hover:bg-[#D3A753]/10 hover:text-[#D3A753] focus:bg-[#D3A753]/10 focus:text-[#D3A753]"
            >
              <Link href="/">
                <Globe2 className="mr-2 size-4 text-[#D3A753]" />
                <span>Go to Website</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 bg-[#D3A753]/15" />

            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg text-xs font-medium hover:bg-[#D3A753]/10 hover:text-[#D3A753] focus:bg-[#D3A753]/10 focus:text-[#D3A753]"
            >
              <Link href="/dashboard/profile">
                <User2 className="mr-2 size-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="rounded-lg text-xs font-medium hover:bg-[#D3A753]/10 hover:text-[#D3A753] focus:bg-[#D3A753]/10 focus:text-[#D3A753]"
            >
              <Moon className="mr-2 size-4" />
              <span className="flex-1">Dark Mode</span>

              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light")
                }}
                className="data-[state=checked]:bg-[#D3A753]"
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg text-xs font-medium hover:bg-[#D3A753]/10 hover:text-[#D3A753] focus:bg-[#D3A753]/10 focus:text-[#D3A753]"
            >
              <Link href="/dashboard/settings">
                <Settings2 className="mr-2 size-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 bg-[#D3A753]/15" />

            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer rounded-lg text-xs font-medium focus:bg-destructive/12"
              onClick={() => {
                logout()
                router.push("/auth")
              }}
            >
              <LogOut className="mr-2 size-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
