"use client"

import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MotionDiv } from "./motion"

export function Cta() {
  return (
    <section className="mx-auto w-full max-w-7xl pt-4 pb-12 sm:pb-16">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card/90 via-card/70 to-[#D3A753]/10 p-8 text-center backdrop-blur-sm sm:p-12">
          {/* Ambient subtle glow inside CTA */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/20 to-transparent blur-3xl" />
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
              <Compass className="size-3.5" />
              <span>Start Your Matchmaking Journey</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Ready to Meet Your Match in Thailand?
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Skip endless swiping and unverified profiles. Book a private,
              confidential consultation with your dedicated matchmaker in
              Thailand and begin meeting high-compatibility singles.
            </p>

            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="btn-gradient font-semibold shadow-lg"
              >
                <Link href="/#register-interest">
                  Arrange a Confidential Consultation
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              100% confidential • Hand-scouted matches • Zero pressure
            </p>
          </div>
        </div>
      </MotionDiv>
    </section>
  )
}
