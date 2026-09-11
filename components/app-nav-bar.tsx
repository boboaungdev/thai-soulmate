"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Calendar1,
  ClipboardPen,
  Code,
  CreditCard,
  DollarSign,
  FileText,
  GalleryHorizontal,
  Globe2,
  Heart,
  HeartHandshake,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Moon,
  Search,
  Settings2,
  Shield,
  Sparkles,
  Sun,
  User2,
  UserKey,
  Users2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/auth-store"
import { Switch } from "./ui/switch"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const roleIcons: Record<string, React.ElementType> = {
  DEV: Code,
  ADMIN: Shield,
  STAFF: Users2,
  MEMBER: User2,
}

export function AppNavBar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.replace("/auth")
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!user) {
    return (
      <header className="relative flex h-16 items-center border-b border-sidebar-border/60 bg-background/80 px-4 backdrop-blur-md">
        <SidebarTrigger className="hover:bg-[#D3A753]/10 hover:text-[#D3A753] transition-colors" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D3A753]/30 to-transparent" />
      </header>
    )
  }

  return (
    <>
      <header className="relative flex h-16 items-center border-b border-sidebar-border/60 bg-background/80 px-4 backdrop-blur-md">
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D3A753]/30 to-transparent" />

        <SidebarTrigger className="hover:bg-[#D3A753]/10 hover:text-[#D3A753] transition-colors" />

        <div className="flex flex-1 justify-center">
          <Button
            variant="outline"
            className="relative mx-auto w-72 justify-start rounded-full border-sidebar-border/80 bg-background/60 text-sm text-muted-foreground shadow-xs transition-all hover:border-[#D3A753]/40 hover:text-[#D3A753]"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 size-4 text-muted-foreground" />
            <span className="hidden lg:inline-flex">Search dashboard...</span>
            <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden h-5 -translate-y-1/2 items-center gap-1 rounded border border-sidebar-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-90 select-none sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="group relative size-9 rounded-full ring-2 ring-[#D3A753]/35 ring-offset-2 ring-offset-background transition-all hover:ring-[#D3A753]/60"
              >
                <Avatar className="size-9">
                  <AvatarImage
                    src={user.avatar ?? undefined}
                    alt={user.name ?? ""}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#D3A753]/25 via-[#E791A7]/20 to-[#CA617D]/25 text-xs font-bold text-[#D3A753]">
                    {user.fallback}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-64 rounded-xl border border-[#D3A753]/25 bg-popover/95 p-2 shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              align="end"
              forceMount
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

              <DropdownMenuGroup>
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
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5 bg-[#D3A753]/15" />

              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-lg text-xs font-medium focus:bg-destructive/12"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search dashboard..." />
        <CommandList className="max-h-[380px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Role-Specific Navigation */}
          {user.role === "MEMBER" ? (
            <CommandGroup heading="Member Dashboard">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/member-dashboard")
                }}
                className="cursor-pointer"
              >
                <LayoutDashboard className="mr-2 size-4 text-[#D3A753]" />
                <span>Member Dashboard</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/gallery")
                }}
                className="cursor-pointer"
              >
                <GalleryHorizontal className="mr-2 size-4 text-[#D3A753]" />
                <span>Curated Gallery</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/my-soulmate")
                }}
                className="cursor-pointer"
              >
                <Heart className="mr-2 size-4 text-[#CA617D]" />
                <span>My Soulmate</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/billing")
                }}
                className="cursor-pointer"
              >
                <CreditCard className="mr-2 size-4 text-[#D3A753]" />
                <span>Billing & Membership</span>
              </CommandItem>
            </CommandGroup>
          ) : (
            <CommandGroup heading="Management & Planning">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/admin-dashboard")
                }}
                className="cursor-pointer"
              >
                <LayoutDashboard className="mr-2 size-4 text-[#D3A753]" />
                <span>
                  {user.role === "ADMIN"
                    ? "Admin Dashboard"
                    : user.role === "DEV"
                      ? "Dev Dashboard"
                      : "Staff Dashboard"}
                </span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/calendar")
                }}
                className="cursor-pointer"
              >
                <Calendar1 className="mr-2 size-4 text-[#D3A753]" />
                <span>Appointments Calendar</span>
              </CommandItem>
            </CommandGroup>
          )}

          {/* Member Operations for Non-Members */}
          {user.role !== "MEMBER" && (
            <>
              <CommandSeparator className="my-1 bg-[#D3A753]/15" />
              <CommandGroup heading="Member Data">
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    router.push("/dashboard/register-interest")
                  }}
                  className="cursor-pointer"
                >
                  <ClipboardPen className="mr-2 size-4 text-[#D3A753]" />
                  <span>Register Interest Submissions</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    router.push("/dashboard/application-form")
                  }}
                  className="cursor-pointer"
                >
                  <FileText className="mr-2 size-4 text-[#D3A753]" />
                  <span>Application Forms</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    router.push("/dashboard/payment")
                  }}
                  className="cursor-pointer"
                >
                  <DollarSign className="mr-2 size-4 text-[#D3A753]" />
                  <span>Payments & Transactions</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    router.push("/dashboard/profiles")
                  }}
                  className="cursor-pointer"
                >
                  <Users2 className="mr-2 size-4 text-[#D3A753]" />
                  <span>Member Profiles Database</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator className="my-1 bg-[#D3A753]/15" />
              <CommandGroup heading="Matchmaking Operations">
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    router.push("/dashboard/matching")
                  }}
                  className="cursor-pointer"
                >
                  <HeartHandshake className="mr-2 size-4 text-[#CA617D]" />
                  <span>Matching Engine</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    router.push("/dashboard/tracking")
                  }}
                  className="cursor-pointer"
                >
                  <HeartPulse className="mr-2 size-4 text-[#CA617D]" />
                  <span>Match Tracking & Progress</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {/* Security & Access for Admin / Dev */}
          {(user.role === "ADMIN" || user.role === "DEV") && (
            <>
              <CommandSeparator className="my-1 bg-[#D3A753]/15" />
              <CommandGroup heading="Security & Access">
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    router.push("/dashboard/login-user")
                  }}
                  className="cursor-pointer"
                >
                  <UserKey className="mr-2 size-4 text-[#D3A753]" />
                  <span>Login User & Accounts</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {/* Account & Profile */}
          <CommandSeparator className="my-1 bg-[#D3A753]/15" />
          <CommandGroup heading="Account">
            <CommandItem
              onSelect={() => {
                setOpen(false)
                router.push("/dashboard/profile")
              }}
              className="cursor-pointer"
            >
              <User2 className="mr-2 size-4 text-[#D3A753]" />
              <span>My Profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                router.push("/dashboard/settings")
              }}
              className="cursor-pointer"
            >
              <Settings2 className="mr-2 size-4 text-[#D3A753]" />
              <span>Account Settings</span>
            </CommandItem>
          </CommandGroup>

          {/* Public Website Pages */}
          <CommandSeparator className="my-1 bg-[#D3A753]/15" />
          <CommandGroup heading="Website Pages">
            <CommandItem
              onSelect={() => {
                setOpen(false)
                router.push("/")
              }}
              className="cursor-pointer"
            >
              <Globe2 className="mr-2 size-4 text-[#D3A753]" />
              <span>Public Website Home</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                router.push("/service")
              }}
              className="cursor-pointer"
            >
              <Sparkles className="mr-2 size-4 text-[#D3A753]" />
              <span>How It Works / Matchmaking</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                router.push("/pricing")
              }}
              className="cursor-pointer"
            >
              <CreditCard className="mr-2 size-4 text-[#D3A753]" />
              <span>Membership Plans & Pricing</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                router.push("/contact")
              }}
              className="cursor-pointer"
            >
              <MessageCircle className="mr-2 size-4 text-[#D3A753]" />
              <span>Contact & Support</span>
            </CommandItem>
          </CommandGroup>

          {/* Actions & Utilities */}
          <CommandSeparator className="my-1 bg-[#D3A753]/15" />
          <CommandGroup heading="Actions & System">
            <CommandItem
              onSelect={() => {
                setTheme(theme === "dark" ? "light" : "dark")
                setOpen(false)
              }}
              className="cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="mr-2 size-4 text-amber-400" />
              ) : (
                <Moon className="mr-2 size-4 text-slate-700" />
              )}
              <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                handleLogout()
              }}
              className="cursor-pointer text-destructive data-selected:text-destructive"
            >
              <LogOut className="mr-2 size-4 text-destructive" />
              <span className="text-destructive">Log out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
