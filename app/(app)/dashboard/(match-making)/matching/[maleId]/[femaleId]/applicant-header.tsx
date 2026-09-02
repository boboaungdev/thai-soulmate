"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ApplicationForm } from "@/types/application-form"
import { Copy, Home, MapPin, Mars, Venus } from "lucide-react"
import { toast } from "sonner"

const calculateAge = (dob: string | Date) => {
  if (!dob) return 0
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function ApplicantHeader({ applicant }: { applicant: ApplicationForm }) {
  const age = calculateAge(applicant.personalDetails?.dob)
  const idToCopy = String(applicant.customId).padStart(4, "0")
  const isMale = applicant.personalDetails?.gender === "Male"

  const handleCopyId = () => {
    navigator.clipboard.writeText(idToCopy).then(
      () => toast.success("ID copied to clipboard!"),
      () => toast.error("Failed to copy ID.")
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative">
        <Avatar
          className={`h-32 w-32 border-[3px] shadow-sm ${
            isMale
              ? "border-[#D3A753] ring-2 ring-[#D3A753]/30"
              : "border-pink-400 ring-2 ring-pink-400/30"
          }`}
        >
          <AvatarImage
            src={applicant.photos?.headshot}
            alt={applicant.personalDetails?.name}
            className="object-cover"
          />
          <AvatarFallback className="text-xl font-bold">
            {applicant.personalDetails?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span
          className={`absolute right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-background ${
            isMale ? "bg-[#D3A753]" : "bg-pink-500"
          }`}
        >
          {isMale ? (
            <Mars className="h-4 w-4" />
          ) : (
            <Venus className="h-4 w-4" />
          )}
        </span>
      </div>
      <div>
        <h2
          className={`text-2xl font-bold ${
            isMale
              ? "text-[#b48735] dark:text-[#E5BE6C]"
              : "text-pink-600 dark:text-pink-400"
          }`}
        >
          {applicant.personalDetails?.prefix
            ? `${applicant.personalDetails.prefix} `
            : ""}
          {applicant.personalDetails?.name}{" "}
          {applicant.personalDetails?.nickname &&
            `(${applicant.personalDetails?.nickname})`}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-sm">
          <div
            className="flex cursor-pointer items-center gap-1 font-mono text-muted-foreground hover:text-foreground"
            onClick={handleCopyId}
            title="Click to copy ID"
          >
            <span>ID: {idToCopy}</span>
            <Copy className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                isMale
                  ? "bg-[#D3A753]/15 text-[#9E7321] dark:text-[#E5BE6C]"
                  : "bg-pink-500/15 text-pink-700 dark:text-pink-300"
              }`}
            >
              {isMale ? (
                <Mars className="h-3.5 w-3.5 text-[#D3A753]" />
              ) : (
                <Venus className="h-3.5 w-3.5 text-pink-500" />
              )}
              {applicant.personalDetails?.gender} Member
            </span>
            {age > 0 && <span>• {age} years old</span>}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>{applicant.personalDetails?.currentLocation}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Home className="h-4 w-4" />
          <span>From {applicant.personalDetails?.nationality}</span>
        </div>
      </div>
    </div>
  )
}
