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
