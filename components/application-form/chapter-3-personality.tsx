"use client"

import React, { useState } from "react"
import {
  Heart,
  Sparkles,
  Users,
  Smile,
  Compass,
  Check,
  Plus,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApplicationFormData } from "./types"
import { cn } from "@/lib/utils"

interface Chapter3Props {
  data: ApplicationFormData
  onChange: (updates: Partial<ApplicationFormData>) => void
  onNext: () => void
  onBack: () => void
}

const PERSONALITY_TRAITS = [
  "Kind",
  "Loyal",
  "Ambitious",
  "Romantic",
  "Family-Oriented",
  "Easy Going",
  "Adventurous",
  "Confident",
  "Humorous",
  "Intelligent",
  "Creative",
  "Calm & Grounded",
  "Spiritual",
  "Thoughtful",
]

const CORE_VALUES = [
  "Honesty",
  "Trust",
  "Loyalty",
  "Family",
  "Kindness",
  "Financial Stability",
  "Communication",
  "Mutual Respect",
  "Personal Growth",
  "Adventure",
  "Faith & Integrity",
]

const HOBBIES_LIST = [
  "Travel",
  "Fitness / Gym",
  "Cooking",
  "Fine Dining",
  "Music & Concerts",
  "Movies",
  "Business & Investing",
  "Golf",
  "Tennis",
  "Hiking & Nature",
  "Beach & Islands",
  "Yoga & Wellness",
  "Photography",
  "Pets & Animals",
  "Reading",
  "Art & Design",
]

export function Chapter3Personality({
  data,
  onChange,
  onNext,
  onBack,
}: Chapter3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (data.personality.length !== 5) {
      newErrors.personality = `Please select exactly 5 personality traits (${data.personality.length}/5 selected).`
    }
    if (data.values.length !== 5) {
      newErrors.values = `Please select exactly 5 core values (${data.values.length}/5 selected).`
    }
    if (data.interests.length !== 5) {
      newErrors.interests = `Please select exactly 5 hobbies & interests (${data.interests.length}/5 selected).`
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const toggleItem = (
    list: string[],
    item: string,
    key: "personality" | "values" | "interests"
  ) => {
    const isSelected = list.includes(item)
    if (!isSelected && list.length >= 5) {
      return
    }

    const updated = isSelected
      ? list.filter((i) => i !== item)
      : [...list, item]
    onChange({ [key]: updated })

    if (touched) {
      setErrors((prev) => {
        const next = { ...prev }
        if (updated.length === 5) {
          delete next[key]
        } else {
          if (key === "personality")
            next.personality = `Please select exactly 5 personality traits (${updated.length}/5 selected).`
          if (key === "values")
            next.values = `Please select exactly 5 core values (${updated.length}/5 selected).`
          if (key === "interests")
            next.interests = `Please select exactly 5 hobbies & interests (${updated.length}/5 selected).`
        }
        return next
      })
    }
  }

  const handleNextClick = () => {
    setTouched(true)
    const isValid = validate()
    if (!isValid) {
      toast.error(
        "Please select exactly 5 items for personality, values, and interests."
      )
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION 1: CHILDREN & FAMILY OUTLOOK */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
          <Users className="size-4" />
          <span>Family &amp; Children Status</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Has Children? */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Do you have children?
            </Label>
            <Select
              value={data.hasChildren}
              onValueChange={(val) =>
                onChange({
                  hasChildren: val,
                  childrenCount: val === "No" ? 0 : data.childrenCount || 1,
                })
              }
            >
              <SelectTrigger className="h-9 bg-background text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No Children</SelectItem>
                <SelectItem value="Yes">Yes, have children</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Children count if Yes */}
          {data.hasChildren === "Yes" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                How many children?
              </Label>
              <Select
                value={String(data.childrenCount || 1)}
                onValueChange={(val) =>
                  onChange({ childrenCount: Number(val) })
                }
              >
                <SelectTrigger className="h-9 bg-background text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Child</SelectItem>
                  <SelectItem value="2">2 Children</SelectItem>
                  <SelectItem value="3">3 Children</SelectItem>
                  <SelectItem value="4">4+ Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Open to Future Children? */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Desire for future children?
            </Label>
            <Select
              value={data.futureChildren}
              onValueChange={(val) => onChange({ futureChildren: val })}
            >
              <SelectTrigger className="h-9 bg-background text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes, would love to</SelectItem>
                <SelectItem value="Maybe">Open / Maybe</SelectItem>
                <SelectItem value="No">No more children</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Family Importance */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Importance of Family
            </Label>
            <Select
              value={data.familyImportance}
              onValueChange={(val) => onChange({ familyImportance: val })}
            >
              <SelectTrigger className="h-9 bg-background text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Very Important">Very Important</SelectItem>
                <SelectItem value="Important">Important</SelectItem>
                <SelectItem value="Somewhat Important">
                  Somewhat Important
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SECTION 2: PERSONALITY TRAITS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Top Personality Traits <span className="text-[#CA617D]">*</span>
          </Label>
          <span
            className={cn(
              "text-xs font-medium",
              data.personality.length === 5
                ? "text-[#D3A753]"
                : "text-muted-foreground"
            )}
          >
            Choose 5 ({data.personality.length}/5 selected)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TRAITS.map((trait) => {
            const isSelected = data.personality.includes(trait)
            const isDisabled = !isSelected && data.personality.length >= 5
            return (
              <button
                key={trait}
                type="button"
                disabled={isDisabled}
                onClick={() =>
                  toggleItem(data.personality, trait, "personality")
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[#D3A753] bg-gradient-to-r from-[#D3A753]/20 via-[#E791A7]/15 to-[#CA617D]/15 text-foreground shadow-xs ring-1 ring-[#D3A753]/60"
                    : isDisabled
                      ? "cursor-not-allowed border-border/30 bg-card/30 text-muted-foreground/40 opacity-50"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {isSelected ? (
                  <Check className="size-3 text-[#D3A753]" />
                ) : (
                  <Plus className="size-3 opacity-40" />
                )}
                <span>{trait}</span>
              </button>
            )
          })}
        </div>
        {touched && errors.personality && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
            <AlertCircle className="size-3" />
            <span>{errors.personality}</span>
          </p>
        )}
      </div>

      {/* SECTION 3: CORE VALUES */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Core Values You Live By <span className="text-[#CA617D]">*</span>
          </Label>
          <span
            className={cn(
              "text-xs font-medium",
              data.values.length === 5
                ? "text-[#CA617D]"
                : "text-muted-foreground"
            )}
          >
            Choose 5 ({data.values.length}/5 selected)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CORE_VALUES.map((val) => {
            const isSelected = data.values.includes(val)
            const isDisabled = !isSelected && data.values.length >= 5
            return (
              <button
                key={val}
                type="button"
                disabled={isDisabled}
                onClick={() => toggleItem(data.values, val, "values")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[#CA617D] bg-gradient-to-r from-[#CA617D]/20 to-[#D3A753]/15 text-foreground shadow-xs ring-1 ring-[#CA617D]/60"
                    : isDisabled
                      ? "cursor-not-allowed border-border/30 bg-card/30 text-muted-foreground/40 opacity-50"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {isSelected ? (
                  <Check className="size-3 text-[#CA617D]" />
                ) : (
                  <Plus className="size-3 opacity-40" />
                )}
                <span>{val}</span>
              </button>
            )
          })}
        </div>
        {touched && errors.values && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
            <AlertCircle className="size-3" />
            <span>{errors.values}</span>
          </p>
        )}
      </div>

      {/* SECTION 4: HOBBIES & INTERESTS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Hobbies &amp; What You Enjoy{" "}
            <span className="text-[#CA617D]">*</span>
          </Label>
          <span
            className={cn(
              "text-xs font-medium",
              data.interests.length === 5
                ? "text-[#D3A753]"
                : "text-muted-foreground"
            )}
          >
            Choose 5 ({data.interests.length}/5 selected)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {HOBBIES_LIST.map((hobby) => {
            const isSelected = data.interests.includes(hobby)
            const isDisabled = !isSelected && data.interests.length >= 5
            return (
              <button
                key={hobby}
                type="button"
                disabled={isDisabled}
                onClick={() => toggleItem(data.interests, hobby, "interests")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[#D3A753] bg-[#D3A753]/20 text-foreground shadow-xs ring-1 ring-[#D3A753]/60"
                    : isDisabled
                      ? "cursor-not-allowed border-border/30 bg-card/30 text-muted-foreground/40 opacity-50"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {isSelected ? (
                  <Check className="size-3 text-[#D3A753]" />
                ) : (
                  <Plus className="size-3 opacity-40" />
                )}
                <span>{hobby}</span>
              </button>
            )
          })}
        </div>
        {touched && errors.interests && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
            <AlertCircle className="size-3" />
            <span>{errors.interests}</span>
          </p>
        )}
      </div>

      {/* SECTION 5: BIO / ABOUT ME */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            A Few Words About Yourself (Bio)
          </Label>
          <span
            className={cn(
              "text-xs font-medium tabular-nums transition-colors",
              (data.about || "").length >= 300
                ? "font-semibold text-[#CA617D]"
                : (data.about || "").length >= 260
                  ? "text-[#D3A753]"
                  : "text-muted-foreground"
            )}
          >
            {(data.about || "").length} / 300
          </span>
        </div>
        <Textarea
          value={data.about || ""}
          maxLength={300}
          onChange={(e) => {
            const text = e.target.value.slice(0, 300)
            onChange({ about: text })
          }}
          rows={3}
          placeholder="Share a little about what brings you joy, your passions, or what you enjoy doing on relaxed weekends..."
          className={cn(
            "bg-background text-xs sm:text-sm",
            (data.about || "").length >= 300 &&
              "border-[#CA617D]/60 ring-1 ring-[#CA617D]/30"
          )}
        />
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
          <p className="text-muted-foreground">
            This helps your matchmaker introduce you warmly and authentically to
            compatible matches.
          </p>
          {(data.about || "").length >= 300 && (
            <span className="font-medium text-[#CA617D]">
              Maximum 300 characters reached
            </span>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-10 px-5 text-xs sm:text-sm"
        >
          ← Back to Career
        </Button>

        <Button
          type="button"
          onClick={handleNextClick}
          className="btn-gradient h-10 px-6 text-xs font-semibold shadow-md transition-all hover:scale-[1.01] sm:text-sm"
        >
          Continue to Ideal Partner →
        </Button>
      </div>
    </div>
  )
}
