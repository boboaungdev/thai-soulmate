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
}

export const paymentStatuses: PaymentStatusMeta[] = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    badgeClassName: "bg-gray-500 text-white",
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle2,
    badgeClassName: "bg-green-500 text-white",
  },
  {
    value: "refunded",
    label: "Refunded",
    icon: MinusCircle,
    badgeClassName: "bg-orange-500 text-white",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    badgeClassName: "bg-red-500 text-white",
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
