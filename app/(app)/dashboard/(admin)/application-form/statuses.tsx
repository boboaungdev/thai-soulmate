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
    value: "RECEIVED",
    label: "received",
    icon: CircleSlash,
    color: "text-red-500",
    badgeClassName:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
  {
    value: "PENDING",
    label: "In matching",
    icon: HeartHandshake,
    color: "text-yellow-600",
    badgeClassName:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    value: "COMPLETED",
    label: "Matched",
    icon: CircleCheck,
    color: "text-green-600",
    badgeClassName:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "MATCHED",
    label: "Closed",
    icon: CircleSlash,
    color: "text-red-500",
    badgeClassName:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
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
