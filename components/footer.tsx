"use client"

import Link from "next/link"
import Image from "next/image"
import {
  FaFacebook,
  FaLine,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaPhoneAlt,
  FaTiktok,
} from "react-icons/fa"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { AppName } from "@/components/app-name"
import { APP_INFO, CONTACT } from "@/constants"

export function Footer() {
  const pathname = usePathname()

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* =========================
              BRAND
          ========================== */}
          <div className="flex justify-center lg:justify-start">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="flex flex-col items-center gap-2 text-center transition-opacity hover:opacity-90"
            >
              {/* Logo */}
              <Image
                src="/logo.png"
                alt={`${APP_INFO.name} logo`}
                width={80}
                height={80}
                className="size-14 shrink-0 object-contain sm:size-16"
              />

              {/* Brand */}
              <div className="flex min-w-0 flex-col items-center justify-center space-y-1">
                <AppName className="block text-lg leading-none font-black tracking-tight uppercase sm:text-xl" />

                <p className="inline-flex items-center justify-center gap-1.5 text-[9px] leading-none font-bold tracking-[0.25em] text-[#E791A7] uppercase sm:text-[10px]">
                  <span className="h-px w-3 bg-[#CA617D]/60" />
                  EXCLUSIVE
                  <span className="h-px w-3 bg-[#CA617D]/60" />
                </p>

                <p className="text-xs leading-none font-medium tracking-[0.08em] text-[#D3A753] sm:text-sm">
                  {APP_INFO.tagline}
                </p>
              </div>
            </Link>
          </div>

          {/* =========================
              CONTACT & SOCIAL (CENTERED)
          ========================== */}
          <div className="flex justify-center lg:justify-end">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              {/* Row 1: WhatsApp & Email (First) */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:border-[#25D366]/50 hover:bg-[#25D366]/10"
                >
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Contact us on WhatsApp"
                  >
                    <FaWhatsapp className="size-4 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:border-amber-500/50 hover:bg-amber-500/10"
                >
                  <a href={`mailto:${CONTACT.email}`} aria-label="Email">
                    <FaEnvelope className="size-4 text-[#D3A753]" />
                    <span>Email</span>
                  </a>
                </Button>
              </div>

              {/* Row 2: Phone Numbers (Middle) */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:border-[#0A84FF]/50 hover:bg-[#0A84FF]/10"
                >
                  <a href={`tel:${CONTACT.primaryPhone}`}>
                    <FaPhoneAlt className="size-3.5 text-[#0A84FF]" />
                    <span>{CONTACT.primaryPhone}</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:border-[#0A84FF]/50 hover:bg-[#0A84FF]/10"
                >
                  <a href={`tel:${CONTACT.secondaryPhone}`}>
                    <FaPhoneAlt className="size-3.5 text-[#0A84FF]" />
                    <span>{CONTACT.secondaryPhone}</span>
                  </a>
                </Button>
              </div>

              {/* Row 3: Social Media (Under) */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10"
                >
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Follow us on Facebook"
                  >
                    <FaFacebook className="size-4 text-[#1877F2]" />
                    <span>Facebook</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10"
                >
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Follow us on Instagram"
                  >
                    <FaInstagram className="size-4 text-[#E4405F]" />
                    <span>Instagram</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:border-foreground/50 hover:bg-foreground/10"
                >
                  <a
                    href={CONTACT.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Follow us on TikTok"
                  >
                    <FaTiktok className="size-4 text-foreground" />
                    <span>TikTok</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:border-[#00C300]/50 hover:bg-[#00C300]/10"
                >
                  <a
                    href={CONTACT.line}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Contact us on LINE"
                  >
                    <FaLine className="size-4 text-[#00C300]" />
                    <span>LINE</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            FOOTER BOTTOM
        ========================== */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border/70 pt-5 text-sm text-muted-foreground">
          {/* Legal */}
          <div className="flex items-center gap-4">
            <Link
              href="/terms-of-service"
              className="hover:text-foreground hover:underline hover:brightness-125"
            >
              Terms of Service
            </Link>

            <Link
              href="/privacy-policy"
              className="hover:text-foreground hover:underline hover:brightness-125"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p>
            Copyright &copy; {new Date().getFullYear()}{" "}
            <Link
              href="/"
              className="hover:text-foreground"
              onClick={handleHomeClick}
            >
              <AppName className="transition-all hover:underline hover:brightness-125" />
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
