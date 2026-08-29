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
} from "lucide-react"
import { useTheme } from "next-themes"

import { APP_INFO } from "@/constants"
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
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/auth-store"
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
  {
    title: "Google Meet",
    url: "/dashboard/google-meet",
    icon: Video,
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

const EmailItems = [
  {
    title: "socials@gmail.com",
    url: "#",
    icon: Mail,
  },
  {
    title: "contact@thaisoulmate.com",
    url: "#",
    icon: Mail,
  },
]

export function AppSidebar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  if (!user) {
    return null
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/dashboard">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} logo`}
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-lg object-cover"
              priority
            />

            <div className="flex-1 text-center group-data-[collapsible=icon]:hidden">
              <AppName className="text-base font-semibold" />

              <p className="text-xs text-muted-foreground">Exclusive</p>

              <p className="truncate text-xs text-muted-foreground">
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
              <SidebarMenu>
                {EmailItems.map((item) => (
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
