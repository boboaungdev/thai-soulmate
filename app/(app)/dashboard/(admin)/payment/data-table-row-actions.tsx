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
  onViewDetails: (item: TData) => void
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
  onViewDetails,
}: DataTableRowActionsProps<TData>) {
  const payment = row.original as Payment

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
        <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
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
