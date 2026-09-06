"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Pencil,
  ChevronLeft,
  Check,
  Star,
  User,
  Briefcase,
  Heart,
  Target,
  Camera,
  Lock,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  ApplicationFormData,
  formatPartnerAgeRange,
  formatPartnerHeightRange,
} from "./types"

interface ReviewDossierProps {
  data: ApplicationFormData
  isSubmitting: boolean
  onEditChapter: (chapterNumber: number) => void
  onBackToAccordion: () => void
  onSubmitFinal: () => void
}

export function ReviewDossier({
  data,
  isSubmitting,
  onEditChapter,
  onBackToAccordion,
  onSubmitFinal,
}: ReviewDossierProps) {
  const [confirmedTruth, setConfirmedTruth] = useState(data.agreedToTruth)
  const [confirmedPrivacy, setConfirmedPrivacy] = useState(data.agreedToPrivacy)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState(false)

  const handleFinalSubmit = () => {
    setTouched(true)
    const newErrors: Record<string, string> = {}
    if (!confirmedTruth) {
      newErrors.truth =
        "Please certify that all details and photos are true and complete."
    }
    if (!confirmedPrivacy) {
      newErrors.privacy =
        "Please agree to our strict confidentiality and mutual consent policy."
    }
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error(
        "Please confirm both declaration checkboxes before submitting."
      )
      return
    }

    const photoCount = [
      data.headshotUrl,
      data.fullLengthUrl,
      data.casualLifestyleUrl,
    ].filter(Boolean).length

    if (photoCount < 3) {
      toast.error("Please upload all 3 verified photographs before submitting.")
      onEditChapter(5)
      return
    }

    onSubmitFinal()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* DOSSIER HEADER */}
      <div className="overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card via-card to-background p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Main Portrait Thumbnail */}
            <div className="relative size-18 shrink-0 overflow-hidden rounded-2xl border-2 border-[#D3A753] bg-black/60 sm:size-20">
              {data.headshotUrl ? (
                <img
                  src={data.headshotUrl}
                  alt={data.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <User className="size-8" />
                </div>
              )}
              <div className="absolute top-1 right-1 rounded-full bg-[#D3A753] p-1 text-black">
                <Star className="size-2.5 fill-black" />
              </div>
            </div>

            {/* Title & Goal */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#D3A753]">
                <ShieldCheck className="size-3 text-[#CA617D]" />
                <span>Confidential Matchmaking Dossier</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {data.prefix} {data.name || "Member Applicant"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {data.gender} · Based in {data.currentLocation} · Seeking{" "}
                <span className="font-semibold text-foreground">
                  {data.relationshipGoal}
                </span>
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBackToAccordion}
            className="h-8 gap-1.5 self-start text-xs sm:self-center"
          >
            <ChevronLeft className="size-3.5" />
            <span>Edit Form</span>
          </Button>
        </div>
      </div>

      {/* SECTION 1: IDENTITY & BACKGROUND */}
      <div className="space-y-3 overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <User className="size-4 text-[#D3A753]" />
            <h3 className="text-sm font-bold text-foreground">
              1. Identity &amp; Background
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditChapter(1)}
            className="h-7 gap-1 text-xs text-[#D3A753] hover:text-[#D3A753]"
          >
            <Pencil className="size-3" />
            <span>Edit</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
          <div>
            <span className="text-muted-foreground">Full Name:</span>
            <p className="font-semibold text-foreground">{data.name}</p>
          </div>
          {data.nickname && (
            <div>
              <span className="text-muted-foreground">Nickname:</span>
              <p className="font-semibold text-foreground">{data.nickname}</p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Gender:</span>
            <p className="font-semibold text-foreground">{data.gender}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Date of Birth:</span>
            <p className="font-semibold text-foreground">{data.dob || "—"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Marital Status:</span>
            <p className="font-semibold text-foreground">
              {data.maritalStatus}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Religion:</span>
            <p className="font-semibold text-foreground">{data.religion}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Current Location:</span>
            <p className="font-semibold text-foreground">
              {data.currentLocation}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Nationality:</span>
            <p className="font-semibold text-foreground">{data.nationality}</p>
          </div>
          <div>
            <span className="text-muted-foreground">WhatsApp / Phone:</span>
            <p className="font-mono font-semibold text-foreground">
              ({data.phoneCountry}) {data.phone}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <span className="text-muted-foreground">Email:</span>
            <p className="font-semibold text-foreground">{data.email}</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: CAREER, EDUCATION & LIFESTYLE */}
      <div className="space-y-3 overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-[#D3A753]" />
            <h3 className="text-sm font-bold text-foreground">
              2. Career, Education &amp; Lifestyle
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditChapter(2)}
            className="h-7 gap-1 text-xs text-[#D3A753] hover:text-[#D3A753]"
          >
            <Pencil className="size-3" />
            <span>Edit</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
          <div>
            <span className="text-muted-foreground">Education:</span>
            <p className="font-semibold text-foreground">{data.education}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Occupation:</span>
            <p className="font-semibold text-foreground">
              {data.occupation || "—"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Company / Industry:</span>
            <p className="font-semibold text-foreground">
              {data.company || "—"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">English Fluency:</span>
            <p className="font-semibold text-foreground">
              {data.englishFluency}%
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Thai Fluency:</span>
            <p className="font-semibold text-foreground">{data.thaiFluency}%</p>
          </div>
          <div>
            <span className="text-muted-foreground">Lifestyle Focus:</span>
            <p className="font-semibold text-foreground">{data.lifestyle}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Smoking:</span>
            <p className="font-semibold text-foreground">{data.smoking}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Alcohol:</span>
            <p className="font-semibold text-foreground">{data.drinking}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Exercise:</span>
            <p className="font-semibold text-foreground">{data.exercise}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Owns Property:</span>
            <p className="font-semibold text-foreground">
              {data.ownProperty === true || data.ownProperty === "Yes"
                ? "Yes"
                : "No"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Owns Business:</span>
            <p className="font-semibold text-foreground">
              {data.ownBusiness === true || data.ownBusiness === "Yes"
                ? "Yes"
                : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: PERSONALITY, VALUES & HOBBIES */}
      <div className="space-y-3 overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="size-4 text-[#CA617D]" />
            <h3 className="text-sm font-bold text-foreground">
              3. Personality, Values &amp; Family
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditChapter(3)}
            className="h-7 gap-1 text-xs text-[#D3A753] hover:text-[#D3A753]"
          >
            <Pencil className="size-3" />
            <span>Edit</span>
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Children:</span>
              <p className="font-semibold text-foreground">
                {data.hasChildren === "Yes"
                  ? `${data.childrenCount} Children`
                  : "None"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Future Children:</span>
              <p className="font-semibold text-foreground">
                {data.futureChildren}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Family Importance:</span>
              <p className="font-semibold text-foreground">
                {data.familyImportance}
              </p>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground">Personality Traits:</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {data.personality.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[#D3A753]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#D3A753]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-muted-foreground">Core Values:</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {data.values.map((v) => (
                <span
                  key={v}
                  className="rounded-full bg-[#CA617D]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#CA617D]"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-muted-foreground">
              Hobbies &amp; Interests:
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {data.interests.map((h) => {
                const label =
                  h === "Other" && data.otherInterest
                    ? `Other (${data.otherInterest})`
                    : h
                return (
                  <span
                    key={h}
                    className="rounded-full border border-border/80 bg-background/50 px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          </div>

          {Array.isArray(data.travelDestinations) &&
            data.travelDestinations.some((d) => d && d.trim().length > 0) && (
              <div>
                <span className="text-muted-foreground">
                  Favourite Travel Destinations:
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {data.travelDestinations
                    .filter((d) => d && d.trim().length > 0)
                    .map((dest, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#D3A753]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#D3A753]"
                      >
                        #{idx + 1} {dest}
                      </span>
                    ))}
                </div>
              </div>
            )}

          {data.weekendActivity && (
            <div>
              <span className="text-muted-foreground">
                Favourite Way to Spend a Weekend:
              </span>
              <p className="mt-1 rounded-xl bg-background/50 p-2.5 text-foreground">
                {data.weekendActivity}
              </p>
            </div>
          )}

          {data.about && (
            <div>
              <span className="text-muted-foreground">Personal Bio:</span>
              <p className="mt-1 rounded-xl bg-background/50 p-3 text-foreground italic">
                &ldquo;{data.about}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: IDEAL PARTNER CRITERIA */}
      <div className="space-y-3 overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-[#D3A753]" />
            <h3 className="text-sm font-bold text-foreground">
              4. Ideal Life Partner Criteria
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditChapter(4)}
            className="h-7 gap-1 text-xs text-[#D3A753] hover:text-[#D3A753]"
          >
            <Pencil className="size-3" />
            <span>Edit</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
          <div>
            <span className="text-muted-foreground">Relationship Goal:</span>
            <p className="font-semibold text-[#D3A753]">
              {data.relationshipGoal}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Desired Age:</span>
            <p className="font-semibold text-foreground">
              {formatPartnerAgeRange(
                data.idealPartnerMinAge,
                data.idealPartnerMaxAge
              )}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Desired Height:</span>
            <p className="font-semibold text-foreground">
              {formatPartnerHeightRange(
                data.idealPartnerMinHeight,
                data.idealPartnerMaxHeight
              )}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Relocation:</span>
            <p className="font-semibold text-foreground">{data.relocate}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Timeline:</span>
            <p className="font-semibold text-foreground">{data.settleDown}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Preferred Location:</span>
            <p className="font-semibold text-foreground">
              {data.idealPartnerLocation || "Any"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">
              Preferred Nationality:
            </span>
            <p className="font-semibold text-foreground">
              {data.idealPartnerNationality || "Any"}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: PHOTOGRAPHS */}
      <div className="space-y-3 overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="size-4 text-[#D3A753]" />
            <h3 className="text-sm font-bold text-foreground">
              5. Photographs Uploaded (3 Verified)
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditChapter(5)}
            className="h-7 gap-1 text-xs text-[#D3A753] hover:text-[#D3A753]"
          >
            <Pencil className="size-3" />
            <span>Edit</span>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1 text-center">
            <span className="text-[10px] text-muted-foreground">
              1:1 Headshot
            </span>
            <div className="aspect-square w-full overflow-hidden rounded-xl border border-[#D3A753]/40 bg-black/40">
              {data.headshotUrl ? (
                <img
                  src={data.headshotUrl}
                  alt="Headshot"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                  None
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 text-center">
            <span className="text-[10px] text-muted-foreground">
              3:4 Full Body
            </span>
            <div className="aspect-square w-full overflow-hidden rounded-xl border border-border bg-black/40">
              {data.fullLengthUrl ? (
                <img
                  src={data.fullLengthUrl}
                  alt="Full Length"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                  None
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 text-center">
            <span className="text-[10px] text-muted-foreground">
              4:3 Lifestyle
            </span>
            <div className="aspect-square w-full overflow-hidden rounded-xl border border-border bg-black/40">
              {data.casualLifestyleUrl ? (
                <img
                  src={data.casualLifestyleUrl}
                  alt="Lifestyle"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                  None
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FINAL DECLARATION & SUBMISSION */}
      <div className="space-y-4 rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card via-card to-background p-6 shadow-2xl">
        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={confirmedTruth}
                onChange={(e) => {
                  setConfirmedTruth(e.target.checked)
                  if (touched && e.target.checked) {
                    setErrors((prev) => {
                      const next = { ...prev }
                      delete next.truth
                      return next
                    })
                  }
                }}
                className="mt-0.5 size-4 rounded-sm border-border accent-[#D3A753]"
              />
              <span>
                I certify that all details and photos in this application are
                true, authentic, and complete.
              </span>
            </label>
            {touched && errors.truth && (
              <p className="flex items-center gap-1 pl-6 text-[11px] font-medium text-destructive">
                <AlertCircle className="size-3" />
                <span>{errors.truth}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={confirmedPrivacy}
                onChange={(e) => {
                  setConfirmedPrivacy(e.target.checked)
                  if (touched && e.target.checked) {
                    setErrors((prev) => {
                      const next = { ...prev }
                      delete next.privacy
                      return next
                    })
                  }
                }}
                className="mt-0.5 size-4 rounded-sm border-border accent-[#D3A753]"
              />
              <span>
                I understand that Thai Soulmate operates on strict
                confidentiality and mutual consent for all member introductions.
              </span>
            </label>
            {touched && errors.privacy && (
              <p className="flex items-center gap-1 pl-6 text-[11px] font-medium text-destructive">
                <AlertCircle className="size-3" />
                <span>{errors.privacy}</span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            size="lg"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="btn-gradient h-12 w-full gap-2 text-sm font-semibold shadow-xl transition-all hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                <span>Submitting Your Confidential Application...</span>
              </>
            ) : (
              <>
                <Check className="size-4" />
                <span>Confirm &amp; Submit Application</span>
              </>
            )}
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Lock className="size-3 text-[#D3A753]" />
            <span>
              100% Discreet · Handled personally by your dedicated matchmaking
              team
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
