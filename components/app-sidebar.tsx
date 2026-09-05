"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  Video,
  Calendar,
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
import React from "react"

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
  // {
  //   title: "Google Meet",
  //   url: "/dashboard/google-meet",
  //   icon: Video,
  // },
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

const feedbackItems = [
  // {
  //   title: "Website Review",
  //   url: "/dashboard/website-review",
  //   icon: Star,
  // },
  {
    title: "Contact",
    url: "/dashboard/contact",
    icon: MessageCircle,
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
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={pathname === item.url}
        >
          <Link href={item.url}>
            <item.icon />
            <span>{item.title}</span>
            {unreadInboxCount > 0 && (
              <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">
                {unreadInboxCount > 99 ? "99+" : unreadInboxCount}
              </span>
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
          <SidebarMenuButton tooltip={item.title}>
            <item.icon />
            <span className="truncate">{item.title}</span>
            {unreadInboxCount > 0 && (
              <span className="mr-1 ml-auto rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">
                {unreadInboxCount > 99 ? "99+" : unreadInboxCount}
              </span>
            )}
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => {
              const folderSlug = subItem.url.split("/").pop() || ""
              const count = folderCounts[folderSlug] || 0
              const isInbox = folderSlug === "inbox"
              const isDraft = folderSlug === "draft"
              const isSpam = folderSlug === "spam"
              const hasCount = count > 0 && folderSlug !== "settings"

              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                  >
                    <Link href={subItem.url}>
                      {subItem.icon && <subItem.icon />}
                      <span
                        className={cn(
                          isInbox &&
                            count > 0 &&
                            "font-semibold text-foreground"
                        )}
                      >
                        {subItem.title}
                      </span>

                      {hasCount && (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                            isInbox
                              ? "bg-primary text-primary-foreground"
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60 p-3.5">
        <Link href="/dashboard" className="block">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} logo`}
              width={72}
              height={72}
              className="mx-auto size-10 shrink-0 object-contain group-data-[collapsible=icon]:size-8"
              priority
            />

            <div className="flex min-w-0 flex-1 flex-col items-center justify-center space-y-0.5 text-center group-data-[collapsible=icon]:hidden">
              <AppName className="block truncate text-base font-black tracking-tight uppercase" />

              <p className="inline-flex items-center justify-center gap-1.5 text-[9px] leading-tight font-bold tracking-[0.25em] text-[#E791A7] uppercase">
                <span className="h-px w-3 bg-[#CA617D]/60" />
                EXCLUSIVE
                <span className="h-px w-3 bg-[#CA617D]/60" />
              </p>

              <p className="truncate text-[10px] leading-tight font-medium tracking-[0.08em] text-[#D3A753]">
                {APP_INFO.tagline}
              </p>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Main Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Home"
                  isActive={pathname === "/"}
                >
                  <Link href="/">
                    <Globe2 />
                    <span>Go to Website</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {(user.role === "MEMBER" || user.role === "DEV") && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Member Menu
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {memberItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user?.role !== "MEMBER" && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {user?.role === "ADMIN"
                ? "Admin Menu"
                : user?.role === "STAFF"
                  ? "Staff"
                  : user?.role === "DEV"
                    ? "Dev Menu"
                    : "Team Menu"}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user?.role !== "MEMBER" && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Member Data
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {memberDataItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user?.role !== "MEMBER" && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Matchmaking
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {MatchmakingItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* {user?.role !== "MEMBER" && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Feedback
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {feedbackItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )} */}

        {user?.role !== "MEMBER" && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Email
            </SidebarGroupLabel>

            <SidebarGroupContent>
              {/* Personal Section */}
              <div className="px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wider text-sidebar-foreground/60 uppercase group-data-[collapsible=icon]:hidden">
                Personal
              </div>
              <SidebarMenu>
                <EmailSidebarMenuItem
                  item={personalEmailItem}
                  pathname={pathname}
                />
              </SidebarMenu>

              {/* Work Section */}
              <div className="px-2 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-sidebar-foreground/60 uppercase group-data-[collapsible=icon]:hidden">
                Work
              </div>
              <SidebarMenu>
                {workEmailItems.map((item) => (
                  <EmailSidebarMenuItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(user?.role === "ADMIN" || user?.role === "DEV") && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Security
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {securityItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="h-12 w-full group-data-[collapsible=icon]:justify-center"
              tooltip="Account"
            >
              <Avatar className="size-8">
                <AvatarImage
                  src={user?.avatar ?? undefined}
                  alt={user?.name ?? ""}
                />
                <AvatarFallback>{user?.fallback}</AvatarFallback>
              </Avatar>

              <div className="flex flex-1 flex-col items-start overflow-hidden group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">
                  {user?.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>

              <ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center space-x-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={user.avatar ?? undefined}
                    alt={user.name ?? ""}
                  />
                  <AvatarFallback>{user.fallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm leading-none font-medium">
                      {user.name}
                    </p>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 capitalize"
                    >
                      {React.createElement(roleIcons[user.role], {
                        className: "size-3",
                      })}
                      <span>{user.role.toLowerCase()}</span>
                    </Badge>
                  </div>
                  <p className="truncate text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <Globe2 className="mr-2 size-4" />
                <span>Go to Website</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="#">
                <User2 className="mr-2 size-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Moon className="mr-2 size-4" />
              <span className="flex-1">Dark Mode</span>

              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light")
                }}
              />
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="#">
                <Settings2 className="mr-2 size-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
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
