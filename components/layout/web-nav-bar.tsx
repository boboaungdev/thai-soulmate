"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Menu, ArrowUpRight, ChevronDown, Crown, Venus } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { APP_INFO } from "@/constants"
import { ThemeToggle } from "@/components/theme-toggle"
// import { LanguageSwitcher } from "@/components/language-switcher"
import { AppName } from "@/components/app-name"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import { useAuthStore } from "@/features/auth"

import type { Variants } from "framer-motion"

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
    href: "#",
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
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [isClient, setIsClient] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const checkIsActive = (item: NavLinkItem) => {
    if (item.href !== "#" && pathname === item.href) {
      return true
    }
    if (item.subLinks && item.subLinks.length > 0) {
      return item.subLinks.some((sub) => {
        const [subPath] = sub.href.split("?")
        return pathname === subPath
      })
    }
    return false
  }

  const checkIsSubActive = (subHref: string) => {
    const [subPath, subQuery] = subHref.split("?")
    if (pathname !== subPath) return false
    const subTab = new URLSearchParams(subQuery).get("tab")
    const currentTab =
      searchParams.get("tab") || (pathname === "/pricing" ? "membership" : "")
    return subTab === currentTab
  }

  const navContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const navItemVariants: Variants = {
    hidden: { y: -15, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    if (href === "#") {
      e.preventDefault()
      return
    }
    const [targetPath, targetQuery] = href.split("?")
    const currentQuery = searchParams.toString()

    if (pathname === targetPath && (targetQuery || "") === currentQuery) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* Radiant Bottom Border Accent */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#D3A753]/35 to-transparent" />

      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 md:min-h-18 md:gap-3 md:py-0 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 sm:gap-3"
          onClick={(e) => handleNavClick(e, "/")}
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
              className="relative size-15 shrink-0 object-contain"
              priority
            />
          </motion.div>
          <div className="flex min-w-0 flex-col items-center justify-center space-y-0.5 text-center">
            <AppName className="block truncate text-lg font-black tracking-tight uppercase sm:text-lg" />

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

            <p className="truncate text-[9px] leading-tight font-medium tracking-[0.08em] text-[#D3A753] sm:text-[9px]">
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
            const active = checkIsActive(item)

            if (item.subLinks) {
              return (
                <motion.div
                  key={item.label}
                  variants={navItemVariants}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ y: -1.5, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      asChild
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-1 rounded-full px-3 font-medium transition-all duration-200",
                        active
                          ? "btn-gradient text-white shadow-md shadow-[#D3A753]/20"
                          : "hover:bg-[#D3A753]/10 hover:text-[#D3A753]"
                      )}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="size-3.5 opacity-70 transition-transform duration-300 group-hover:rotate-180" />
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Hover Sub-Nav Dropdown */}
                  <div className="pointer-events-none invisible absolute top-full left-1/2 z-50 -translate-x-1/2 translate-y-1.5 pt-2 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="min-w-[210px] rounded-2xl border border-[#D3A753]/35 bg-background/95 p-2 shadow-2xl shadow-[#D3A753]/15 backdrop-blur-xl">
                      {item.subLinks.map((subItem) => {
                        const Icon = subItem.icon
                        const isSubActive = checkIsSubActive(subItem.href)
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={(e) => handleNavClick(e, subItem.href)}
                            className={cn(
                              "group/item flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:translate-x-1",
                              isSubActive
                                ? "bg-[#D3A753]/15 font-semibold text-[#D3A753]"
                                : "text-foreground hover:bg-[#D3A753]/10 hover:text-[#D3A753]"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon
                                className={cn(
                                  "size-4 shrink-0 transition-transform duration-200 group-hover/item:scale-110",
                                  isSubActive
                                    ? "text-[#D3A753]"
                                    : subItem.iconColor
                                )}
                              />
                              <span>{subItem.label}</span>
                            </div>
                            {isSubActive && (
                              <span className="size-1.5 rounded-full bg-[#D3A753]" />
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )
            }

            return (
              <motion.div key={item.href} variants={navItemVariants}>
                <motion.div
                  whileHover={{ y: -1.5, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    asChild
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "rounded-full px-3 font-medium transition-all duration-200",
                      active
                        ? "btn-gradient text-white shadow-md shadow-[#D3A753]/20"
                        : "hover:bg-[#D3A753]/10 hover:text-[#D3A753]"
                    )}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.label}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {/* <LanguageSwitcher /> */}
          {!isClient ? (
            <div className="hidden h-10 w-[100px] items-center justify-center lg:flex" />
          ) : user ? (
            <motion.div
              className="hidden items-center gap-2 lg:flex"
              variants={navItemVariants}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <Button
                asChild
                className="btn-gradient rounded-md font-medium shadow-md shadow-[#D3A753]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#D3A753]/30"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="hidden items-center gap-2 lg:flex"
              variants={navItemVariants}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <Button
                asChild
                className="btn-gradient rounded-md font-medium shadow-md shadow-[#D3A753]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#D3A753]/30"
              >
                <Link href="/auth">Login</Link>
              </Button>
            </motion.div>
          )}

          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="rounded-full border-border/80 transition-colors hover:border-[#D3A753]/50 hover:bg-[#D3A753]/10"
                  >
                    <Menu className="size-4 text-foreground" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-3/4 flex-col overflow-hidden border-l border-border/70 bg-background/95 backdrop-blur-xl sm:max-w-sm"
              >
                {/* Atmospheric Ambient Glow Orb inside sheet */}
                <motion.div
                  animate={{
                    scale: [0.95, 1.1, 0.95],
                    opacity: [0.15, 0.28, 0.15],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute -top-20 -right-20 -z-10 size-56 rounded-full bg-gradient-to-b from-[#D3A753] via-[#E791A7] to-transparent blur-3xl"
                />
                <div className="pointer-events-none absolute -bottom-20 -left-20 -z-10 size-48 rounded-full bg-gradient-to-tr from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />

                <SheetHeader className="border-b border-border/40 p-4 pb-3">
                  <Link
                    href="/"
                    onClick={(e) => {
                      handleNavClick(e, "/")
                      setMobileOpen(false)
                    }}
                    className="group flex items-center gap-2.5"
                  >
                    <Image
                      src="/logo.png"
                      alt={`${APP_INFO.name} logo`}
                      width={48}
                      height={48}
                      className="size-9 shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="flex min-w-0 flex-col items-center justify-center space-y-0.5 text-center">
                      <AppName className="block truncate text-sm font-black tracking-tight uppercase" />
                      <p className="inline-flex items-center justify-center gap-1 text-[8px] leading-tight font-bold tracking-[0.25em] text-[#E791A7] uppercase">
                        <span className="h-px w-2.5 bg-[#CA617D]/60" />
                        EXCLUSIVE
                        <span className="h-px w-2.5 bg-[#CA617D]/60" />
                      </p>
                      <p className="truncate text-[9px] leading-tight font-medium tracking-[0.08em] text-[#D3A753]">
                        {APP_INFO.tagline}
                      </p>
                    </div>
                  </Link>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-4">
                  <div className="flex flex-col gap-1.5">
                    {SITE_NAV_LINKS.map((item) => {
                      const isActive = checkIsActive(item)
                      if (item.subLinks) {
                        return (
                          <div
                            key={item.label}
                            className="flex flex-col space-y-1"
                          >
                            <motion.div whileTap={{ scale: 0.98 }}>
                              <Link
                                href={item.href}
                                onClick={(e) => {
                                  handleNavClick(e, item.href)
                                  if (item.href !== "#") {
                                    setMobileOpen(false)
                                  }
                                }}
                                className={cn(
                                  "flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                                  isActive
                                    ? "bg-[#D3A753]/15 font-semibold text-[#D3A753]"
                                    : "text-foreground/90 hover:bg-muted/70 hover:text-foreground"
                                )}
                              >
                                <span>{item.label}</span>
                                <ArrowUpRight className="size-4 opacity-70" />
                              </Link>
                            </motion.div>
                            <div className="ml-3 flex flex-col space-y-1 border-l border-[#D3A753]/30 pl-3">
                              {item.subLinks.map((subItem) => {
                                const Icon = subItem.icon
                                const isSubActive = checkIsSubActive(
                                  subItem.href
                                )
                                return (
                                  <motion.div
                                    key={subItem.href}
                                    whileTap={{ scale: 0.97 }}
                                  >
                                    <Link
                                      href={subItem.href}
                                      onClick={(e) => {
                                        handleNavClick(e, subItem.href)
                                        setMobileOpen(false)
                                      }}
                                      className={cn(
                                        "flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200",
                                        isSubActive
                                          ? "bg-[#D3A753]/15 font-semibold text-[#D3A753]"
                                          : "text-muted-foreground hover:bg-[#D3A753]/10 hover:text-[#D3A753]"
                                      )}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <Icon
                                          className={cn(
                                            "size-3.5 shrink-0",
                                            isSubActive
                                              ? "text-[#D3A753]"
                                              : subItem.iconColor
                                          )}
                                        />
                                        <span>{subItem.label}</span>
                                      </div>
                                      {isSubActive && (
                                        <span className="size-1.5 rounded-full bg-[#D3A753]" />
                                      )}
                                    </Link>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      }

                      return (
                        <motion.div key={item.href} whileTap={{ scale: 0.98 }}>
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              handleNavClick(e, item.href)
                              setMobileOpen(false)
                            }}
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                              isActive
                                ? "bg-[#D3A753]/15 font-semibold text-[#D3A753]"
                                : "text-foreground/90 hover:bg-muted/70 hover:text-foreground"
                            )}
                          >
                            <span>{item.label}</span>
                            <ArrowUpRight className="size-4 opacity-70" />
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Bottom Action inside Drawer */}
                  <div className="mt-4 space-y-3 border-t border-border/40 pt-6">
                    {isClient &&
                      (user ? (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Link
                            href="/dashboard"
                            onClick={() => setMobileOpen(false)}
                            className="btn-gradient flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 font-semibold text-white shadow-lg transition-all"
                          >
                            <span>Dashboard</span>
                            <ArrowUpRight className="size-4" />
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Link
                            href="/auth"
                            onClick={() => setMobileOpen(false)}
                            className="btn-gradient flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 font-semibold text-white shadow-lg transition-all"
                          >
                            <span>Login / Member Access</span>
                            <ArrowUpRight className="size-4" />
                          </Link>
                        </motion.div>
                      ))}
                    <p className="text-center text-[10px] tracking-wider text-muted-foreground uppercase">
                      {APP_INFO.tagline} · Thailand
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
