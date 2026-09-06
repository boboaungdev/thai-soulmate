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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
  const [uploadingSlots, setUploadingSlots] = useState<
    Record<PhotoSlot, boolean>
  >({
    headshot: false,
    fullLength: false,
    casualLifestyle: false,
  })
  const rawPhotosRef = useRef<Record<PhotoSlot, string | null>>({
    headshot: null,
    fullLength: null,
    casualLifestyle: null,
  })

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
    rawPhotosRef.current[slot] = objectUrl
    setSelectedRawImage(objectUrl)
    setActiveSlot(slot)
    setActiveAspect(aspect)
    setActiveAspectLabel(label)
    setCropDialogOpen(true)

    // Reset input value so same file can be re-selected if needed
    e.target.value = ""
  }

  const uploadedCount = [
    data.headshotUrl,
    data.fullLengthUrl,
    data.casualLifestyleUrl,
  ].filter(Boolean).length

  const handleCropComplete = async (file: File, previewUrl: string) => {
    if (!activeSlot) return
    const slot = activeSlot

    // 1. Immediately show local preview
    const localUpdates: Partial<ApplicationFormData> = {}
    if (slot === "headshot") localUpdates.headshotUrl = previewUrl
    else if (slot === "fullLength") localUpdates.fullLengthUrl = previewUrl
    else if (slot === "casualLifestyle")
      localUpdates.casualLifestyleUrl = previewUrl
    onChange(localUpdates)

    // 2. Upload to Cloudflare R2
    setUploadingSlots((prev) => ({ ...prev, [slot]: true }))

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const emailParam = encodeURIComponent(data.email || "applicant")
      const res = await fetch(
        `/api/upload?email=${emailParam}&type=${slot}&path=applications/photos`,
        {
          method: "POST",
          body: formDataUpload,
        }
      )

      const json = await res.json()

      if (res.ok && json.url) {
        // 3. Save permanent Cloudflare R2 URL into form data
        const r2Updates: Partial<ApplicationFormData> = {}
        if (slot === "headshot") r2Updates.headshotUrl = json.url
        else if (slot === "fullLength") r2Updates.fullLengthUrl = json.url
        else if (slot === "casualLifestyle")
          r2Updates.casualLifestyleUrl = json.url
        onChange(r2Updates)

        toast.success("Photo saved to Cloudflare R2.")
      } else {
        throw new Error(json.error || "Upload failed")
      }
    } catch (err) {
      console.error("R2 upload error:", err)
      toast.error("Failed to upload photo to Cloudflare R2. Please try again.")
    } finally {
      setUploadingSlots((prev) => ({ ...prev, [slot]: false }))
    }

    if (touched) {
      const nextHeadshot = slot === "headshot" ? previewUrl : data.headshotUrl
      const nextFull = slot === "fullLength" ? previewUrl : data.fullLengthUrl
      const nextLifestyle =
        slot === "casualLifestyle" ? previewUrl : data.casualLifestyleUrl
      const missing: string[] = []
      if (!nextHeadshot) missing.push("1. Primary Headshot")
      if (!nextFull) missing.push("2. Full Length / Posture")
      if (!nextLifestyle) missing.push("3. Lifestyle / Social")

      setErrors((prev) => {
        const next = { ...prev }
        if (missing.length === 0) {
          delete next.photos
        } else {
          next.photos = `Please upload all 3 verified photographs (${3 - missing.length}/3 uploaded). Missing: ${missing.join(", ")}.`
        }
        return next
      })
    }
  }

  const handleRemovePhoto = (slot: PhotoSlot) => {
    rawPhotosRef.current[slot] = null
    const updates: Partial<ApplicationFormData> = {}
    if (slot === "headshot") updates.headshotUrl = null
    else if (slot === "fullLength") updates.fullLengthUrl = null
    else if (slot === "casualLifestyle") updates.casualLifestyleUrl = null
    onChange(updates)

    if (touched) {
      const nextHeadshot = slot === "headshot" ? null : data.headshotUrl
      const nextFull = slot === "fullLength" ? null : data.fullLengthUrl
      const nextLifestyle =
        slot === "casualLifestyle" ? null : data.casualLifestyleUrl
      const missing: string[] = []
      if (!nextHeadshot) missing.push("1. Primary Headshot")
      if (!nextFull) missing.push("2. Full Length / Posture")
      if (!nextLifestyle) missing.push("3. Lifestyle / Social")

      setErrors((prev) => ({
        ...prev,
        photos: `Please upload all 3 verified photographs (${3 - missing.length}/3 uploaded). Missing: ${missing.join(", ")}.`,
      }))
    }
  }

  const openRecrop = (
    url: string,
    slot: PhotoSlot,
    aspect: number,
    label: string
  ) => {
    const source = rawPhotosRef.current[slot] || url
    setSelectedRawImage(source)
    setActiveSlot(slot)
    setActiveAspect(aspect)
    setActiveAspectLabel(label)
    setCropDialogOpen(true)
  }

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const missing: string[] = []
    if (!data.headshotUrl) missing.push("1. Primary Headshot")
    if (!data.fullLengthUrl) missing.push("2. Full Length / Posture")
    if (!data.casualLifestyleUrl) missing.push("3. Lifestyle / Social")

    if (missing.length > 0) {
      newErrors.photos = `Please upload all 3 verified photographs (${3 - missing.length}/3 uploaded). Missing: ${missing.join(", ")}.`
    }
    if (!data.agreedToTruth) {
      newErrors.agreedToTruth = "Please certify the accuracy of your details."
    }
    if (!data.agreedToPrivacy) {
      newErrors.agreedToPrivacy =
        "Please agree to the privacy and confidentiality policy."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isAnyUploading =
    uploadingSlots.headshot ||
    uploadingSlots.fullLength ||
    uploadingSlots.casualLifestyle

  const handleReviewClick = () => {
    if (isAnyUploading) {
      toast.info(
        "Please wait for your photos to finish uploading to Cloudflare R2."
      )
      return
    }
    setTouched(true)
    const isValid = validate()
    if (!isValid) {
      toast.error(
        "Please upload all 3 verified photographs and accept both declarations."
      )
      return
    }

    const hasBlobUrl = [
      data.headshotUrl,
      data.fullLengthUrl,
      data.casualLifestyleUrl,
    ].some((u) => u && u.startsWith("blob:"))

    if (hasBlobUrl) {
      toast.error(
        "Photos are still uploading to Cloudflare R2. Please wait a moment."
      )
      return
    }

    onReview()
  }

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION HEADER & GUIDELINES */}
      <div className="space-y-2 rounded-2xl border border-[#D3A753]/30 bg-[#D3A753]/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
            <Camera className="size-4" />
            <span>Profile Photography Guidelines</span>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
              uploadedCount === 3
                ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-500"
                : "border border-[#D3A753]/30 bg-[#D3A753]/15 text-[#D3A753]"
            )}
          >
            {uploadedCount}/3 Photos Uploaded
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          All 3 verified photographs are strictly required to proceed with your
          application (Headshot, Full Length Posture, and Lifestyle/Casual). We
          recommend natural, well-lit photos with a warm smile. Please avoid
          sunglasses, heavy filters, or group photos where you cannot be
          identified.
        </p>
      </div>

      {/* 3 PURPOSE-BUILT PHOTO CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* SLOT 1: HEADSHOT (1:1) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Star className="size-3 fill-[#D3A753] text-[#D3A753]" />
              <span>
                1. Primary Headshot <span className="text-[#CA617D]">*</span>
              </span>
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
                : touched && !data.headshotUrl
                  ? "border-destructive bg-card/40 ring-1 ring-destructive"
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
                    onClick={() => handleRemovePhoto("headshot")}
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
                className="flex size-full cursor-pointer flex-col items-center justify-center gap-2 p-4 text-center"
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

            {uploadingSlots.headshot && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/75 backdrop-blur-xs">
                <Spinner className="size-6 text-[#D3A753]" />
                <span className="text-[11px] font-semibold text-[#D3A753]">
                  Saving...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SLOT 2: FULL LENGTH (3:4) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              2. Full Length / Posture <span className="text-[#CA617D]">*</span>
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
                : touched && !data.fullLengthUrl
                  ? "border-destructive bg-card/40 ring-1 ring-destructive"
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
                    onClick={() => handleRemovePhoto("fullLength")}
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
                className="flex size-full cursor-pointer flex-col items-center justify-center gap-2 p-4 text-center"
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

            {uploadingSlots.fullLength && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/75 backdrop-blur-xs">
                <Spinner className="size-6 text-[#D3A753]" />
                <span className="text-[11px] font-semibold text-[#D3A753]">
                  Saving...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SLOT 3: LIFESTYLE / CASUAL (4:3) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              3. Lifestyle / Social <span className="text-[#CA617D]">*</span>
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
                : touched && !data.casualLifestyleUrl
                  ? "border-destructive bg-card/40 ring-1 ring-destructive"
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
                    onClick={() => handleRemovePhoto("casualLifestyle")}
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
                className="flex size-full cursor-pointer flex-col items-center justify-center gap-2 p-4 text-center"
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
                handleFileSelect(e, "casualLifestyle", 4 / 3, "4:3 (Lifestyle)")
              }
            />

            {uploadingSlots.casualLifestyle && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/75 backdrop-blur-xs">
                <Spinner className="size-6 text-[#D3A753]" />
                <span className="text-[11px] font-semibold text-[#D3A753]">
                  Saving...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {touched && errors.photos && (
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
          <AlertCircle className="size-3" />
          <span>{errors.photos}</span>
        </p>
      )}

      {/* SECTION: TRUTH & PRIVACY DECLARATION */}
      <div className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
          <FileCheck className="size-4" />
          <span>Integrity &amp; Confidentiality Affirmation</span>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="space-y-1">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={data.agreedToTruth}
                onChange={(e) => {
                  onChange({ agreedToTruth: e.target.checked })
                  if (touched && e.target.checked) {
                    setErrors((prev) => {
                      const next = { ...prev }
                      delete next.agreedToTruth
                      return next
                    })
                  }
                }}
                className="mt-0.5 size-4 rounded-sm border-border accent-[#D3A753]"
              />
              <span>
                I certify that all personal information and photographs provided
                are accurate, recent, and represent my genuine identity.
              </span>
            </label>
            {touched && errors.agreedToTruth && (
              <p className="flex items-center gap-1 pl-6 text-[11px] font-medium text-destructive">
                <AlertCircle className="size-3" />
                <span>{errors.agreedToTruth}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={data.agreedToPrivacy}
                onChange={(e) => {
                  onChange({ agreedToPrivacy: e.target.checked })
                  if (touched && e.target.checked) {
                    setErrors((prev) => {
                      const next = { ...prev }
                      delete next.agreedToPrivacy
                      return next
                    })
                  }
                }}
                className="mt-0.5 size-4 rounded-sm border-border accent-[#D3A753]"
              />
              <span>
                I agree to Thai Soulmate&apos;s strict privacy and
                confidentiality policy, understanding that introductions are
                conducted with mutual consent and discretion.
              </span>
            </label>
            {touched && errors.agreedToPrivacy && (
              <p className="flex items-center gap-1 pl-6 text-[11px] font-medium text-destructive">
                <AlertCircle className="size-3" />
                <span>{errors.agreedToPrivacy}</span>
              </p>
            )}
          </div>
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
          <span>Back to Partner Criteria</span>
        </Button>

        <Button
          type="button"
          disabled={isAnyUploading}
          onClick={handleReviewClick}
          className="btn-gradient inline-flex h-10 items-center gap-1.5 px-6 text-xs font-semibold shadow-md transition-all hover:scale-[1.01] sm:text-sm"
        >
          {isAnyUploading ? (
            <>
              <Spinner className="size-4" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Submit &amp; Review Application</span>
              <ChevronRight className="size-4" />
            </>
          )}
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
