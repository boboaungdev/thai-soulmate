"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
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
    <footer className="relative overflow-hidden border-t border-border/70 bg-background">
      {/* Ambient Atmospheric Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/12 via-[#E791A7]/6 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 -bottom-24 -z-10 h-72 w-96 rounded-full bg-gradient-to-t from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />

      {/* Radiant Top Border Highlight */}
      <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#D3A753]/40 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* =========================
              BRAND
          ========================== */}
          <motion.div
            initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-start"
          >
            <Link
              href="/"
              onClick={handleHomeClick}
              className="group flex flex-col items-center gap-2 text-center transition-opacity"
            >
              {/* Logo with gentle floating & hover tilt */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[#D3A753]/20 blur-xl transition-opacity group-hover:opacity-100" />
                <Image
                  src="/logo.png"
                  alt={`${APP_INFO.name} logo`}
                  width={80}
                  height={80}
                  className="relative size-14 shrink-0 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] sm:size-16"
                />
              </motion.div>

              {/* Brand */}
              <div className="flex min-w-0 flex-col items-center justify-center space-y-1">
                <AppName className="block text-lg leading-none font-black tracking-tight uppercase sm:text-lg" />

                <p className="inline-flex items-center justify-center gap-1.5 text-[9px] leading-none font-bold tracking-[0.25em] text-[#E791A7] uppercase sm:text-[10px]">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: 12 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-px bg-[#CA617D]/60"
                  />
                  EXCLUSIVE
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: 12 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-px bg-[#CA617D]/60"
                  />
                </p>

                <p className="text-xs leading-none font-medium tracking-[0.08em] text-[#D3A753] sm:text-sm">
                  {APP_INFO.tagline}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* =========================
              CONTACT & SOCIAL (CENTERED)
          ========================== */}
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              {/* Row 1: WhatsApp, LINE & Email (First) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="flex flex-wrap items-center justify-center gap-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs transition-all duration-200 hover:border-[#25D366]/60 hover:bg-[#25D366]/10 hover:shadow-md hover:shadow-[#25D366]/15"
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
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs transition-all duration-200 hover:border-[#00C300]/60 hover:bg-[#00C300]/10 hover:shadow-md hover:shadow-[#00C300]/15"
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
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs transition-all duration-200 hover:border-amber-500/60 hover:bg-amber-500/10 hover:shadow-md hover:shadow-amber-500/15"
                  >
                    <a href={`mailto:${CONTACT.email}`} aria-label="Email">
                      <FaEnvelope className="size-4 text-[#D3A753]" />
                      <span>Email</span>
                    </a>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Row 2: Phone Numbers (Middle) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.25 }}
                className="flex flex-wrap items-center justify-center gap-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs transition-all duration-200 hover:border-[#0A84FF]/60 hover:bg-[#0A84FF]/10 hover:shadow-md hover:shadow-[#0A84FF]/15"
                  >
                    <a href={`tel:${CONTACT.primaryPhone}`}>
                      <FaPhoneAlt className="size-3.5 text-[#0A84FF]" />
                      <span>{CONTACT.primaryPhone}</span>
                    </a>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs transition-all duration-200 hover:border-[#0A84FF]/60 hover:bg-[#0A84FF]/10 hover:shadow-md hover:shadow-[#0A84FF]/15"
                  >
                    <a href={`tel:${CONTACT.secondaryPhone}`}>
                      <FaPhoneAlt className="size-3.5 text-[#0A84FF]" />
                      <span>{CONTACT.secondaryPhone}</span>
                    </a>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Row 3: Social Media (Under) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.35 }}
                className="flex flex-wrap items-center justify-center gap-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs transition-all duration-200 hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 hover:shadow-md hover:shadow-[#1877F2]/15"
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
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs transition-all duration-200 hover:border-[#E4405F]/60 hover:bg-[#E4405F]/10 hover:shadow-md hover:shadow-[#E4405F]/15"
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
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs transition-all duration-200 hover:border-foreground/60 hover:bg-foreground/10 hover:shadow-md hover:shadow-foreground/15"
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
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* =========================
            FOOTER BOTTOM
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4 border-t border-border/70 pt-5 text-sm text-muted-foreground"
        >
          {/* Legal */}
          <div className="flex items-center gap-4">
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-foreground hover:underline hover:brightness-125"
            >
              Terms of Service
            </Link>

            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-foreground hover:underline hover:brightness-125"
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
        </motion.div>
      </div>
    </footer>
  )
}
