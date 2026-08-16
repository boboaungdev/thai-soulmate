"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { PaymentDetails } from "./payment-details"
import { paymentStatuses } from "./statuses"

const payments: Payment[] = [
  {
    id: "1",
    customId: 1,
    prefix: "Mr.",
    name: "John Doe",
    gender: "Male",
    email: "john.doe@example.com",
    phone: "(+66) 123456789",
    date: "2024-07-30 11:22",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    plan: "1 Month",
    amount: 29900,
    notes: [{ id: "1" }],
    startsAt: "2024-07-30",
    expiresAt: "2024-08-30",
  },
  {
    id: "2",
    customId: 2,
    prefix: "Ms.",
    name: "Jane Smith",
    nickname: "Jane",
    gender: "Female",
    email: "jane.smith@example.com",
    phone: "(+66) 987654321",
    date: "2024-07-29 10:15",
    status: "pending",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    plan: "3 Months",
    amount: 39900,
    notes: [],
    startsAt: "2024-07-29",
    expiresAt: "2024-10-29",
  },
  {
    id: "3",
    customId: 3,
    prefix: "Mr.",
    name: "Sam Wilson",
    gender: "Male",
    email: "sam.wilson@example.com",
    phone: "(+1) 5555555555",
    date: "2024-07-28 12:30",
    status: "cancelled",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    plan: "3 Months",
    amount: 39900,
    notes: [{ id: "1" }, { id: "2" }],
    startsAt: "2024-07-28",
    expiresAt: "2024-10-28",
  },
  {
    id: "4",
    customId: 4,
    prefix: "Ms.",
    name: "Alice Johnson",
    gender: "Female",
    email: "alice.j@example.com",
    phone: "(+44) 1112223333",
    date: "2024-07-27 14:30",
    status: "refunded",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    plan: "6 Months",
    amount: 49900,
    notes: [],
    startsAt: "2024-07-27",
    expiresAt: "2025-01-27",
  },
  {
    id: "5",
    customId: 5,
    prefix: "Ms.",
    name: "Emily White",
    nickname: "Em",
    gender: "Female",
    email: "emily.white@example.com",
    phone: "(+66) 555123456",
    date: "2024-07-26 09:00",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    plan: "1 Month",
    amount: 29900,
    notes: [],
    startsAt: "2024-07-26",
    expiresAt: "2024-08-26",
  },
]

export default function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const handleRowClick = (payment: Payment) => {
    setSelectedPayment(payment)
  }

  const handleCloseDetails = () => {
    setSelectedPayment(null)
  }

  const statusCounts = useMemo(() => {
    return paymentStatuses.map((status) => ({
      ...status,
      count: payments.filter((user) => user.status === status.value).length,
    }))
  }, [payments])

  return (
    <>
      <main className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment</h1>
            <p className="text-sm text-muted-foreground">
              Manage customer payments.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-sm font-semibold">
                Total: {payments.length}
              </Badge>
              {statusCounts.map((status) => (
                <Badge
                  key={status.value}
                  variant="outline"
                  className={status.badgeClassName}
                >
                  {status.label}: {status.count}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {payments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No payments found.
            </CardContent>
          </Card>
        ) : (
          <DataTable
            data={payments}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
      </main>
      <PaymentDetails payment={selectedPayment} onClose={handleCloseDetails} />
    </>
  )
}
