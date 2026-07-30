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

  const handleCopyId = () => {
    navigator.clipboard.writeText(idToCopy).then(
      () => toast.success("ID copied to clipboard!"),
      () => toast.error("Failed to copy ID.")
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Avatar className="h-32 w-32 border-4 border-primary/20">
        <AvatarImage src={applicant.photos?.headshot} />
        <AvatarFallback>
          {applicant.personalDetails?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-gradient text-2xl font-bold">
          {applicant.personalDetails?.prefix} {applicant.personalDetails?.name}{" "}
          {applicant.personalDetails?.nickname &&
            `(${applicant.personalDetails?.nickname})`}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-sm">
          <div
            className="flex cursor-pointer items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={handleCopyId}
          >
            <span>ID: {idToCopy}</span>
            <Copy className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {applicant.personalDetails?.gender === "Male" ? (
              <Mars className="text-gold h-5 w-5" />
            ) : applicant.personalDetails?.gender === "Female" ? (
              <Venus className="h-5 w-5 text-pink-500" />
            ) : null}
            <span>{age} years old</span>
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
