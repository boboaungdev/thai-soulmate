"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreditCard, Download, RefreshCw, CheckCircle2 } from "lucide-react"

// Mock data
const currentPlan = {
  name: "Membership (3 Months)",
  price: "฿49,900",
  status: "Active",
  nextBillingDate: "2026-10-23",
  renewalPrice: "฿49,900",
}

const paymentMethod = {
  cardType: "Visa",
  last4: "1234",
  expires: "08/2028",
}

const billingHistory = [
  {
    invoice: "INV-2024-003",
    date: "2026-07-23",
    amount: "฿49,900",
    status: "Paid",
  },
  {
    invoice: "INV-2024-002",
    date: "2026-04-23",
    amount: "฿49,900",
    status: "Paid",
  },
  {
    invoice: "INV-2024-001",
    date: "2026-01-23",
    amount: "฿49,900",
    status: "Paid",
  },
]

export default function BillingPage() {
  const [isAutoRenew, setIsAutoRenew] = useState(true)

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your subscription, payment methods, and billing history.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Plan */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the {currentPlan.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{currentPlan.name}</span>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >{currentPlan.status === "Active" && (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                {currentPlan.status}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next billing date</span>
              <span>{currentPlan.nextBillingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Renewal price</span>
              <span className="font-semibold">{currentPlan.renewalPrice}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="destructive">Cancel Subscription</Button>
          </CardFooter>
        </Card>

        {/* Payment Method */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Update your payment information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <CreditCard className="h-8 w-8" />
              <div>
                <p className="font-semibold">
                  {paymentMethod.cardType} ending in {paymentMethod.last4}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {paymentMethod.expires}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                <p className="font-semibold">Auto-renewal</p>
              </div>
              <Switch checked={isAutoRenew} onCheckedChange={setIsAutoRenew} />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Update Payment Method</Button>
          </CardFooter>
        </Card>

        {/* Billing History */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View and download your past invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
