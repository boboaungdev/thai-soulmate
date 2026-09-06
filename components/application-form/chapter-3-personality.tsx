"use client"

import React from "react"
import {
  Heart,
  Sparkles,
  Users,
  Smile,
  Compass,
  Check,
  Plus,
} from "lucide-react"
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
  const toggleItem = (
    list: string[],
    item: string,
    key: "personality" | "values" | "interests"
  ) => {
    if (list.includes(item)) {
      onChange({ [key]: list.filter((i) => i !== item) })
    } else {
      onChange({ [key]: [...list, item] })
    }
  }

  const isValid =
    data.personality.length > 0 &&
    data.values.length > 0 &&
    data.interests.length > 0

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
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Top Personality Traits <span className="text-[#CA617D]">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            Select 3–5 that best describe you
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TRAITS.map((trait) => {
            const isSelected = data.personality.includes(trait)
            return (
              <button
                key={trait}
                type="button"
                onClick={() =>
                  toggleItem(data.personality, trait, "personality")
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[#D3A753] bg-gradient-to-r from-[#D3A753]/20 via-[#E791A7]/15 to-[#CA617D]/15 text-foreground shadow-xs ring-1 ring-[#D3A753]/60"
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
      </div>

      {/* SECTION 3: CORE VALUES */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Core Values You Live By <span className="text-[#CA617D]">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            Select 3–5 core values
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CORE_VALUES.map((val) => {
            const isSelected = data.values.includes(val)
            return (
              <button
                key={val}
                type="button"
                onClick={() => toggleItem(data.values, val, "values")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[#CA617D] bg-gradient-to-r from-[#CA617D]/20 to-[#D3A753]/15 text-foreground shadow-xs ring-1 ring-[#CA617D]/60"
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
      </div>

      {/* SECTION 4: HOBBIES & INTERESTS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Hobbies &amp; What You Enjoy{" "}
            <span className="text-[#CA617D]">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            Select all that apply
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {HOBBIES_LIST.map((hobby) => {
            const isSelected = data.interests.includes(hobby)
            return (
              <button
                key={hobby}
                type="button"
                onClick={() => toggleItem(data.interests, hobby, "interests")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[#D3A753] bg-[#D3A753]/20 text-foreground shadow-xs ring-1 ring-[#D3A753]/60"
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
      </div>

      {/* SECTION 5: BIO / ABOUT ME */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          A Few Words About Yourself (Bio)
        </Label>
        <Textarea
          value={data.about}
          onChange={(e) => onChange({ about: e.target.value })}
          rows={3}
          placeholder="Share a little about what brings you joy, your passions, or what you enjoy doing on relaxed weekends..."
          className="bg-background text-xs sm:text-sm"
        />
        <p className="text-[11px] text-muted-foreground">
          This helps your matchmaker introduce you warmly and authentically to
          compatible matches.
        </p>
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
          onClick={onNext}
          disabled={!isValid}
          className="btn-gradient h-10 px-6 text-xs font-semibold sm:text-sm"
        >
          Continue to Ideal Partner →
        </Button>
      </div>
    </div>
  )
}
