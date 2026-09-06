"use client"

import React, { useState } from "react"
import {
  Briefcase,
  GraduationCap,
  Building,
  Check,
  Languages,
  Cigarette,
  Wine,
  Activity,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApplicationFormData } from "./types"
import { cn } from "@/lib/utils"

interface Chapter2Props {
  data: ApplicationFormData
  onChange: (updates: Partial<ApplicationFormData>) => void
  onNext: () => void
  onBack: () => void
}

const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Other",
]

const SMOKING_HABITS = ["Never", "Occasionally", "Regularly"]
const DRINKING_HABITS = ["Never", "Socially", "Regularly"]
const EXERCISE_HABITS = ["Daily", "Weekly", "Occasionally", "Never"]

const LIFESTYLE_TYPES = [
  {
    id: "Family-Focused",
    label: "Family-Focused",
    desc: "Values quality home time and relationships.",
  },
  {
    id: "Active",
    label: "Active & Energetic",
    desc: "Enjoys outdoors, fitness, and staying on the move.",
  },
  {
    id: "Career-Focused",
    label: "Career & Driven",
    desc: "Passionate about professional growth.",
  },
  {
    id: "Relaxed",
    label: "Relaxed & Balanced",
    desc: "Appreciates a calm, peaceful pace of life.",
  },
  {
    id: "Luxury-Oriented",
    label: "Luxury & Fine Living",
    desc: "Appreciates fine dining, travel, and high quality.",
  },
  {
    id: "Adventurous",
    label: "Adventurous",
    desc: "Love exploring new cultures, destinations, and food.",
  },
]

export function Chapter2Career({
  data,
  onChange,
  onNext,
  onBack,
}: Chapter2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!data.education) {
      newErrors.education = "Please select your education level."
    }
    if (!data.occupation.trim()) {
      newErrors.occupation = "Please enter your occupation / profession."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextClick = () => {
    setTouched(true)
    const isValid = validate()
    if (!isValid) {
      toast.error("Please complete all required fields correctly.")
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION 1: EDUCATION & OCCUPATION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Education Level */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Education Level <span className="text-[#CA617D]">*</span>
          </Label>
          <Select
            value={data.education || undefined}
            onValueChange={(val) => {
              onChange({ education: val })
              if (touched) validate()
            }}
          >
            <SelectTrigger
              className={cn(
                "h-10 bg-background text-xs sm:text-sm",
                touched &&
                  errors.education &&
                  "border-destructive ring-1 ring-destructive"
              )}
            >
              <SelectValue placeholder="Select education level..." />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((edu) => (
                <SelectItem key={edu} value={edu}>
                  {edu}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched && errors.education && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3" />
              <span>{errors.education}</span>
            </p>
          )}
        </div>

        {/* Occupation */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Occupation / Profession <span className="text-[#CA617D]">*</span>
          </Label>
          <div className="relative">
            <Briefcase className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={data.occupation}
              onChange={(e) => {
                onChange({ occupation: e.target.value })
                if (touched) validate()
              }}
              placeholder="e.g. Architect, Software Director, Entrepreneur..."
              className={cn(
                "h-10 pl-9 text-xs sm:text-sm",
                touched &&
                  errors.occupation &&
                  "border-destructive ring-1 ring-destructive"
              )}
            />
          </div>
          {touched && errors.occupation && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3" />
              <span>{errors.occupation}</span>
            </p>
          )}
        </div>
      </div>

      {/* Company / Industry */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Company / Industry
          </Label>
          <div className="relative">
            <Building className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={data.company}
              onChange={(e) => onChange({ company: e.target.value })}
              placeholder="e.g. Technology, Healthcare, Consulting..."
              className="h-10 pl-9 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Financial Assets Checkboxes */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Financial &amp; Enterprise Independence
          </Label>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => onChange({ ownBusiness: !data.ownBusiness })}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                data.ownBusiness
                  ? "border-[#D3A753] bg-[#D3A753]/15 text-foreground"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:border-border"
              )}
            >
              <div
                className={cn(
                  "flex size-4 items-center justify-center rounded-sm border",
                  data.ownBusiness
                    ? "border-[#D3A753] bg-[#D3A753] text-black"
                    : "border-muted-foreground"
                )}
              >
                {data.ownBusiness && <Check className="size-3 stroke-[3]" />}
              </div>
              <span>Owns a Business / Enterprise</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ ownProperty: !data.ownProperty })}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                data.ownProperty
                  ? "border-[#D3A753] bg-[#D3A753]/15 text-foreground"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:border-border"
              )}
            >
              <div
                className={cn(
                  "flex size-4 items-center justify-center rounded-sm border",
                  data.ownProperty
                    ? "border-[#D3A753] bg-[#D3A753] text-black"
                    : "border-muted-foreground"
                )}
              >
                {data.ownProperty && <Check className="size-3 stroke-[3]" />}
              </div>
              <span>Homeowner / Property Owner</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: LANGUAGE FLUENCY */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
          <Languages className="size-4" />
          <span>Language Fluency</span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* English */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                English Fluency
              </span>
              <span className="font-mono text-muted-foreground">
                {data.englishFluency}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[data.englishFluency]}
              onValueChange={(val) => onChange({ englishFluency: val[0] })}
            />
            <p className="text-[11px] text-muted-foreground">
              {data.englishFluency >= 80
                ? "Fluent / Native"
                : data.englishFluency >= 50
                  ? "Conversational"
                  : "Basic"}
            </p>
          </div>

          {/* Thai */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                Thai Fluency
              </span>
              <span className="font-mono text-muted-foreground">
                {data.thaiFluency}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[data.thaiFluency]}
              onValueChange={(val) => onChange({ thaiFluency: val[0] })}
            />
            <p className="text-[11px] text-muted-foreground">
              {data.thaiFluency >= 80
                ? "Fluent / Native"
                : data.thaiFluency >= 30
                  ? "Conversational"
                  : "Beginner / Basic Phrases"}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: HABITS (SMOKING, DRINKING, EXERCISE) */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Personal Habits &amp; Wellness
        </Label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Smoking */}
          <div className="space-y-1.5 rounded-xl border border-border/60 bg-background/50 p-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Cigarette className="size-3.5 text-muted-foreground" />
              <span>Smoking</span>
            </span>
            <Select
              value={data.smoking || undefined}
              onValueChange={(val) => onChange({ smoking: val })}
            >
              <SelectTrigger className="h-8 bg-card text-xs">
                <SelectValue placeholder="Select habit..." />
              </SelectTrigger>
              <SelectContent>
                {SMOKING_HABITS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Drinking */}
          <div className="space-y-1.5 rounded-xl border border-border/60 bg-background/50 p-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Wine className="size-3.5 text-muted-foreground" />
              <span>Alcohol</span>
            </span>
            <Select
              value={data.drinking || undefined}
              onValueChange={(val) => onChange({ drinking: val })}
            >
              <SelectTrigger className="h-8 bg-card text-xs">
                <SelectValue placeholder="Select habit..." />
              </SelectTrigger>
              <SelectContent>
                {DRINKING_HABITS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exercise */}
          <div className="space-y-1.5 rounded-xl border border-border/60 bg-background/50 p-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Activity className="size-3.5 text-muted-foreground" />
              <span>Exercise</span>
            </span>
            <Select
              value={data.exercise || undefined}
              onValueChange={(val) => onChange({ exercise: val })}
            >
              <SelectTrigger className="h-8 bg-card text-xs">
                <SelectValue placeholder="Select routine..." />
              </SelectTrigger>
              <SelectContent>
                {EXERCISE_HABITS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SECTION 4: GENERAL LIFESTYLE PACE */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Primary Lifestyle Focus
        </Label>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {LIFESTYLE_TYPES.map((item) => {
            const isSelected = data.lifestyle === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ lifestyle: item.id })}
                className={cn(
                  "flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-200",
                  isSelected
                    ? "border-[#D3A753] bg-gradient-to-br from-[#D3A753]/15 to-[#CA617D]/10 ring-1 ring-[#D3A753]/50"
                    : "border-border/60 bg-card/60 hover:border-border hover:bg-card/90"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-bold text-foreground sm:text-sm">
                    {item.label}
                  </span>
                  {isSelected && <Check className="size-3.5 text-[#D3A753]" />}
                </div>
                <span className="mt-1 text-[11px] text-muted-foreground">
                  {item.desc}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="inline-flex h-10 items-center gap-1.5 px-5 text-xs sm:text-sm"
        >
          <ChevronLeft className="size-4" />
          <span>Back to Identity</span>
        </Button>

        <Button
          type="button"
          onClick={handleNextClick}
          className="btn-gradient inline-flex h-10 items-center gap-1.5 px-6 text-xs font-semibold shadow-md transition-all hover:scale-[1.01] sm:text-sm"
        >
          <span>Continue to Personality &amp; Values</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
