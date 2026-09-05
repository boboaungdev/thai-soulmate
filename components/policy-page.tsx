import Link from "next/link"
import { ChevronLeft, ShieldCheck, Mail } from "lucide-react"
import React from "react"

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

          <header className="mt-8 space-y-4 text-center sm:mt-12 sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-gradient-to-r from-[#D3A753]/15 via-[#E791A7]/15 to-[#CA617D]/15 px-4 py-1.5 text-xs font-semibold text-[#D3A753] sm:text-sm">
              <ShieldCheck className="size-4 text-[#D3A753]" />
              <span>Official Documentation · Thai Soulmate</span>
            </div>
            <h1 className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Please review these terms and guidelines carefully.
            </p>
          </header>

          <div className="mt-8 sm:mt-12">
            <article className="relative overflow-hidden rounded-3xl border border-[#D3A753]/30 bg-card/80 p-6 shadow-2xl backdrop-blur-md sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 to-transparent blur-3xl" />
              <div className="space-y-8">
                {content.map((section, index) => (
                  <section
                    key={index}
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
                  </section>
                ))}
              </div>

              {/* Bottom Inquiries Note */}
              <div className="mt-10 rounded-2xl border border-border/60 bg-muted/30 p-5 text-center sm:p-6 sm:text-left">
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
                  <Button
                    asChild
                    size="sm"
                    className="btn-gradient shrink-0 font-semibold shadow-md"
                  >
                    <Link href="/contact" className="gap-2">
                      <Mail className="size-3.5" />
                      <span>Contact Support</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
