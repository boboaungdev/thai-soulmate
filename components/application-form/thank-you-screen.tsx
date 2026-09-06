"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Sparkles,
  ChevronRight,
  CircleDot,
  Clock,
  CircleCheck,
  Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"

interface ThankYouScreenProps {
  status?: string
  customId?: number | string
  applicantName?: string
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string
    icon: React.ElementType
    badgeClass: string
    iconClass: string
  }
> = {
  RECEIVED: {
    label: "Received",
    icon: CircleDot,
    badgeClass: "border-[#D3A753]/40 bg-[#D3A753]/10 text-[#D3A753]",
    iconClass: "text-[#D3A753]",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    badgeClass: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    iconClass: "text-amber-400",
  },
  COMPLETED: {
    label: "Completed",
    icon: CircleCheck,
    badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    iconClass: "text-emerald-400",
  },
  MATCHED: {
    label: "Matched",
    icon: CircleCheck,
    badgeClass: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    iconClass: "text-blue-400",
  },
  CLOSED: {
    label: "Closed",
    icon: Archive,
    badgeClass: "border-muted-foreground/40 bg-muted/20 text-muted-foreground",
    iconClass: "text-muted-foreground",
  },
}

export function ThankYouScreen({
  status = "RECEIVED",
  customId,
  applicantName,
}: ThankYouScreenProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
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

  const currentStatus = (status || "RECEIVED").toUpperCase()
  const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.RECEIVED
  const StatusIcon = statusInfo.icon

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

        {/* Application Status Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold shadow-xs",
            statusInfo.badgeClass
          )}
        >
          <StatusIcon className={cn("size-3.5", statusInfo.iconClass)} />
          <span>Status: {statusInfo.label}</span>
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
                  Personal Consultation:
                </span>{" "}
                Our matchmaking team will connect with you confidentially via
                WhatsApp or phone to review your preferences and answer any
                questions.
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
              <ChevronRight className="size-4" />
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
