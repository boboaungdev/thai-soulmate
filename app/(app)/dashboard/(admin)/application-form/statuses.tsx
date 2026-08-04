"use client"

import {
  CircleCheck,
  CircleX,
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
    label: "Received",
    icon: CircleDot,
    color: "text-gray-500",
    badgeClassName:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300",
  },
  {
    value: "PENDING",
    label: "Pending",
    icon: HeartHandshake,
    color: "text-yellow-600",
    badgeClassName:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    icon: CircleCheck,
    color: "text-green-600",
    badgeClassName:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "MATCHED",
    label: "Matched",
    icon: CircleCheck,
    color: "text-blue-600",
    badgeClassName:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    value: "CLOSED",
    label: "Rejected",
    icon: CircleX,
    color: "text-gray-500",
    badgeClassName:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300",
  },
]

export function getApplicationStatusMeta(status?: string) {
  return (
    applicationStatuses.find((item) => item.value === status) ??
    applicationStatuses[0]
  )
}
