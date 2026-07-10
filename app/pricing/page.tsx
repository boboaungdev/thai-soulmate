"use client"
import clsx from "clsx"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { Flame } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { STRIPE } from "@/constants"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Plan {
  name: string
  priceIds: {
    subscription: string
    oneTime: string
  }
  price: string
  features: string[]
  popular?: boolean
  pricePerMonth?: string
  duration: string
  recurringInterval: string
}

const plans: Plan[] = [
  {
    name: "1 Month",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.oneMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.oneMonth,
    },
    price: "฿29,999",
    duration: "Total 2 months",
    recurringInterval: "Billed every 2 months",
    features: [
      "Get 1 month FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
    pricePerMonth: "฿15,000/mo",
  },
  {
    name: "3 Months",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.threeMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.threeMonth,
    },
    price: "฿34,999",
    duration: "Total 6 months",
    recurringInterval: "Billed every 6 months",
    pricePerMonth: "≈ ฿5,833/mo",
    features: [
      "Get 3 months FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
    popular: true,
  },
  {
    name: "6 Months",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.sixMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.sixMonth,
    },
    price: "฿49,999",
    duration: "Total 12 months",
    recurringInterval: "Billed every 12 months",
    pricePerMonth: "≈ ฿4,167/mo",
    features: [
      "Get 6 months FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
  },
]

function PricingPageContents() {
  const [isAutoRenew, setIsAutoRenew] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  const emailFromUrl = searchParams.get("email")
  const emailSchema = z.string().email()
  const validationResult = emailSchema.safeParse(emailFromUrl)
  const email = validationResult.success ? validationResult.data : null

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  useEffect(() => {
    const canceled = searchParams.get("canceled")
    const sessionId = searchParams.get("session_id")

    if (canceled && sessionId) {
      const processedSessionId = sessionStorage.getItem(
        "processed_stripe_session"
      )

      if (processedSessionId !== sessionId) {
        setTimeout(() => {
          setShowCancelDialog(true)
          sessionStorage.setItem("processed_stripe_session", sessionId)
        }, 0)
      }
    }

    const success = searchParams.get("success")
    if (success && sessionId) {
      const processedSessionId = sessionStorage.getItem(
        "processed_stripe_session"
      )

      if (processedSessionId !== sessionId) {
        setTimeout(() => {
          setShowSuccessDialog(true)
          sessionStorage.setItem("processed_stripe_session", sessionId)
        }, 0)
      }
    }
  }, [searchParams])

  const handleCloseDialog = () => {
    setShowCancelDialog(false)
    // Remove the `canceled` query param from the URL without reloading the page
    const newPath = window.location.pathname
    window.history.replaceState({}, "", newPath)
  }

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false)
    // Remove the query params from the URL without reloading the page
    const newPath = window.location.pathname
    window.history.replaceState({}, "", newPath)
  }

  const handleChoosePlan = async (plan: Plan, email: string) => {
    const priceId = isAutoRenew
      ? plan.priceIds.subscription
      : plan.priceIds.oneTime
    const mode = isAutoRenew ? "subscription" : "payment"

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, email, mode }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      router.push(url)
    } catch (error) {
      console.error("Failed to create checkout session:", error)
      alert("Failed to proceed to checkout. Please try again.")
    }
  }

  return (
    <section className="bg-muted/50 py-16 sm:py-20 dark:bg-muted/30">
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Canceled</DialogTitle>
            <DialogDescription>
              Your payment process was canceled. You have not been charged. If
              you&apos;d like to try again, please select a plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Successful!</DialogTitle>
            <DialogDescription>
              Thank you for your purchase! Your VIP membership is now active.
              You can now enjoy all the exclusive benefits.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseSuccessDialog}>Great!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-gradient text-3xl font-bold sm:text-4xl md:text-5xl">
          VIP Membership
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Unlock exclusive features and get more matches!
        </p>
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Label htmlFor="auto-renew-toggle">One-time Payment</Label>
          <Switch
            id="auto-renew-toggle"
            checked={isAutoRenew}
            onCheckedChange={setIsAutoRenew}
          />
          <Label htmlFor="auto-renew-toggle">Auto-renew</Label>
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={clsx(
                "relative flex w-full max-w-sm flex-col rounded-lg border bg-card p-8 text-card-foreground shadow-sm transition-transform duration-300",
                plan.popular && "border-gold scale-105 transform border-2"
              )}
            >
              {plan.popular && (
                <div className="btn-gradient absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-sm font-bold text-white">
                  <Flame className="size-4" />
                  <span>Most Popular</span>
                </div>
              )}
              <h2 className="mb-4 text-2xl font-semibold">{plan.name}</h2>
              <p className="text-4xl font-bold">{plan.price}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {isAutoRenew ? plan.recurringInterval : plan.duration}
              </p>
              {plan.pricePerMonth && (
                <p className="mt-1 mb-6 text-muted-foreground">
                  {plan.pricePerMonth}
                </p>
              )}
              <ul className="my-6 flex-grow list-none p-0 text-left">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className={clsx(
                      "mb-3",
                      index === 0
                        ? "text-gradient font-bold"
                        : "text-muted-foreground"
                    )}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => email && handleChoosePlan(plan, email)}
                className={clsx(
                  "mt-auto w-full cursor-pointer rounded-lg px-5 py-3 text-base font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
                  plan.popular
                    ? "btn-gradient border-0 text-white shadow-lg"
                    : "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
                disabled={!email}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-16 max-w-3xl text-base text-muted-foreground">
          For more details about any of our subscriptions or plans, please feel
          free to contact us .
        </p>
      </div>
    </section>
  )
}

export default function PricingPage() {
  return (
    // A simple fallback; you could replace this with a loading skeleton component.
    <Suspense fallback={<div>Loading pricing plans...</div>}>
      <PricingPageContents />
    </Suspense>
  )
}
