"use client"

import {
  CircleCheck,
  CircleDot,
  CircleSlash,
  HeartHandshake,
} from "lucide-react"
import { ApplicationFormStatus } from "@/lib/generated/prisma/enums"

export const applicationStatuses: {
  value: ApplicationFormStatus
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  badgeClassName: string
}[] = [
  {
    value: "OPEN",
    label: "Open",
    icon: CircleDot,
    color: "text-blue-500",
    badgeClassName:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    value: "IN_MATCHING",
    label: "In matching",
    icon: HeartHandshake,
    color: "text-yellow-600",
    badgeClassName:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    value: "MATCHED",
    label: "Matched",
    icon: CircleCheck,
    color: "text-green-600",
    badgeClassName:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "CLOSED",
    label: "Closed",
    icon: CircleSlash,
    color: "text-red-500",
    badgeClassName:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
]

export function getApplicationStatusMeta(status?: string) {
  return (
    applicationStatuses.find((item) => item.value === status) ??
    applicationStatuses[0]
  )
}
