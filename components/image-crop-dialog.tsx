"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotateCw, ZoomIn, Check, RotateCcw, Image as ImageIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string | null
  aspect?: number // e.g. 1 for 1:1, 3/4 (0.75) for 3:4, 4/3 (1.333) for 4:3
  aspectLabel?: string // e.g. "1:1 (Headshot)", "3:4 (Full Length)", "4:3 (Lifestyle)"
  slotName?: string
  onCropComplete: (file: File, previewUrl: string) => void
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  aspect = 1,
  aspectLabel,
  slotName = "photo",
  onCropComplete,
}: ImageCropDialogProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate aperture (crop frame) size based on aspect ratio
  // Standard container inside dialog: ~320-380px wide
  const maxBoxSize = 320
  let apertureWidth = maxBoxSize
  let apertureHeight = maxBoxSize

  if (aspect >= 1) {
    // Landscape or square
    apertureWidth = maxBoxSize
    apertureHeight = Math.round(maxBoxSize / aspect)
  } else {
    // Portrait (e.g. 3:4)
    apertureHeight = maxBoxSize
    apertureWidth = Math.round(maxBoxSize * aspect)
  }

  // Reset controls when a new image or dialog opens
  useEffect(() => {
    if (open) {
      setZoom(1)
      setRotation(0)
      setPan({ x: 0, y: 0 })
      setIsProcessing(false)
    }
  }, [open, imageSrc])

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
  }

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setPan({ x: 0, y: 0 })
  }

  // Final crop & optimization execution
  const handleSaveCrop = async () => {
    if (!imageSrc || !imageRef.current) return
    setIsProcessing(true)

    try {
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = imageSrc
      })

      // Determine optimal target dimensions based on aspect ratio
      let targetWidth = 1000
      let targetHeight = 1000

      if (aspect === 1) {
        targetWidth = 1000
        targetHeight = 1000
      } else if (aspect < 1) {
        // Vertical (e.g. 3:4)
        targetWidth = 900
        targetHeight = Math.round(900 / aspect) // 1200
      } else {
        // Horizontal (e.g. 4:3)
        targetWidth = 1200
        targetHeight = Math.round(1200 / aspect) // 900
      }

      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext("2d")

      if (!ctx) throw new Error("Could not initialize canvas context")

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      // Scale factor from onscreen preview aperture to output canvas
      const scaleFactor = targetWidth / apertureWidth

      // Transform matrix for canvas matching onscreen preview
      ctx.translate(targetWidth / 2, targetHeight / 2)
      ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor)
      ctx.rotate((rotation * Math.PI) / 180)

      // Base display scale so image initially covers the aperture
      const baseScaleX = apertureWidth / img.naturalWidth
      const baseScaleY = apertureHeight / img.naturalHeight
      const baseFitScale = Math.max(baseScaleX, baseScaleY)

      const drawWidth = img.naturalWidth * baseFitScale * scaleFactor * zoom
      const drawHeight = img.naturalHeight * baseFitScale * scaleFactor * zoom

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)

      // Export as optimized WebP (with fallback to JPEG)
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else {
              // Fallback to JPEG if WebP unsupported
              canvas.toBlob((jb) => resolve(jb), "image/jpeg", 0.85)
            }
          },
          "image/webp",
          0.85
        )
      })

      if (!blob) throw new Error("Failed to encode cropped image")

      const ext = blob.type.includes("webp") ? "webp" : "jpg"
      const file = new File([blob], `${slotName}-${Date.now()}.${ext}`, {
        type: blob.type,
      })
      const previewUrl = URL.createObjectURL(blob)

      onCropComplete(file, previewUrl)
      onOpenChange(false)
    } catch (err) {
      console.error("Error saving cropped image:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Compute base fit dimensions for onscreen preview
  const baseScaleX = imageSize.width ? apertureWidth / imageSize.width : 1
  const baseScaleY = imageSize.height ? apertureHeight / imageSize.height : 1
  const baseFitScale = Math.max(baseScaleX, baseScaleY)
  const displayWidth = imageSize.width * baseFitScale
  const displayHeight = imageSize.height * baseFitScale

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[#D3A753]/30 bg-card/95 p-6 backdrop-blur-xl sm:max-w-lg">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
            <ImageIcon className="size-3.5 text-[#D3A753]" />
            <span>Photo Adjustment &amp; Optimization</span>
          </div>
          <DialogTitle className="text-xl font-bold">
            Crop &amp; Frame Photo
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {aspectLabel || `Target ratio: ${aspect.toFixed(2)}`} · Drag to
            reposition or pinch to zoom.
          </p>
        </DialogHeader>

        {/* CROP VIEWPORT CONTAINER */}
        <div className="flex flex-col items-center justify-center py-2">
          <div
            ref={containerRef}
            className="relative flex items-center justify-center overflow-hidden rounded-2xl border-2 border-[#D3A753]/60 bg-black/80 shadow-2xl"
            style={{
              width: `${apertureWidth}px`,
              height: `${apertureHeight}px`,
            }}
          >
            {/* Interactive Image Layer */}
            {imageSrc && (
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="absolute inset-0 flex cursor-grab items-center justify-center active:cursor-grabbing"
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  draggable={false}
                  className="pointer-events-none select-none"
                  style={{
                    width: `${displayWidth || apertureWidth}px`,
                    height: `${displayHeight || apertureHeight}px`,
                    maxWidth: "none",
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.15s ease-out",
                  }}
                />
              </div>
            )}

            {/* Golden Rule-of-Thirds Grid Overlay */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-[#D3A753]/25" />
              <div className="border-r border-b border-[#D3A753]/25" />
              <div className="border-b border-[#D3A753]/25" />
              <div className="border-r border-b border-[#D3A753]/25" />
              <div className="border-r border-b border-[#D3A753]/25" />
              <div className="border-b border-[#D3A753]/25" />
              <div className="border-r border-[#D3A753]/25" />
              <div className="border-r border-[#D3A753]/25" />
              <div />
            </div>

            {/* Subtle Corner Accents */}
            <div className="pointer-events-none absolute top-2 left-2 size-3 border-t-2 border-l-2 border-[#D3A753]" />
            <div className="pointer-events-none absolute top-2 right-2 size-3 border-t-2 border-r-2 border-[#D3A753]" />
            <div className="pointer-events-none absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-[#D3A753]" />
            <div className="pointer-events-none absolute right-2 bottom-2 size-3 border-r-2 border-b-2 border-[#D3A753]" />
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card/60 p-3.5">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="size-3 text-[#D3A753]" />
                <span>Zoom Scale</span>
              </span>
              <span className="font-mono text-[11px] font-semibold text-foreground">
                {zoom.toFixed(1)}x
              </span>
            </div>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={[zoom]}
              onValueChange={(val) => setZoom(val[0])}
              className="py-1"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="h-8 flex-1 gap-1.5 text-xs font-medium"
            >
              <RotateCw className="size-3.5 text-[#D3A753]" />
              <span>Rotate 90° ({rotation}°)</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="h-9 text-xs sm:text-sm"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSaveCrop}
            disabled={isProcessing || !imageSrc}
            className="btn-gradient h-9 gap-1.5 text-xs font-semibold sm:text-sm"
          >
            {isProcessing ? (
              <>
                <Spinner className="size-3.5" />
                <span>Optimizing &amp; Saving...</span>
              </>
            ) : (
              <>
                <Check className="size-4" />
                <span>Save &amp; Optimize Photo</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
