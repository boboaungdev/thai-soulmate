"use client"

import Link from "next/link"
import { ChevronLeft, ShieldCheck, Mail } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

type PolicyContent = {
  heading: string
  text: React.ReactNode
}

type PolicyPageProps = {
  title: string
  content: PolicyContent[]
}

export function PolicyPage({ title, content }: PolicyPageProps) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background">
      {/* Unified Atmospheric Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(207,161,79,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 size-[550px] rounded-full bg-gradient-to-br from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-40 -z-10 size-[500px] rounded-full bg-gradient-to-tr from-[#D3A753]/10 via-[#E791A7]/5 to-transparent blur-3xl" />

      <section className="border-b border-border/70 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2 rounded-full text-muted-foreground transition-colors hover:bg-[#D3A753]/10 hover:text-[#D3A753]"
            >
              <Link href="/">
                <ChevronLeft className="size-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-8 space-y-4 text-center sm:mt-12 sm:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-gradient-to-r from-[#D3A753]/15 via-[#E791A7]/15 to-[#CA617D]/15 px-4 py-1.5 text-xs font-semibold text-[#D3A753] sm:text-sm"
            >
              <ShieldCheck className="size-4 text-[#D3A753]" />
              <span>Official Documentation · Thai Soulmate</span>
            </motion.div>
            <h1 className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Please review these terms and guidelines carefully.
            </p>
          </motion.header>

          <div className="mt-8 sm:mt-12">
            <motion.article
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl border border-[#D3A753]/30 bg-card/85 p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300 hover:border-[#D3A753]/50 sm:p-10 lg:p-12"
            >
              {/* Subtle top edge highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D3A753]/60 to-transparent" />
              <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 to-transparent blur-3xl" />

              <div className="space-y-8">
                {content.map((section, index) => (
                  <motion.section
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.04, 0.2),
                      ease: "easeOut",
                    }}
                    className={cn(
                      "space-y-3",
                      index !== content.length - 1 &&
                        "border-b border-border/40 pb-8"
                    )}
                  >
                    <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {section.heading}
                    </h2>
                    <div className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground sm:text-base">
                      {section.text}
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* Bottom Inquiries Note */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="mt-10 rounded-2xl border border-[#D3A753]/25 bg-muted/40 p-5 text-center transition-all duration-300 hover:border-[#D3A753]/40 sm:p-6 sm:text-left"
              >
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Have questions regarding these policies?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Our legal & support team is happy to assist you with any
                      inquiries.
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      className="btn-gradient shrink-0 font-semibold shadow-md shadow-[#D3A753]/20"
                    >
                      <Link href="/contact" className="gap-2">
                        <Mail className="size-3.5" />
                        <span>Contact Support</span>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.article>
          </div>
        </div>
      </section>
    </main>
  )
}
