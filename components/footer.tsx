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
            <div className="flex flex-col items-center gap-3 text-center">
              {/* Logo */}
              <Image
                src="/logo.png"
                alt={`${APP_INFO.name} logo`}
                width={72}
                height={72}
                className="size-14 shrink-0 rounded-2xl object-cover"
              />

              {/* Brand */}
              <div className="min-w-0">
                <AppName className="text-base font-semibold" />

                <p className="text-sm font-semibold text-[#CA617D]">
                  Exclusive
                </p>

                <p className="text-sm text-[#D3A753]">{APP_INFO.tagline}</p>

                {/* <p className="text-gradient mt-2 text-sm whitespace-pre-line">
                  {APP_INFO.secondaryTagline}
                </p> */}
              </div>
            </div>
          </div>

          {/* =========================
              CONTACT / SOCIAL
          ========================== */}
          <div className="flex justify-center lg:justify-end">
            <div className="flex flex-col items-center gap-2 lg:items-end">
              {/* =================================================
                  MOBILE — SOCIAL / CONTACT ICONS
                  One centered row
              ================================================== */}
              <div className="flex flex-wrap justify-center gap-2 lg:hidden">
                {/* WhatsApp */}
                <Button
                  asChild
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="size-4 text-[#25D366]" />
                  </a>
                </Button>

                {/* Email */}
                <Button
                  asChild
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <a href={`mailto:${CONTACT.email}`} aria-label="Email">
                    <FaEnvelope className="size-4" />
                  </a>
                </Button>

                {/* Facebook */}
                <Button
                  asChild
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="size-4 text-[#1877F2]" />
                  </a>
                </Button>

                {/* Instagram */}
                <Button
                  asChild
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="size-4 text-[#E4405F]" />
                  </a>
                </Button>

                {/* TikTok */}
                <Button
                  asChild
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <a
                    href={CONTACT.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                  >
                    <FaTiktok className="size-4 text-foreground" />
                  </a>
                </Button>

                {/* LINE */}
                <Button
                  asChild
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <a
                    href={CONTACT.line}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LINE"
                  >
                    <FaLine className="size-4 text-[#00C300]" />
                  </a>
                </Button>
              </div>

              {/* =================================================
                  MOBILE — PHONE NUMBERS
                  One centered row
              ================================================== */}
              <div className="flex flex-wrap justify-center gap-2 lg:hidden">
                {/* Primary Phone */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <a href={`tel:${CONTACT.primaryPhone}`}>
                    <FaPhoneAlt className="size-4 text-[#0A84FF]" />
                    <span>{CONTACT.primaryPhone}</span>
                  </a>
                </Button>

                {/* Secondary Phone */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <a href={`tel:${CONTACT.secondaryPhone}`}>
                    <FaPhoneAlt className="size-4 text-[#0A84FF]" />
                    <span>{CONTACT.secondaryPhone}</span>
                  </a>
                </Button>
              </div>

              {/* =================================================
                  DESKTOP — WHATSAPP + EMAIL
              ================================================== */}
              <div className="hidden flex-wrap justify-end gap-2 lg:flex">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
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
                  className="rounded-full"
                >
                  <a href={`mailto:${CONTACT.email}`} aria-label="Email">
                    <FaEnvelope className="size-4" />
                    <span>Email</span>
                  </a>
                </Button>
              </div>

              {/* =================================================
                  DESKTOP — SOCIAL MEDIA
              ================================================== */}
              <div className="hidden flex-wrap justify-end gap-2 lg:flex">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
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
                  className="rounded-full"
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
                  className="rounded-full"
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
                  className="rounded-full"
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

              {/* =================================================
                  DESKTOP — PHONE NUMBERS
              ================================================== */}
              <div className="hidden flex-wrap justify-end gap-2 lg:flex">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <a href={`tel:${CONTACT.primaryPhone}`}>
                    <FaPhoneAlt className="size-4 text-[#0A84FF]" />
                    <span>{CONTACT.primaryPhone}</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <a href={`tel:${CONTACT.secondaryPhone}`}>
                    <FaPhoneAlt className="size-4 text-[#0A84FF]" />
                    <span>{CONTACT.secondaryPhone}</span>
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
