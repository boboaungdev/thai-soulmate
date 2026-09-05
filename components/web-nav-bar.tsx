"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Menu, ArrowUpRight, ChevronDown, Crown, Venus } from "lucide-react"
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
// import { LanguageSwitcher } from "@/components/language-switcher"
import { AppName } from "@/components/app-name"
import { cn } from "@/lib/utils"
import { MotionDiv } from "./motion"
import { useEffect, useState } from "react"

import { useAuthStore } from "@/stores/auth-store"

interface SubNavLink {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
}

interface NavLinkItem {
  label: string
  href: string
  subLinks?: SubNavLink[]
}

const SITE_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/service" },
  { label: "Meet Our Members", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  {
    label: "Pricing",
    href: "/pricing",
    subLinks: [
      {
        label: "Male Membership",
        href: "/pricing?tab=membership",
        icon: Crown,
        iconColor: "text-[#D3A753]",
      },
      {
        label: "Female VIP",
        href: "/pricing?tab=vip",
        icon: Venus,
        iconColor: "text-[#CA617D]",
      },
    ],
  },
  { label: "Contact", href: "/contact" },
]

export function WebNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()
  const [isClient, setIsClient] = useState(false)

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
    setIsClient(true)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    const [targetPath, targetQuery] = href.split("?")
    const currentQuery =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : ""

    if (pathname === targetPath && (targetQuery || "") === currentQuery) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      router.push(href)
    }
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
            className="size-10 shrink-0 object-contain sm:size-11"
            priority
          />
          <div className="flex min-w-0 flex-col items-center justify-center space-y-0.5 text-center">
            <AppName className="block truncate text-base font-black tracking-tight uppercase sm:text-lg" />

            <p className="inline-flex items-center justify-center gap-1.5 text-[9px] leading-tight font-bold tracking-[0.25em] text-[#E791A7] uppercase sm:text-[10px]">
              <span className="h-px w-3 bg-[#CA617D]/60" />
              EXCLUSIVE
              <span className="h-px w-3 bg-[#CA617D]/60" />
            </p>

            <p className="truncate text-[10px] leading-tight font-medium tracking-[0.08em] text-[#D3A753] sm:text-xs">
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
          {SITE_NAV_LINKS.map((item) => {
            const active = pathname === item.href

            if (item.subLinks) {
              return (
                <MotionDiv
                  key={item.href}
                  variants={navItemVariants}
                  className="group relative"
                >
                  <Button
                    asChild
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-1 rounded-full px-3 font-medium transition-all",
                      active && "btn-gradient text-white"
                    )}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="size-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
                    </Link>
                  </Button>

                  {/* Hover Sub-Nav Dropdown */}
                  <div className="pointer-events-none invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[195px] rounded-xl border border-border/80 bg-background/95 p-1.5 shadow-xl backdrop-blur-md">
                      {item.subLinks.map((subItem) => {
                        const Icon = subItem.icon
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={(e) => handleNavClick(e, subItem.href)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                          >
                            <Icon
                              className={cn(
                                "size-4 shrink-0",
                                subItem.iconColor
                              )}
                            />
                            <span>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </MotionDiv>
              )
            }

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
          {/* <LanguageSwitcher /> */}
          {!isClient ? (
            <div className="hidden h-10 w-[100px] items-center justify-center lg:flex" />
          ) : user ? (
            <MotionDiv
              className="hidden items-center gap-2 lg:flex"
              variants={navItemVariants}
            >
              <Button asChild className="btn-gradient rounded-md font-medium">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </MotionDiv>
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
                  {SITE_NAV_LINKS.map((item) => {
                    if (item.subLinks) {
                      return (
                        <div
                          key={item.href}
                          className="flex flex-col space-y-1"
                        >
                          <SheetClose asChild>
                            <a
                              onClick={(e) => handleNavClick(e, item.href)}
                              className="flex cursor-pointer items-center justify-between px-3 py-2.5 font-medium"
                            >
                              <span>{item.label}</span>
                              <ArrowUpRight className="size-4 text-muted-foreground" />
                            </a>
                          </SheetClose>
                          <div className="ml-3 flex flex-col space-y-1 border-l-2 border-border/60 pl-3">
                            {item.subLinks.map((subItem) => {
                              const Icon = subItem.icon
                              return (
                                <SheetClose asChild key={subItem.href}>
                                  <a
                                    onClick={(e) =>
                                      handleNavClick(e, subItem.href)
                                    }
                                    className="flex cursor-pointer items-center gap-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                  >
                                    <Icon
                                      className={cn(
                                        "size-3.5 shrink-0",
                                        subItem.iconColor
                                      )}
                                    />
                                    <span>{subItem.label}</span>
                                  </a>
                                </SheetClose>
                              )
                            })}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <SheetClose asChild key={item.href}>
                        <a
                          onClick={(e) => handleNavClick(e, item.href)}
                          className="flex cursor-pointer items-center justify-between px-3 py-2.5"
                        >
                          <span>{item.label}</span>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </a>
                      </SheetClose>
                    )
                  })}
                  {isClient && (
                    <SheetClose asChild>
                      {user ? (
                        <Link
                          href="/dashboard"
                          className="btn-gradient flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-white"
                        >
                          <span>Dashboard</span>
                          <ArrowUpRight className="size-4" />
                        </Link>
                      ) : (
                        <Link
                          href="/auth"
                          className="btn-gradient flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-white"
                        >
                          <span>Login</span>
                          <ArrowUpRight className="size-4" />
                        </Link>
                      )}
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
