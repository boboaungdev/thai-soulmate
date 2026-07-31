"use client"

import { Card, CardContent } from "@/components/ui/card"

import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

const payments: Payment[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(+66) 123456789",
    date: "2024-07-30 11:22",
    status: "confirmed",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    plan: "1 Month",
    amount: 29900,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(+66) 987654321",
    date: "2024-07-29 10:15",
    status: "pending",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    plan: "3 Months",
    amount: 39900,
  },
  {
    id: "3",
    name: "Sam Wilson",
    email: "sam.wilson@example.com",
    phone: "(+1) 5555555555",
    date: "2024-07-28 12:30",
    status: "cancelled",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    plan: "Free",
    amount: 0,
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "(+44) 1112223333",
    date: "2024-07-27 14:30",
    status: "refunded",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    plan: "6 Months",
    amount: 49900,
  },
]

export default function PaymentPage() {
  return (
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
        <DataTable data={payments} columns={columns} />
      )}
    </main>
  )
}
