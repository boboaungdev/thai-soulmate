"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaFacebookF,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"
import {
  Mail,
  Phone,
  Sparkles,
  Send,
  MessageSquare,
  ArrowUpRight,
  Share2,
} from "lucide-react"
import { CONTACT } from "@/constants"
import { ContactForm } from "@/features/contact"

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Background Subtle Radial Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[650px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 size-[500px] rounded-full bg-gradient-to-br from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* 1. HEADER */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
            <Sparkles className="size-3.5" />
            <span>Direct Concierge Support</span>
          </div>

          <h1 className="text-gradient text-4xl font-bold tracking-tight md:text-5xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            We&apos;d love to hear from you! Reach out to us through any of the
            channels below, or send us a message using the form.
          </p>
        </motion.div>

        {/* ========================================================= */}
        {/* 2. MAIN GRID: CONTACT CARDS & FORM */}
        {/* ========================================================= */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ----------------------------------------------------- */}
          {/* LEFT: CONTACT CHANNELS (5 cols) */}
          {/* ----------------------------------------------------- */}
          <div className="space-y-5 lg:col-span-5">
            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, x: -35, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.25 } }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/10">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753] transition-transform duration-300 hover:scale-110">
                    <Mail className="size-5 text-[#D3A753]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-foreground">
                      Email Inquiries
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Direct correspondence with our team
                    </p>
                    <Link
                      href={`mailto:${CONTACT.email}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-[#D3A753] hover:underline"
                    >
                      <span className="truncate">{CONTACT.email}</span>
                      <ArrowUpRight className="size-3.5 shrink-0 opacity-70" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Phone & Consultation Line Card */}
            <motion.div
              initial={{ opacity: 0, x: -35, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.25 } }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/10">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753] transition-transform duration-300 hover:scale-110">
                    <Phone className="size-5 text-[#D3A753]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-foreground">
                      Phone
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Matchmaking telephone concierge
                    </p>
                    <div className="mt-3 space-y-1.5">
                      <div>
                        <Link
                          href={`tel:${CONTACT.primaryPhone.replace(/\D/g, "")}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-[#D3A753] hover:underline"
                        >
                          <span>{CONTACT.primaryPhone}</span>
                          <ArrowUpRight className="size-3.5 opacity-70" />
                        </Link>
                      </div>
                      <div>
                        <Link
                          href={`tel:${CONTACT.secondaryPhone.replace(/\D/g, "")}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-[#D3A753] hover:underline"
                        >
                          <span>{CONTACT.secondaryPhone}</span>
                          <ArrowUpRight className="size-3.5 opacity-70" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Instant Messaging Card (WhatsApp & LINE) */}
            <motion.div
              initial={{ opacity: 0, x: -35, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.25 } }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/10">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753] transition-transform duration-300 hover:scale-110">
                    <MessageSquare className="size-5 text-[#CA617D]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-foreground">
                      Instant Messaging
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Chat directly with our team on WhatsApp or LINE
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {/* WhatsApp */}
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Link
                          href={`${CONTACT.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground backdrop-blur-sm transition-all hover:border-[#25D366]/60 hover:bg-card hover:shadow-md hover:shadow-[#25D366]/15"
                        >
                          <FaWhatsapp className="size-4 text-[#25D366]" />
                          <span>WhatsApp</span>
                        </Link>
                      </motion.div>

                      {/* LINE */}
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Link
                          href={CONTACT.line}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground backdrop-blur-sm transition-all hover:border-[#00C300]/60 hover:bg-card hover:shadow-md hover:shadow-[#00C300]/15"
                        >
                          <FaLine className="size-4 text-[#00C300]" />
                          <span>LINE</span>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Media Card (Instagram, Facebook, TikTok) */}
            <motion.div
              initial={{ opacity: 0, x: -35, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.25 } }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/10">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753] transition-transform duration-300 hover:scale-110">
                    <Share2 className="size-5 text-[#D3A753]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-foreground">
                      Social Media
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Follow our official channels and updates
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {/* Instagram */}
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Link
                          href={CONTACT.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground backdrop-blur-sm transition-all hover:border-[#E4405F]/60 hover:bg-card hover:shadow-md hover:shadow-[#E4405F]/15"
                        >
                          <FaInstagram className="size-4 text-[#E4405F]" />
                          <span>Instagram</span>
                        </Link>
                      </motion.div>

                      {/* Facebook */}
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Link
                          href={CONTACT.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground backdrop-blur-sm transition-all hover:border-[#1877F2]/60 hover:bg-card hover:shadow-md hover:shadow-[#1877F2]/15"
                        >
                          <FaFacebookF className="size-4 text-[#1877F2]" />
                          <span>Facebook</span>
                        </Link>
                      </motion.div>

                      {/* TikTok */}
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Link
                          href={CONTACT.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground backdrop-blur-sm transition-all hover:border-foreground/50 hover:bg-card hover:shadow-md hover:shadow-foreground/15"
                        >
                          <FaTiktok className="size-4 text-foreground" />
                          <span>TikTok</span>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ----------------------------------------------------- */}
          {/* RIGHT: CONTACT FORM (7 cols) */}
          {/* ----------------------------------------------------- */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 35, scale: 0.97, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/85 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-[#D3A753]/50 sm:p-8 md:p-10">
                {/* Subtle decorative glow in top corner */}
                <motion.div
                  animate={{
                    scale: [0.95, 1.15, 0.95],
                    opacity: [0.2, 0.35, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/15 to-transparent blur-3xl"
                />

                <div className="relative mb-6">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#D3A753] uppercase">
                    <Send className="size-3" />
                    <span>Get in Touch</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Send us a Message
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    Have a question or request? Fill in your details below and
                    our concierge team will respond promptly.
                  </p>
                </div>

                <ContactForm />

                <p className="mt-5 text-center text-xs text-muted-foreground">
                  100% confidential • Your personal details are strictly
                  protected
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
