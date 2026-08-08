"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User } from "lucide-react"
import { format } from "date-fns"

import { Payment } from "./columns"
import { getPaymentStatusMeta } from "./statuses"

interface PaymentDetailsProps {
  payment: Payment | null
  onClose: () => void
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  value: React.ReactNode
  label: string
}) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <span className="font-medium">{label}</span>
    </div>
    <div className="text-right text-muted-foreground">{value}</div>
  </div>
)

const DetailRowNoIcon = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="flex items-center gap-3">
      <span className="font-medium">{label}</span>
    </div>
    <div className="text-right text-muted-foreground">{value}</div>
  </div>
)

export function PaymentDetails({ payment, onClose }: PaymentDetailsProps) {
  if (!payment) return null

  const status = getPaymentStatusMeta(payment.status)
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(payment.amount)

  return (
    <Sheet open={!!payment} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="px-6 pt-6 text-left">
          <SheetTitle>Payment Details</SheetTitle>
          <SheetDescription>
            Detailed information for payment ID #{payment.id}.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-6 px-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={payment.avatar} alt={payment.name} />
                <AvatarFallback>{payment.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {payment.prefix} {payment.name}
                </h2>
                <p className="text-sm text-muted-foreground">{payment.email}</p>
              </div>
              <Badge variant="outline" className={status.badgeClassName}>
                <status.icon className="mr-1.5 h-3.5 w-3.5" />
                {status.label}
              </Badge>
            </div>
            <Separator />
            <div className="divide-y">
              <DetailRowNoIcon
                label="Customer ID"
                value={String(payment.customId).padStart(4, "0")}
              />
              <DetailRowNoIcon label="Gender" value={payment.gender} />
              {payment.nickname && (
                <DetailRow
                  icon={<User className="h-4 w-4" />}
                  label="Nickname"
                  value={payment.nickname}
                />
              )}
              <DetailRowNoIcon label="Phone" value={payment.phone} />
              <DetailRowNoIcon label="Plan" value={payment.plan} />
              <DetailRowNoIcon label="Amount" value={formattedAmount} />
              <DetailRowNoIcon
                label="Payment Date"
                value={format(new Date(payment.date), "d MMM yyyy, HH:mm")}
              />
              {payment.startsAt && (
                <DetailRowNoIcon
                  label="Starts At"
                  value={format(new Date(payment.startsAt), "d MMM yyyy")}
                />
              )}
              {payment.expiresAt && (
                <DetailRowNoIcon
                  label="Expires At"
                  value={format(new Date(payment.expiresAt), "d MMM yyyy")}
                />
              )}
              <DetailRowNoIcon label="Notes" value={payment.notes.length} />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
