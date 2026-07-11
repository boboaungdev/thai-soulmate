"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Menu, ArrowUpRight } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { APP_INFO } from "@/constants"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AppName } from "@/components/app-name"
import { cn } from "@/lib/utils"
import { MotionDiv } from "./motion"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"

const SITE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/service" },
  { label: "Gallery", href: "/gallery" },
] as const

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  // Use undefined for initial state to represent "not yet loaded"
  const [user, setUser] = useState<
    { name?: string; email?: string } | null | undefined
  >(undefined)

  const navContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const navItemVariants = {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error)
        localStorage.removeItem("user") // Clear corrupted data
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [pathname])

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else router.push(href)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 md:min-h-18 md:gap-3 md:py-0 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 sm:gap-3"
          onClick={(e) => handleNavClick(e, "/")}
        >
          <Image
            src="/logo.png"
            alt={`${APP_INFO.name} logo`}
            width={72}
            height={72}
            className="size-10 shrink-0 rounded-2xl object-cover sm:size-11"
            priority
          />
          <div className="min-w-0">
            <AppName className="truncate text-base font-semibold sm:text-lg" />
            <p className="truncate text-xs text-muted-foreground">
              {APP_INFO.tagline}
            </p>
          </div>
        </Link>

        <motion.nav
          className="ml-2 hidden flex-1 items-center justify-center gap-1 lg:flex"
          variants={navContainerVariants}
          initial="hidden"
          animate="show"
        >
          {!user &&
            SITE_NAV_LINKS.map((item) => {
              const active = pathname === item.href

              return (
                <MotionDiv key={item.href} variants={navItemVariants}>
                  <Button
                    asChild
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "rounded-full px-3 font-medium transition-all",
                      active && "btn-gradient text-white"
                    )}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.label}
                    </Link>
                  </Button>
                </MotionDiv>
              )
            })}
        </motion.nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          {user === undefined ? ( // Loading state
            <div className="hidden h-10 w-[70px] items-center justify-center lg:flex" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MotionDiv variants={navItemVariants}>
                  <Avatar size="lg" className="cursor-pointer">
                    <AvatarFallback className="bg-gradient-to-r from-[#cfa14f] to-[#cb5d7a] text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </MotionDiv>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("user")
                    setUser(null)
                    router.push("/auth")
                  }}
                  variant="destructive"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <MotionDiv
              className="hidden items-center gap-2 lg:flex"
              variants={navItemVariants}
            >
              <Button asChild className="btn-gradient rounded-md font-medium">
                <Link href="/auth">Login</Link>
              </Button>
            </MotionDiv>
          )}

          {user === null && (
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="rounded-full"
                  >
                    <Menu className="size-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="flex w-3/4 flex-col sm:max-w-sm"
                >
                  <SheetHeader className="p-4 pb-2">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 px-4">
                    {SITE_NAV_LINKS.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <a
                          onClick={(e) => handleNavClick(e, item.href)}
                          className="flex cursor-pointer items-center justify-between px-3 py-2.5"
                        >
                          <span>{item.label}</span>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </a>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link
                        href="/auth"
                        className="btn-gradient flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-white"
                      >
                        <span>Login</span>
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
