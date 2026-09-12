// components/avatar-upload-input.tsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Camera, X } from "lucide-react"

interface AvatarUploadInputProps {
  value?: string | null
  onChange: (file: File | null) => void
  defaultFallback?: string
  className?: string
  disabled?: boolean
}

export function AvatarUploadInput({
  value,
  onChange,
  defaultFallback = "TS",
  className,
  disabled,
}: AvatarUploadInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreviewUrl(value || null)
  }, [value])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange(file)
    } else {
      setPreviewUrl(value || null)
      onChange(null)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the file dialog
    setPreviewUrl(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`group relative ${className}`} onClick={handleClick}>
        <div className="relative cursor-pointer overflow-visible rounded-full">
          <Avatar className="size-24">
            <AvatarImage src={previewUrl ?? undefined} alt="Avatar" />
            <AvatarFallback>{defaultFallback}</AvatarFallback>
          </Avatar>
          {!disabled && (
            <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        {previewUrl && !disabled && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-destructive-foreground absolute -top-2 -right-2 z-10 rounded-full bg-destructive p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        accept="image/*"
      />
    </div>
  )
}
