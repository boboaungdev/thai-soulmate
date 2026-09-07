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
import { ShieldCheck, MessageCircle, PhoneCall, Share2 } from "lucide-react"
import { usePathname } from "next/navigation"

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
        {/* ONE ROW OF 4 LUXURY CARDS */}
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {/* CARD 1: BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/40 hover:bg-card/80 hover:shadow-lg"
          >
            <div className="space-y-3">
              <Link
                href="/"
                onClick={handleHomeClick}
                className="group flex flex-col items-center justify-center gap-2.5 text-center transition-opacity"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ duration: 0.25 }}
                  className="relative"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-[#D3A753]/20 blur-xl transition-opacity group-hover:opacity-100" />
                  <Image
                    src="/logo.png"
                    alt={`${APP_INFO.name} logo`}
                    width={56}
                    height={56}
                    className="relative size-12 shrink-0 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                  />
                </motion.div>

                <div className="flex flex-col items-center justify-center space-y-1.5">
                  <AppName className="block text-base leading-tight font-black tracking-tight uppercase" />
                  <p className="inline-flex items-center justify-center gap-1.5 text-[9px] font-bold tracking-[0.25em] text-[#E791A7] uppercase sm:text-[10px]">
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
                  <p className="text-xs font-medium tracking-[0.08em] text-[#D3A753]">
                    {APP_INFO.tagline}
                  </p>
                </div>
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-[#CA617D]" />
              <span>100% Confidential Service</span>
            </div>
          </motion.div>

          {/* CARD 2: DIRECT MESSAGING */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/40 hover:bg-card/80 hover:shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#D3A753]/15 text-[#D3A753]">
                  <MessageCircle className="size-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-[#D3A753] uppercase">
                    Direct Messaging
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Instant Confidential Chat
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Contact us on WhatsApp"
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-[#25D366]/60 hover:bg-[#25D366]/10"
                >
                  <FaWhatsapp className="size-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={CONTACT.line}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Contact us on LINE"
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-[#00C300]/60 hover:bg-[#00C300]/10"
                >
                  <FaLine className="size-4 text-[#00C300]" />
                  <span>LINE</span>
                </a>

                <a
                  href={`mailto:${CONTACT.email}`}
                  aria-label="Email"
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-amber-500/60 hover:bg-amber-500/10"
                >
                  <FaEnvelope className="size-4 text-[#D3A753]" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: DIRECT PHONE */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.19 }}
            className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/40 hover:bg-card/80 hover:shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#0A84FF]/15 text-[#0A84FF]">
                  <PhoneCall className="size-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-[#D3A753] uppercase">
                    Phone Concierge
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Direct Voice Inquiries
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${CONTACT.primaryPhone}`}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-[#0A84FF]/60 hover:bg-[#0A84FF]/10"
                >
                  <FaPhoneAlt className="size-3 text-[#0A84FF]" />
                  <span className="font-mono">{CONTACT.primaryPhone}</span>
                </a>

                <a
                  href={`tel:${CONTACT.secondaryPhone}`}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-[#0A84FF]/60 hover:bg-[#0A84FF]/10"
                >
                  <FaPhoneAlt className="size-3 text-[#0A84FF]" />
                  <span className="font-mono">{CONTACT.secondaryPhone}</span>
                </a>
              </div>
            </div>

            <p className="mt-4 border-t border-border/40 pt-3 text-center text-[11px] text-muted-foreground sm:text-left">
              Mon – Fri: 10:00 – 20:00 (ICT)
            </p>
          </motion.div>

          {/* CARD 4: SOCIAL CHANNELS */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/40 hover:bg-card/80 hover:shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#E791A7]/15 text-[#CA617D]">
                  <Share2 className="size-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-[#D3A753] uppercase">
                    Social Media
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Follow Our Community
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow us on Facebook"
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10"
                >
                  <FaFacebook className="size-4 text-[#1877F2]" />
                  <span>Facebook</span>
                </a>

                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow us on Instagram"
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-[#E4405F]/60 hover:bg-[#E4405F]/10"
                >
                  <FaInstagram className="size-4 text-[#E4405F]" />
                  <span>Instagram</span>
                </a>

                <a
                  href={CONTACT.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow us on TikTok"
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-foreground/60 hover:bg-foreground/10"
                >
                  <FaTiktok className="size-4 text-foreground" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FOOTER BOTTOM */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row"
        >
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

          {/* Legal */}
          <div className="flex items-center gap-4">
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-foreground hover:underline hover:brightness-125"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-foreground hover:underline hover:brightness-125"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
