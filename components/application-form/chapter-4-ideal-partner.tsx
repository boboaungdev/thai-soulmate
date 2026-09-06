"use client"

import React, { useState } from "react"
import {
  Heart,
  Target,
  Sparkles,
  MapPin,
  Calendar,
  Check,
  Plus,
  SlidersHorizontal,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApplicationFormData } from "./types"
import { cn } from "@/lib/utils"

interface Chapter4Props {
  data: ApplicationFormData
  onChange: (updates: Partial<ApplicationFormData>) => void
  onNext: () => void
  onBack: () => void
}

const RELATIONSHIP_GOALS = [
  {
    id: "Marriage / Life Partner",
    label: "Marriage / Life Partner",
    desc: "Seeking a sincere life partner and long-term marriage.",
  },
  {
    id: "Long-Term Relationship",
    label: "Long-Term Relationship",
    desc: "A committed, meaningful connection built on mutual trust.",
  },
  {
    id: "Companionship",
    label: "Companionship",
    desc: "Genuine friendship and sharing travel & life experiences.",
  },
  {
    id: "I'm Not Sure Yet",
    label: "I'm Not Sure Yet",
    desc: "Open to exploring how personal matchmaking can help.",
  },
]

const TIMELINE_OPTIONS = ["Within 1 Year", "1–3 Years", "No Specific Timeline"]
const RELOCATION_OPTIONS = [
  "Yes, willing to relocate",
  "Open to discussion / travel",
  "Prefer to stay in current location",
]

const PARTNER_QUALITIES = [
  "Sincere & Honest",
  "Kind & Caring",
  "Family-Minded",
  "Emotionally Mature",
  "Good Communicator",
  "Healthy Lifestyle",
  "Loyal & Committed",
  "Warm Sense of Humor",
  "Financially Responsible",
  "Positive & Cheerful",
  "Respectful & Supportive",
]

export function Chapter4IdealPartner({
  data,
  onChange,
  onNext,
  onBack,
}: Chapter4Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!data.relationshipGoal) {
      newErrors.relationshipGoal =
        "Please select what you are seeking in a partner."
    }
    const qualities = data.dealBreakers || []
    if (qualities.length !== 5) {
      newErrors.dealBreakers = `Please select exactly 5 partner qualities (${qualities.length}/5 selected).`
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextClick = () => {
    setTouched(true)
    const isValid = validate()
    if (!isValid) {
      toast.error(
        "Please complete all required fields (select relationship goal and exactly 5 partner qualities)."
      )
      return
    }
    onNext()
  }

  const toggleQuality = (quality: string) => {
    const list = data.dealBreakers || []
    const isSelected = list.includes(quality)
    if (!isSelected && list.length >= 5) {
      return
    }

    const updated = isSelected
      ? list.filter((q) => q !== quality)
      : [...list, quality]

    onChange({ dealBreakers: updated })

    if (touched) {
      setErrors((prev) => {
        const next = { ...prev }
        if (updated.length === 5) {
          delete next.dealBreakers
        } else {
          next.dealBreakers = `Please select exactly 5 partner qualities (${updated.length}/5 selected).`
        }
        return next
      })
    }
  }

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION 1: RELATIONSHIP GOAL */}
      <div className="space-y-2.5">
        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          What Are You Seeking? <span className="text-[#CA617D]">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {RELATIONSHIP_GOALS.map((goal) => {
            const isSelected = data.relationshipGoal === goal.label
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => {
                  onChange({ relationshipGoal: goal.label })
                  if (touched) {
                    setErrors((prev) => {
                      const next = { ...prev }
                      delete next.relationshipGoal
                      return next
                    })
                  }
                }}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200",
                  isSelected
                    ? "border-[#D3A753] bg-gradient-to-br from-[#D3A753]/15 to-[#CA617D]/10 shadow-sm ring-1 ring-[#D3A753]/60"
                    : touched && errors.relationshipGoal
                      ? "border-destructive/60 bg-card/60 hover:border-destructive"
                      : "border-border/60 bg-card/60 hover:border-border hover:bg-card/90"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                    isSelected
                      ? "border-[#D3A753] bg-[#D3A753] text-black"
                      : "border-muted-foreground"
                  )}
                >
                  {isSelected && <Check className="size-3 stroke-[3]" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground sm:text-sm">
                    {goal.label}
                  </p>
                  <p className="text-[11px] leading-tight text-muted-foreground">
                    {goal.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
        {touched && errors.relationshipGoal && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
            <AlertCircle className="size-3" />
            <span>{errors.relationshipGoal}</span>
          </p>
        )}
      </div>

      {/* SECTION 2: TIMELINE & RELOCATION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Settle Down Timeline */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Ideal Timeline to Settle Down
          </Label>
          <Select
            value={data.settleDown}
            onValueChange={(val) => onChange({ settleDown: val })}
          >
            <SelectTrigger className="h-10 bg-background text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMELINE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Relocation Willingness */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Relocation Willingness
          </Label>
          <Select
            value={data.relocate}
            onValueChange={(val) => onChange({ relocate: val })}
          >
            <SelectTrigger className="h-10 bg-background text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RELOCATION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SECTION 3: AGE & HEIGHT RANGES */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
          <SlidersHorizontal className="size-4" />
          <span>Preferred Partner Age &amp; Height Criteria</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Age Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-foreground">Preferred Age Range</span>
              <span className="font-mono text-[#D3A753]">
                {data.idealPartnerMinAge} – {data.idealPartnerMaxAge} Years
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">20</span>
              <Slider
                min={20}
                max={70}
                step={1}
                value={[data.idealPartnerMinAge, data.idealPartnerMaxAge]}
                onValueChange={(vals) =>
                  onChange({
                    idealPartnerMinAge: vals[0],
                    idealPartnerMaxAge: vals[1],
                  })
                }
                className="flex-1"
              />
              <span className="text-[11px] text-muted-foreground">70</span>
            </div>
          </div>

          {/* Height Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-foreground">Preferred Height Range</span>
              <span className="font-mono text-[#D3A753]">
                {data.idealPartnerMinHeight} – {data.idealPartnerMaxHeight} cm
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">145cm</span>
              <Slider
                min={145}
                max={205}
                step={1}
                value={[data.idealPartnerMinHeight, data.idealPartnerMaxHeight]}
                onValueChange={(vals) =>
                  onChange({
                    idealPartnerMinHeight: vals[0],
                    idealPartnerMaxHeight: vals[1],
                  })
                }
                className="flex-1"
              />
              <span className="text-[11px] text-muted-foreground">205cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: LOCATION PREFERENCE */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Preferred Partner Location
          </Label>
          <Input
            value={data.idealPartnerLocation}
            onChange={(e) => onChange({ idealPartnerLocation: e.target.value })}
            placeholder="e.g. Thailand, Open to International..."
            className="h-10 text-xs sm:text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Preferred Nationality
          </Label>
          <Input
            value={data.idealPartnerNationality}
            onChange={(e) =>
              onChange({ idealPartnerNationality: e.target.value })
            }
            placeholder="e.g. Thai, Asian, Western, Any..."
            className="h-10 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* SECTION 5: TOP QUALITIES SOUGHT */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Top Qualities You Value in a Partner{" "}
            <span className="text-[#CA617D]">*</span>
          </Label>
          <span
            className={cn(
              "text-xs font-medium",
              (data.dealBreakers || []).length === 5
                ? "text-[#D3A753]"
                : "text-muted-foreground"
            )}
          >
            Choose 5 ({(data.dealBreakers || []).length}/5 selected)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PARTNER_QUALITIES.map((quality) => {
            const list = data.dealBreakers || []
            const isSelected = list.includes(quality)
            const isDisabled = !isSelected && list.length >= 5
            return (
              <button
                key={quality}
                type="button"
                disabled={isDisabled}
                onClick={() => toggleQuality(quality)}
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
                <span>{quality}</span>
              </button>
            )
          })}
        </div>
        {touched && errors.dealBreakers && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
            <AlertCircle className="size-3" />
            <span>{errors.dealBreakers}</span>
          </p>
        )}
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
          <span>Back to Personality</span>
        </Button>

        <Button
          type="button"
          onClick={handleNextClick}
          className="btn-gradient inline-flex h-10 items-center gap-1.5 px-6 text-xs font-semibold shadow-md transition-all hover:scale-[1.01] sm:text-sm"
        >
          <span>Continue to Verified Photos</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
