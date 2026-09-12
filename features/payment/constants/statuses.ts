import {
  CheckCircle2,
  Clock,
  XCircle,
  MinusCircle,
  LucideIcon,
} from "lucide-react"

export type PaymentStatus = "cancelled" | "refunded" | "completed" | "pending"

type PaymentStatusMeta = {
  value: PaymentStatus
  label: string
  icon: LucideIcon
  badgeClassName: string
  color?: string
}

export const paymentStatuses: PaymentStatusMeta[] = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    badgeClassName:
      "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
    badgeClassName:
      "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "refunded",
    label: "Refunded",
    icon: MinusCircle,
    color: "text-blue-500",
    badgeClassName:
      "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    badgeClassName:
      "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  },
]

export function getPaymentStatusMeta(status: PaymentStatus): PaymentStatusMeta {
  return (
    paymentStatuses.find((s) => s.value === status) || {
      value: status,
      label: status,
      icon: Clock, // Default icon
      badgeClassName: "bg-gray-500 text-white", // Default class
    }
  )
}
