"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { PaymentDetails } from "./payment-details"

const payments: Payment[] = [
  {
    id: "1",
    customId: 1,
    name: "John Doe",
    gender: "Male",
    email: "john.doe@example.com",
    phone: "(+66) 123456789",
    date: "2024-07-30 11:22",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    plan: "1 Month",
    amount: 29900,
    notes: [{ id: "1" }],
  },
  {
    id: "2",
    customId: 2,
    name: "Jane Smith",
    gender: "Female",
    email: "jane.smith@example.com",
    phone: "(+66) 987654321",
    date: "2024-07-29 10:15",
    status: "pending",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    plan: "3 Months",
    amount: 39900,
    notes: [],
  },
  {
    id: "3",
    customId: 3,
    name: "Sam Wilson",
    gender: "Male",
    email: "sam.wilson@example.com",
    phone: "(+1) 5555555555",
    date: "2024-07-28 12:30",
    status: "cancelled",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    plan: "3 Months",
    amount: 39900,
    notes: [{ id: "1" }, { id: "2" }],
  },
  {
    id: "4",
    customId: 4,
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
  },
  {
    id: "5",
    customId: 5,
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

  return (
    <>
      <main className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
            <p className="text-sm text-muted-foreground">
              Manage customer payments.
            </p>
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
