import dayjs from "dayjs"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(birthDate: Date): number {
  const today = new Date()
  const birthYear = birthDate.getFullYear()
  const birthMonth = birthDate.getMonth()
  const birthDay = birthDate.getDate()

  let age = today.getFullYear() - birthYear

  // Adjust age if dob hasn't occurred yet this year
  if (
    today.getMonth() < birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() < birthDay)
  ) {
    age--
  }

  return Math.max(0, age) // Ensure age is not negative
}

export const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  })

// utils/date.ts


export function formatDOB(
  date: string | Date,
  options?: {
    showAge?: boolean
  }
): string {
  const dob = new Date(date)
  const formatted = dayjs(dob).format("D MMM YYYY")

  if (!options?.showAge) return formatted

  return `${formatted} (Age: ${calculateAge(dob)})`
}
