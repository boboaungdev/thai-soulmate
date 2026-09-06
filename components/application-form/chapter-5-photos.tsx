"use client"

import React, { useState, useRef } from "react"
import {
  Upload,
  Camera,
  Star,
  Check,
  Crop,
  Trash2,
  ShieldCheck,
  Sparkles,
  FileCheck,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ImageCropDialog } from "@/components/image-crop-dialog"
import { ApplicationFormData } from "./types"
import { cn } from "@/lib/utils"

interface Chapter5Props {
  data: ApplicationFormData
  onChange: (updates: Partial<ApplicationFormData>) => void
  onReview: () => void
  onBack: () => void
}

type PhotoSlot = "headshot" | "fullLength" | "casualLifestyle"

export function Chapter5Photos({
  data,
  onChange,
  onReview,
  onBack,
}: Chapter5Props) {
  const [activeSlot, setActiveSlot] = useState<PhotoSlot | null>(null)
  const [activeAspect, setActiveAspect] = useState<number>(1)
  const [activeAspectLabel, setActiveAspectLabel] = useState<string>("")
  const [selectedRawImage, setSelectedRawImage] = useState<string | null>(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)

  const headshotInputRef = useRef<HTMLInputElement>(null)
  const fullLengthInputRef = useRef<HTMLInputElement>(null)
  const lifestyleInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: PhotoSlot,
    aspect: number,
    label: string
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setSelectedRawImage(objectUrl)
    setActiveSlot(slot)
    setActiveAspect(aspect)
    setActiveAspectLabel(label)
    setCropDialogOpen(true)

    // Reset input value so same file can be re-selected if needed
    e.target.value = ""
  }

  const handleCropComplete = (file: File, previewUrl: string) => {
    if (activeSlot === "headshot") {
      onChange({ headshotUrl: previewUrl })
    } else if (activeSlot === "fullLength") {
      onChange({ fullLengthUrl: previewUrl })
    } else if (activeSlot === "casualLifestyle") {
      onChange({ casualLifestyleUrl: previewUrl })
    }
  }

  const openRecrop = (url: string, slot: PhotoSlot, aspect: number, label: string) => {
    setSelectedRawImage(url)
    setActiveSlot(slot)
    setActiveAspect(aspect)
    setActiveAspectLabel(label)
    setCropDialogOpen(true)
  }

  const hasAtLeastOnePhoto = Boolean(data.headshotUrl || data.fullLengthUrl)
  const isValid = hasAtLeastOnePhoto && data.agreedToTruth && data.agreedToPrivacy

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION HEADER & GUIDELINES */}
      <div className="rounded-2xl border border-[#D3A753]/30 bg-[#D3A753]/5 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
          <Camera className="size-4" />
          <span>Profile Photography Guidelines</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Real human introductions require verified, clear photographs. We
          recommend well-lit photos with a warm smile. Please avoid sunglasses,
          heavy filters, or group photos where you cannot be identified.
        </p>
      </div>

      {/* 3 PURPOSE-BUILT PHOTO CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* SLOT 1: HEADSHOT (1:1) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Star className="size-3 text-[#D3A753] fill-[#D3A753]" />
              <span>1. Primary Headshot</span>
            </span>
            <span className="rounded-md border border-[#D3A753]/30 bg-[#D3A753]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#D3A753]">
              1:1
            </span>
          </div>

          <div
            className={cn(
              "relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200",
              data.headshotUrl
                ? "border-[#D3A753] bg-black/60 shadow-md"
                : "border-border/70 bg-card/40 hover:border-[#D3A753]/60 hover:bg-card/70"
            )}
          >
            {data.headshotUrl ? (
              <div className="group relative size-full">
                <img
                  src={data.headshotUrl}
                  alt="Headshot"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      openRecrop(
                        data.headshotUrl!,
                        "headshot",
                        1,
                        "1:1 (Headshot)"
                      )
                    }
                    className="h-7 gap-1 text-xs"
                  >
                    <Crop className="size-3 text-[#D3A753]" />
                    <span>Adjust</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => onChange({ headshotUrl: null })}
                    className="h-7 gap-1 text-xs"
                  >
                    <Trash2 className="size-3" />
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => headshotInputRef.current?.click()}
                className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-[#D3A753]/10 text-[#D3A753]">
                  <Upload className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Upload Headshot
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Face &amp; smile · Square
                  </p>
                </div>
              </button>
            )}

            <input
              ref={headshotInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleFileSelect(e, "headshot", 1, "1:1 (Headshot)")
              }
            />
          </div>
        </div>

        {/* SLOT 2: FULL LENGTH (3:4) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              2. Full Length / Posture
            </span>
            <span className="rounded-md border border-[#D3A753]/30 bg-[#D3A753]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#D3A753]">
              3:4
            </span>
          </div>

          <div
            className={cn(
              "relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200",
              data.fullLengthUrl
                ? "border-[#D3A753] bg-black/60 shadow-md"
                : "border-border/70 bg-card/40 hover:border-[#D3A753]/60 hover:bg-card/70"
            )}
          >
            {data.fullLengthUrl ? (
              <div className="group relative size-full">
                <img
                  src={data.fullLengthUrl}
                  alt="Full Length"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      openRecrop(
                        data.fullLengthUrl!,
                        "fullLength",
                        3 / 4,
                        "3:4 (Full Length)"
                      )
                    }
                    className="h-7 gap-1 text-xs"
                  >
                    <Crop className="size-3 text-[#D3A753]" />
                    <span>Adjust</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => onChange({ fullLengthUrl: null })}
                    className="h-7 gap-1 text-xs"
                  >
                    <Trash2 className="size-3" />
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fullLengthInputRef.current?.click()}
                className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-[#D3A753]/10 text-[#D3A753]">
                  <Upload className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Upload Full Length
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Standing or posture
                  </p>
                </div>
              </button>
            )}

            <input
              ref={fullLengthInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleFileSelect(e, "fullLength", 3 / 4, "3:4 (Full Length)")
              }
            />
          </div>
        </div>

        {/* SLOT 3: LIFESTYLE / CASUAL (4:3) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              3. Lifestyle / Social
            </span>
            <span className="rounded-md border border-[#D3A753]/30 bg-[#D3A753]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#D3A753]">
              4:3
            </span>
          </div>

          <div
            className={cn(
              "relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200",
              data.casualLifestyleUrl
                ? "border-[#D3A753] bg-black/60 shadow-md"
                : "border-border/70 bg-card/40 hover:border-[#D3A753]/60 hover:bg-card/70"
            )}
          >
            {data.casualLifestyleUrl ? (
              <div className="group relative size-full">
                <img
                  src={data.casualLifestyleUrl}
                  alt="Lifestyle"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      openRecrop(
                        data.casualLifestyleUrl!,
                        "casualLifestyle",
                        4 / 3,
                        "4:3 (Lifestyle)"
                      )
                    }
                    className="h-7 gap-1 text-xs"
                  >
                    <Crop className="size-3 text-[#D3A753]" />
                    <span>Adjust</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => onChange({ casualLifestyleUrl: null })}
                    className="h-7 gap-1 text-xs"
                  >
                    <Trash2 className="size-3" />
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => lifestyleInputRef.current?.click()}
                className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-[#D3A753]/10 text-[#D3A753]">
                  <Upload className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Upload Lifestyle
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Travel, dining or casual
                  </p>
                </div>
              </button>
            )}

            <input
              ref={lifestyleInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleFileSelect(
                  e,
                  "casualLifestyle",
                  4 / 3,
                  "4:3 (Lifestyle)"
                )
              }
            />
          </div>
        </div>
      </div>

      {/* SECTION: TRUTH & PRIVACY DECLARATION */}
      <div className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
          <FileCheck className="size-4" />
          <span>Integrity &amp; Confidentiality Affirmation</span>
        </div>

        <div className="space-y-2.5 pt-1">
          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={data.agreedToTruth}
              onChange={(e) => onChange({ agreedToTruth: e.target.checked })}
              className="mt-0.5 size-4 rounded-sm border-border accent-[#D3A753]"
            />
            <span>
              I certify that all personal information and photographs provided
              are accurate, recent, and represent my genuine identity.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={data.agreedToPrivacy}
              onChange={(e) => onChange({ agreedToPrivacy: e.target.checked })}
              className="mt-0.5 size-4 rounded-sm border-border accent-[#D3A753]"
            />
            <span>
              I agree to Thai Soulmate&apos;s strict privacy and confidentiality
              policy, understanding that introductions are conducted with mutual
              consent and discretion.
            </span>
          </label>
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
          ← Back to Partner Criteria
        </Button>

        <Button
          type="button"
          onClick={onReview}
          disabled={!isValid}
          className="btn-gradient h-10 px-6 text-xs font-semibold sm:text-sm"
        >
          Review My Application →
        </Button>
      </div>

      {/* NATIVE CROP DIALOG */}
      <ImageCropDialog
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}
        imageSrc={selectedRawImage}
        aspect={activeAspect}
        aspectLabel={activeAspectLabel}
        slotName={activeSlot || "photo"}
        onCropComplete={handleCropComplete}
      />
    </div>
  )
}
