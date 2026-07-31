"use client"

import {
  MoreHorizontal,
  Eye,
  CircleDot,
  CheckCircle2,
  CircleDollarSign,
  XCircle,
} from "lucide-react"
import { Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Payment } from "./columns"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

const paymentStatuses = [
  {
    value: "pending",
    label: "Pending",
    icon: CircleDot,
    color: "text-amber-500",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    value: "refunded",
    label: "Refunded",
    icon: CircleDollarSign,
    color: "text-blue-500",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
  },
]

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const payment = row.original as Payment

  const goToDetails = () => {
    // Navigate to a payment details page if it exists
    // router.push(`/dashboard/payment/${payment.id}`)
    toast.info("Drill-down functionality is not yet implemented for this page.")
  }

  const handleStatusChange = async (status: string) => {
    toast.info(
      `Payment status would be changed to ${status}. This is a mock action.`
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[180px]"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem onClick={goToDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={payment.status}
              onValueChange={handleStatusChange}
            >
              {paymentStatuses.map((status) => (
                <DropdownMenuRadioItem
                  key={status.value}
                  value={status.value}
                  className={status.color}
                >
                  <status.icon className={`mr-2 h-4 w-4 ${status.color}`} />
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
