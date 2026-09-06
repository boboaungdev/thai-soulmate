"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  User,
  Briefcase,
  Heart,
  Target,
  Camera,
  Pencil,
  ChevronDown,
  Lock,
} from "lucide-react"
import { ApplicationFormData } from "./types"
import { Chapter1Identity } from "./chapter-1-identity"
import { Chapter2Career } from "./chapter-2-career"
import { Chapter3Personality } from "./chapter-3-personality"
import { Chapter4IdealPartner } from "./chapter-4-ideal-partner"
import { Chapter5Photos } from "./chapter-5-photos"
import { cn } from "@/lib/utils"

interface ChapterAccordionProps {
  data: ApplicationFormData
  onChange: (updates: Partial<ApplicationFormData>) => void
  onReview: () => void
  initialChapter?: number
}

export function ChapterAccordion({
  data,
  onChange,
  onReview,
  initialChapter = 1,
}: ChapterAccordionProps) {
  const [activeChapter, setActiveChapter] = useState<number>(initialChapter)
  const [completedChapters, setCompletedChapters] = useState<number[]>([])

  useEffect(() => {
    if (initialChapter) {
      setActiveChapter(initialChapter)
    }
  }, [initialChapter])

  const markCompleted = (ch: number) => {
    if (!completedChapters.includes(ch)) {
      setCompletedChapters((prev) => [...prev, ch])
    }
    setActiveChapter(ch + 1)
  }

  // Calculate quick summary strings for collapsed chapters
  const getSummary = (ch: number) => {
    switch (ch) {
      case 1:
        return `${data.prefix} ${data.name || "Applicant"} · ${data.gender} · Based in ${data.currentLocation || "Thailand"}`
      case 2:
        return `${data.education || "Graduate"} · ${data.occupation || "Professional"}${data.company ? ` at ${data.company}` : ""}`
      case 3:
        return `${data.personality.slice(0, 3).join(", ") || "Personality"} · Values: ${data.values.slice(0, 2).join(", ") || "Family"}`
      case 4:
        return `Seeking: ${data.relationshipGoal || "Marriage"} · Partner Age ${data.idealPartnerMinAge}–${data.idealPartnerMaxAge}`
      case 5:
        return data.headshotUrl
          ? "Primary photos uploaded & verified"
          : "Pending upload"
      default:
        return ""
    }
  }

  const chapters = [
    {
      number: 1,
      title: "Identity & Background",
      icon: User,
      render: (
        <Chapter1Identity
          data={data}
          onChange={onChange}
          onNext={() => markCompleted(1)}
        />
      ),
    },
    {
      number: 2,
      title: "Career, Education & Lifestyle",
      icon: Briefcase,
      render: (
        <Chapter2Career
          data={data}
          onChange={onChange}
          onNext={() => markCompleted(2)}
          onBack={() => setActiveChapter(1)}
        />
      ),
    },
    {
      number: 3,
      title: "Personality, Values & Family",
      icon: Heart,
      render: (
        <Chapter3Personality
          data={data}
          onChange={onChange}
          onNext={() => markCompleted(3)}
          onBack={() => setActiveChapter(2)}
        />
      ),
    },
    {
      number: 4,
      title: "Your Ideal Life Partner",
      icon: Target,
      render: (
        <Chapter4IdealPartner
          data={data}
          onChange={onChange}
          onNext={() => markCompleted(4)}
          onBack={() => setActiveChapter(3)}
        />
      ),
    },
    {
      number: 5,
      title: "Verified Photographs & Consent",
      icon: Camera,
      render: (
        <Chapter5Photos
          data={data}
          onChange={onChange}
          onReview={() => {
            if (!completedChapters.includes(5)) {
              setCompletedChapters((prev) => [...prev, 5])
            }
            onReview()
          }}
          onBack={() => setActiveChapter(4)}
        />
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {chapters.map((ch) => {
        const Icon = ch.icon
        const isActive = activeChapter === ch.number
        const isCompleted = completedChapters.includes(ch.number)
        const isAccessible = isCompleted || isActive || ch.number === 1

        return (
          <motion.div
            key={ch.number}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: ch.number * 0.05 }}
            className={cn(
              "overflow-hidden rounded-2xl border transition-all duration-300",
              isActive
                ? "border-[#D3A753]/60 bg-gradient-to-br from-card via-card to-background shadow-xl ring-1 ring-[#D3A753]/40"
                : isCompleted
                  ? "border-[#D3A753]/30 bg-card/60 hover:border-[#D3A753]/50"
                  : "border-border/50 bg-card/30 opacity-70"
            )}
          >
            {/* ACCORDION HEADER BAR */}
            <div
              onClick={() => {
                if (isAccessible) {
                  setActiveChapter(ch.number)
                }
              }}
              className={cn(
                "flex items-center justify-between p-4 select-none sm:p-5",
                isAccessible ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Status Icon Badge */}
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-colors sm:size-9",
                    isCompleted
                      ? "border-[#D3A753] bg-[#D3A753] text-black"
                      : isActive
                        ? "border-[#D3A753] bg-[#D3A753]/20 text-[#D3A753]"
                        : "border-border/60 bg-muted/40 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[3]" />
                  ) : (
                    <span>{ch.number}</span>
                  )}
                </div>

                {/* Chapter Title & Summary */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                      {ch.title}
                    </h3>
                    {isActive && (
                      <span className="hidden rounded-md bg-[#D3A753]/15 px-2 py-0.5 text-[10px] font-semibold text-[#D3A753] sm:inline-block">
                        Active Chapter
                      </span>
                    )}
                  </div>

                  {!isActive && isCompleted && (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {getSummary(ch.number)}
                    </p>
                  )}
                  {!isActive && !isCompleted && (
                    <p className="text-xs text-muted-foreground">
                      Chapter {ch.number} of 5
                    </p>
                  )}
                </div>
              </div>

              {/* Trailing Control */}
              <div className="flex items-center gap-2">
                {isCompleted && !isActive && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D3A753] hover:underline">
                    <Pencil className="size-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </span>
                )}
                {!isAccessible && (
                  <Lock className="size-3.5 text-muted-foreground" />
                )}
                {isAccessible && (
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-300",
                      isActive && "rotate-180 text-[#D3A753]"
                    )}
                  />
                )}
              </div>
            </div>

            {/* EXPANDABLE CONTENT BODY */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="border-t border-border/40 p-4 sm:p-6">
                    {ch.render}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
