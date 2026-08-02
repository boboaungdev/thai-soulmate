import { differenceInYears, format, isValid } from "date-fns"

export function formatDate(
  date: Date | string | null | undefined,
  pattern = "d MMM yyyy"
) {
  if (!date) return "-"

  const parsed = new Date(date)

  return isValid(parsed) ? format(parsed, pattern) : "-"
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "-"

  const parsed = new Date(date)

  return isValid(parsed) ? format(parsed, "d MMM yyyy HH:mm") : "-"
}

export function formatTime(date: Date | string | null | undefined) {
  if (!date) return "-"

  const parsed = new Date(date)

  return isValid(parsed) ? format(parsed, "HH:mm") : "-"
}

export function calculateAge(
  birthDate: Date | string | null | undefined
): number {
  if (!birthDate) return 0

  const date = new Date(birthDate)

  if (!isValid(date)) return 0

  return Math.max(0, differenceInYears(new Date(), date))
}

export function formatDOB(
  date: string | Date,
  options?: {
    showAge?: boolean
  }
): string {
  const dob = new Date(date)

  if (!isValid(dob)) return "-"

  const formatted = format(dob, "d MMM yyyy")

  if (!options?.showAge) return formatted

  return `${formatted} (Age: ${calculateAge(dob)})`
}
