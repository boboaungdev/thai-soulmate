"use client"
import clsx from "clsx"
import { useRouter, useSearchParams } from "next/navigation"
import { Flame } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { PLANS } from "@/constants"
import { MotionDiv } from "@/components/motion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { AnimatePresence } from "framer-motion"
import type { User, Plan } from "@/types"
import { useAuthStore } from "@/stores/auth-store"

interface PricingPageContentsProps {
  isEmbedded?: boolean
  embeddedUserData?: User | null
}

export function PricingPageContents({
  isEmbedded = false,
  embeddedUserData = null,
}: PricingPageContentsProps) {
  const [isAutoRenew, setIsAutoRenew] = useState(false)
  const router = useRouter()
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const isFromApplicationForm = searchParams.get("mode") === "register"
  const userDataFromUrl = searchParams.get("userData")
  const [userData, setUserData] = useState<User | null>(embeddedUserData)
  const { user } = useAuthStore()

  useEffect(() => {
    const autoRenew = searchParams.get("autoRenew")
    if (autoRenew !== null) {
      setIsAutoRenew(autoRenew === "false")
    }

    if (isEmbedded && embeddedUserData) {
      setUserData(embeddedUserData)
    } else if (userDataFromUrl) {
      try {
        const decodedUserData = JSON.parse(atob(userDataFromUrl))
        setUserData(decodedUserData)
      } catch (error) {
        console.error("Failed to parse user data from URL", error)
      }
    }
  }, [userDataFromUrl, isEmbedded, embeddedUserData])

  const handleChoosePlan = async (plan: Plan) => {
    if (isFromApplicationForm) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("step", "plans")
      params.set("plan", plan.name)
      params.set("autoRenew", isAutoRenew.toString())
      params.delete("mode")
      router.push(`/application-form?${params.toString()}`)
      return
    }

    // if (!user) {
    //   console.error("User is not authenticated.")
    //   router.push("/auth/login")
    //   return
    // }

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
        body: JSON.stringify({
          priceId: priceId,
          userData: user,
          mode: mode,
          autoRenew: isAutoRenew,
          plan: plan.name,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.open(url, "_blank")
      } else {
        console.error("Failed to create Stripe checkout session")
        // Optionally, show an error to the user
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }

  return (
    <section className="bg-muted/50 py-16 sm:py-20 dark:bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isEmbedded && !isFromApplicationForm && (
            <>
              <h1 className="text-gradient text-3xl font-bold sm:text-4xl md:text-5xl">
                VIP Membership
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Unlock exclusive features and get more matches!
              </p>
            </>
          )}
          {isFromApplicationForm && (
            <>
              <h1 className="text-gradient text-3xl font-bold sm:text-4xl md:text-5xl">
                VIP Membership Details
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {userData?.name && `Dear ${userData.prefix} ${userData.name}, `}
                Here are the full details of our VIP plans.
              </p>
            </>
          )}
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Label htmlFor="auto-renew-toggle">Auto-renew subscription</Label>
            <Switch
              id="auto-renew-toggle"
              checked={isAutoRenew}
              onCheckedChange={setIsAutoRenew}
            />
          </div>
        </MotionDiv>
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {PLANS.map((plan, index) => (
            <MotionDiv
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
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
              <div className="mt-1 text-sm font-semibold text-muted-foreground">
                {isAutoRenew ? (
                  <span>
                    Billed for <del>{plan.recurringInterval.paid}</del>, get{" "}
                    <b>{plan.recurringInterval.total}</b>
                  </span>
                ) : (
                  <span>
                    Pay for <del>{plan.duration.paid}</del>, get{" "}
                    <b>{plan.duration.total}</b>
                  </span>
                )}
              </div>
              {plan.pricePerMonth && (
                <p className="mt-1 mb-6 text-muted-foreground">
                  {plan.pricePerMonth}
                </p>
              )}
              <AnimatePresence>
                {!isEmbedded || expandedPlan === plan.name ? (
                  <MotionDiv
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
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
                    {isEmbedded && (
                      <Button
                        variant="link"
                        className="mb-4"
                        onClick={() => setExpandedPlan(null)}
                      >
                        Hide features
                      </Button>
                    )}
                  </MotionDiv>
                ) : null}
              </AnimatePresence>

              <button
                onClick={() => {
                  handleChoosePlan(plan)
                }}
                className={clsx(
                  "mt-auto w-full cursor-pointer rounded-lg px-5 py-3 text-base font-semibold transition-colors duration-300",
                  plan.popular
                    ? "btn-gradient border-0 text-white shadow-lg"
                    : "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-muted-foreground/10"
                )}
              >
                Choose Plan
              </button>
              {isEmbedded && expandedPlan !== plan.name && (
                <Button
                  variant="link"
                  className="mt-4"
                  onClick={() => setExpandedPlan(plan.name)}
                >
                  Show features
                </Button>
              )}
            </MotionDiv>
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
