"use client"

import React from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApplicationFormData } from "./types"
import { cn } from "@/lib/utils"

interface Chapter1Props {
  data: ApplicationFormData
  onChange: (updates: Partial<ApplicationFormData>) => void
  onNext: () => void
}

const MARITAL_STATUSES = ["Never Married", "Divorced", "Widowed"]

const RELIGIONS = [
  "Buddhism",
  "Christianity",
  "Islam",
  "Hinduism",
  "Not religious",
  "Other",
]

export function Chapter1Identity({ data, onChange, onNext }: Chapter1Props) {
  const isFemale = data.gender === "Female"

  const isValid =
    Boolean(data.name.trim()) &&
    Boolean(data.dob) &&
    Boolean(data.email.trim()) &&
    Boolean(data.phone.trim()) &&
    Boolean(data.currentLocation.trim())

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION 1: BASIC IDENTITY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[100px_1fr_1fr]">
        {/* Prefix */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Prefix
          </Label>
          <Select
            value={data.prefix}
            onValueChange={(val) => {
              const updates: Partial<ApplicationFormData> = { prefix: val }
              if (val === "Mr.") updates.gender = "Male"
              if (val === "Ms." || val === "Mrs.") updates.gender = "Female"
              onChange(updates)
            }}
          >
            <SelectTrigger className="h-10 bg-background text-xs sm:text-sm">
              <SelectValue placeholder="Prefix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr.">Mr.</SelectItem>
              <SelectItem value="Ms.">Ms.</SelectItem>
              <SelectItem value="Mrs.">Mrs.</SelectItem>
              <SelectItem value="Dr.">Dr.</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Full Name <span className="text-[#CA617D]">*</span>
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Alex Johnson"
              className="h-10 pl-9 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Gender
          </Label>
          <Select
            value={data.gender}
            onValueChange={(val) => {
              const updates: Partial<ApplicationFormData> = { gender: val }
              if (val === "Male" && data.prefix !== "Dr.") updates.prefix = "Mr."
              if (val === "Female" && data.prefix !== "Dr.") updates.prefix = "Ms."
              onChange(updates)
            }}
          >
            <SelectTrigger className="h-10 bg-background text-xs sm:text-sm">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CONDITIONAL: NICKNAME FOR THAI LADIES */}
      {isFemale && (
        <div className="rounded-2xl border border-[#D3A753]/30 bg-[#D3A753]/5 p-4 space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
            Nickname (ชื่อเล่น) · Optional
          </Label>
          <Input
            value={data.nickname}
            onChange={(e) => onChange({ nickname: e.target.value })}
            placeholder="e.g. Noon, Bow, Mint, Ploy..."
            className="h-10 bg-background text-xs sm:text-sm"
          />
          <p className="text-[11px] text-muted-foreground">
            In Thailand, nicknames are warmly used in friendly and respectful
            conversation.
          </p>
        </div>
      )}

      {/* SECTION 2: DOB & MARITAL STATUS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Date of Birth */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Date of Birth <span className="text-[#CA617D]">*</span>
          </Label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              value={data.dob ? data.dob.split("T")[0] : ""}
              onChange={(e) => onChange({ dob: e.target.value })}
              className="h-10 pl-9 text-xs sm:text-sm"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Must be 20 years or older. Handled strictly confidential.
          </p>
        </div>

        {/* Religion */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Religion
          </Label>
          <Select
            value={data.religion}
            onValueChange={(val) => onChange({ religion: val })}
          >
            <SelectTrigger className="h-10 bg-background text-xs sm:text-sm">
              <SelectValue placeholder="Religion" />
            </SelectTrigger>
            <SelectContent>
              {RELIGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MARITAL STATUS CARDS */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Marital Status
        </Label>
        <div className="grid grid-cols-3 gap-2.5">
          {MARITAL_STATUSES.map((status) => {
            const isSelected = data.maritalStatus === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => onChange({ maritalStatus: status })}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all duration-200 sm:text-sm",
                  isSelected
                    ? "border-[#D3A753] bg-gradient-to-r from-[#D3A753]/20 to-[#CA617D]/10 text-foreground ring-1 ring-[#D3A753]/50"
                    : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:bg-card/90 hover:text-foreground"
                )}
              >
                {isSelected && <Check className="size-3.5 text-[#D3A753]" />}
                <span>{status}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* SECTION 3: LOCATION & NATIONALITY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Current Location <span className="text-[#CA617D]">*</span>
          </Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={data.currentLocation}
              onChange={(e) => onChange({ currentLocation: e.target.value })}
              placeholder="e.g. Thailand, United Kingdom, USA..."
              className="h-10 pl-9 text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Nationality
          </Label>
          <Input
            value={data.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
            placeholder="e.g. British, Thai, American, German..."
            className="h-10 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* SECTION 4: CONTACT INFORMATION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Email Address */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Email Address <span className="text-[#CA617D]">*</span>
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value.toLowerCase() })}
              placeholder="alex@example.com"
              className="h-10 pl-9 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* WhatsApp / Phone */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            WhatsApp / Phone <span className="text-[#CA617D]">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="w-24 shrink-0">
              <Input
                value={data.phoneCountry}
                onChange={(e) => onChange({ phoneCountry: e.target.value })}
                placeholder="+66"
                className="h-10 text-center font-mono text-xs sm:text-sm"
              />
            </div>
            <div className="relative flex-1">
              <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="tel"
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="0901234567"
                className="h-10 pl-9 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTINUATION BUTTON */}
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="btn-gradient h-10 px-6 text-xs font-semibold sm:text-sm"
        >
          Continue to Career &amp; Lifestyle →
        </Button>
      </div>
    </div>
  )
}
