"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Heart,
  Phone,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

interface ThankYouScreenProps {
  customId?: number
  applicantName?: string
  contactTime?: string | null
}

export function ThankYouScreen({
  customId,
  applicantName,
  contactTime,
}: ThankYouScreenProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D3A753", "#E791A7", "#CA617D"],
      })
    } catch {
      // fallback if canvas-confetti unavailable
    }
  }, [])

  const refNumber = customId ? `#TSM-${String(customId).padStart(4, "0")}` : "#TSM-CONFIDENTIAL"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card via-card to-background p-6 text-center shadow-2xl backdrop-blur-md sm:p-10"
    >
      <div className="space-y-6">
        {/* Celebration Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753] ring-1 ring-[#D3A753]/40">
          <Sparkles className="size-8 text-[#CA617D]" />
        </div>

        {/* Ref Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/40 bg-[#D3A753]/10 px-4 py-1 text-xs font-mono font-semibold text-[#D3A753]">
          <span>Application Reference: {refNumber}</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Application Received with Discretion
          </h1>
          <p className="mx-auto max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Thank you,{" "}
            <span className="font-semibold text-foreground">
              {applicantName || "for completing your profile"}
            </span>
            . Your comprehensive matchmaking application has been securely
            transferred to our matchmaking team.
          </p>
        </div>

        {/* What Happens Next Card */}
        <div className="space-y-3 rounded-2xl border border-border/70 bg-background/50 p-4 text-left sm:p-5">
          <h3 className="text-xs font-bold tracking-wider text-[#D3A753] uppercase">
            What Happens Next:
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/20 text-[#D3A753]">
                <span className="text-xs font-bold">1</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Matchmaker Review:
                </span>{" "}
                Your dedicated matchmaker will thoroughly analyze your
                lifestyle, values, and criteria.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/20 text-[#D3A753]">
                <span className="text-xs font-bold">2</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Consultation Call:
                </span>{" "}
                We will speak with you confidentially
                {contactTime ? ` at your scheduled slot (${contactTime})` : ""}{" "}
                via WhatsApp or phone to finalize your preferences.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/20 text-[#D3A753]">
                <span className="text-xs font-bold">3</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Curated Match Recommendations:
                </span>{" "}
                We present hand-selected member profiles where there is genuine
                mutual interest and verified compatibility.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            asChild
            size="lg"
            className="btn-gradient h-11 w-full text-sm font-semibold shadow-xl"
          >
            <Link href="/">
              <span>Return to Home</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            A confirmation has also been dispatched to your email address.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
