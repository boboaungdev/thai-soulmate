"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { APP_NAME, APP_TAGLINE } from "@/constants"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AppName } from "@/components/app-name"
import { cn } from "@/lib/utils"

const SITE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/service" },
  { label: "Gallery", href: "/gallery" },
] as const

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 md:min-h-18 md:gap-3 md:py-0 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/logo.png"
            alt={`${APP_NAME} logo`}
            width={72}
            height={72}
            className="size-10 shrink-0 rounded-2xl bg-background object-cover shadow-sm sm:size-11"
            priority
          />
          <div className="min-w-0">
            <AppName className="truncate text-base font-semibold sm:text-lg" />
            <p className="truncate text-xs text-muted-foreground">
              {APP_TAGLINE}
            </p>
          </div>
        </Link>

        <nav className="ml-2 hidden flex-1 items-center justify-center gap-1 lg:flex">
          {SITE_NAV_LINKS.map((item) => {
            const active = pathname === item.href

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "relative rounded-full px-3 transition-all",
                  active &&
                    "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-[#cfa14f] after:to-[#cb5d7a]"
                )}
                style={active ? { color: "#cfa14f" } : {}}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <div className="hidden items-center gap-2 lg:flex">
            <Button className="rounded-md bg-gradient-to-r from-[#cfa14f] to-[#cb5d7a] font-medium text-white transition-opacity hover:opacity-90">
              Login
            </Button>
          </div>

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
                      <div
                        onClick={() => router.push(item.href)}
                        className="flex cursor-pointer items-center justify-between px-3 py-2.5"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="size-4 text-muted-foreground" />
                      </div>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <div
                      onClick={() => router.push("")}
                      className="btn-gradient flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-white"
                    >
                      <span>Login</span>
                      <ArrowUpRight className="size-4" />
                    </div>
                  </SheetClose>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" className="mt-auto p-4" size="sm">
                    Close Menu
                  </Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
