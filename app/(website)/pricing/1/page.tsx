"use client"

import clsx from "clsx"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Flame, Sparkles, Crown, HeartHandshake, Clock } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { PLANS } from "@/constants"
import { MotionDiv } from "@/components/motion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

  const router = useRouter()
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
  }, [userDataFromUrl, isEmbedded, embeddedUserData, searchParams])

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
          priceId,
          userData: user,
          mode,
          autoRenew: isAutoRenew,
          plan: plan.name,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()

        window.open(url, "_blank")
      } else {
        console.error("Failed to create Stripe checkout session")
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }

  return (
    <section className="bg-muted/50 py-20 sm:py-24 dark:bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isEmbedded && !isFromApplicationForm && (
            <>
              <h1 className="text-gradient text-4xl font-bold md:text-5xl">
                VIP Membership
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Unlock exclusive features and get more matches!
              </p>
            </>
          )}

          {isFromApplicationForm && (
            <>
              <h1 className="text-gradient text-4xl font-bold md:text-5xl">
                VIP Membership Details
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {userData?.name && `Dear ${userData.prefix} ${userData.name}, `}
                Here are the full details of our VIP plans.
              </p>
            </>
          )}
        </MotionDiv>

        {/* ========================================================= */}
        {/* AUTO RENEW */}
        {/* ========================================================= */}

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="mt-8"
        >
          <div className="flex items-center justify-center space-x-2">
            <Label htmlFor="auto-renew-toggle">Auto-renew subscription</Label>

            <Switch
              id="auto-renew-toggle"
              checked={isAutoRenew}
              onCheckedChange={setIsAutoRenew}
            />
          </div>
        </MotionDiv>

        {/* ========================================================= */}
        {/* PRICING TABS */}
        {/* ========================================================= */}

        <MotionDiv
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="mt-10"
        >
          <Tabs defaultValue="promotion" className="w-full">
            {/* ===================================================== */}
            {/* TAB HEADER */}
            {/* ===================================================== */}

            <div className="flex justify-center">
              <TabsList className="mx-auto">
                <TabsTrigger
                  value="promotion"
                  variant="gradient"
                  className="gap-2 px-5 py-2.5 text-sm font-semibold"
                >
                  <Flame className="size-4" />
                  <span>Fresh Launch Offers</span>
                </TabsTrigger>

                <TabsTrigger
                  value="regular"
                  variant="gradient"
                  className="gap-2 px-5 py-2.5 text-sm font-semibold"
                >
                  <Crown className="size-4" />
                  <span>Regular Membership</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ===================================================== */}
            {/* PROMOTION TAB */}
            {/* ===================================================== */}

            <TabsContent value="promotion" className="mt-10">
              {!isEmbedded && !isFromApplicationForm && (
                <MotionDiv
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  {/* Promotion heading */}

                  <div className="mx-auto max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D3A753]/40 bg-[#D3A753]/10 px-4 py-2 text-sm font-semibold text-[#B78D46]">
                      <Sparkles className="size-4" />
                      Fresh Launch Promotion
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                      Exclusive Launch Offers
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                      Special introductory packages created for the launch of
                      our personal matchmaking service.
                    </p>

                    {/* Limited availability */}

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D3A753]/10 via-[#E791A7]/10 to-[#CA617D]/10 px-4 py-2 text-sm font-semibold">
                      <Clock className="size-4 text-[#CA617D]" />

                      <span>
                        Limited to the <strong>first 15 men</strong>
                      </span>
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* PROMOTION CARDS */}
                  {/* ================================================= */}

                  <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {/* ================================================= */}
                    {/* 1 MONTH — 50% OFF */}
                    {/* ================================================= */}

                    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#D3A753]/30 bg-card p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-[#D3A753] to-[#B78D46] px-3 py-1 text-xs font-bold text-white">
                        50% OFF
                      </div>

                      <p className="mt-2 text-sm font-semibold tracking-wider text-[#B78D46] uppercase">
                        Launch Offer
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">1 Month</h3>

                      <div className="mt-5">
                        <span className="text-sm text-muted-foreground line-through">
                          ฿29,999
                        </span>

                        <div className="mt-1 text-4xl font-bold">฿14,999</div>
                      </div>

                      <div className="mt-5 rounded-xl bg-[#D3A753]/10 p-4">
                        <p className="font-semibold">Pay for 1 month</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Get 6 months of membership
                        </p>
                      </div>

                      <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                        {PLANS[0]?.features?.map((feature, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-[#D3A753]">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="mt-7 w-full text-white"
                        variant="outline"
                        size={"lg"}
                        onClick={() => {
                          const plan = PLANS.find(
                            (item) => item.id === "1-month"
                          )

                          if (plan) {
                            handleChoosePlan(plan)
                          }
                        }}
                      >
                        Claim Launch Offer
                      </Button>
                    </div>

                    {/* ================================================= */}
                    {/* 3 MONTHS — MOST POPULAR */}
                    {/* ================================================= */}

                    <div className="relative flex flex-col rounded-2xl bg-card p-[2px] shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Gradient border */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

                      <div className="relative flex h-full flex-col rounded-[14px] bg-card p-7 pt-7 text-left">
                        {/* Most Popular */}
                        <div className="btn-gradient absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-sm font-bold text-white">
                          <Flame className="size-4" />
                          <span>Most Popular</span>
                        </div>

                        {/* Discount */}
                        <div className="btn-gradient absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm">
                          43% OFF
                        </div>

                        <p className="text-gradient mt-2 text-sm font-semibold tracking-wider uppercase">
                          Best Launch Value
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">3 Months</h3>

                        <div className="mt-5">
                          <span className="text-sm text-muted-foreground line-through">
                            ฿34,999
                          </span>

                          <div className="mt-1 text-4xl font-bold">฿19,999</div>
                        </div>

                        <div className="mt-5 rounded-xl bg-gradient-to-r from-[#D3A753]/20 via-[#E791A7]/25 to-[#CA617D]/20 p-4">
                          <p className="font-semibold">Pay for 3 months</p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Get 9 months of membership
                          </p>
                        </div>

                        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                          {PLANS.find(
                            (item) => item.id === "3-months"
                          )?.features?.map((feature, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-[#CA617D]">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          className="btn-gradient mt-7 w-full text-white"
                          size={"lg"}
                          onClick={() => {
                            const plan = PLANS.find(
                              (item) => item.id === "3-months"
                            )

                            if (plan) {
                              handleChoosePlan(plan)
                            }
                          }}
                        >
                          Claim Launch Offer
                        </Button>
                      </div>
                    </div>

                    {/* ================================================= */}
                    {/* TRY BEFORE YOU BUY */}
                    {/* ================================================= */}

                    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#E791A7]/40 bg-card p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="absolute top-4 right-4 rounded-full bg-[#E791A7]/15 px-3 py-1 text-xs font-bold text-[#CA617D]">
                        Free Trial
                      </div>
                      <p className="mt-2 text-sm font-semibold tracking-wider text-[#CA617D] uppercase">
                        New Member Experience
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        Try Before You Buy
                      </h3>

                      <div className="mt-5">
                        <div className="text-3xl font-bold">Meet 3 Matches</div>

                        <p className="mt-2 text-sm text-muted-foreground">
                          Start with a personal introduction experience
                        </p>
                      </div>

                      <div className="mt-5 rounded-xl bg-[#E791A7]/10 p-4">
                        <p className="font-semibold">
                          Continue for ฿24,999 / 1 month
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Get 6 months of membership
                        </p>
                      </div>

                      <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-[#CA617D]">✓</span>
                          <span>Meet 3 personally selected matches</span>
                        </li>

                        <li className="flex gap-2">
                          <span className="text-[#CA617D]">✓</span>
                          <span>Personal 1-2-1 matchmaking service</span>
                        </li>

                        <li className="flex gap-2">
                          <span className="text-[#CA617D]">✓</span>
                          <span>Hand picked introductions</span>
                        </li>

                        <li className="flex gap-2">
                          <span className="text-[#CA617D]">✓</span>
                          <span>Experience the service before committing</span>
                        </li>

                        <li className="flex gap-2">
                          <span className="text-[#CA617D]">✓</span>
                          <span>Continue with 1 month membership</span>
                        </li>

                        <li className="flex gap-2">
                          <span className="text-[#CA617D]">✓</span>
                          <span>Get 6 months of membership for ฿24,999</span>
                        </li>
                      </ul>

                      <Button
                        variant="outline"
                        size={"lg"}
                        className="mt-7 w-full border-[#CA617D]/40 hover:bg-[#CA617D]/10"
                        onClick={() => {
                          console.log("Try Before You Buy selected")
                        }}
                      >
                        Try Before You Buy
                      </Button>
                    </div>
                  </div>

                  {/* Promotion note */}

                  <p className="mt-7 text-sm text-muted-foreground">
                    * Launch promotion is available to the first 15 eligible
                    members only. Terms and availability may apply.
                  </p>
                </MotionDiv>
              )}
            </TabsContent>

            {/* ===================================================== */}
            {/* REGULAR MEMBERSHIP TAB */}
            {/* ===================================================== */}

            <TabsContent value="regular" className="mt-10">
              <MotionDiv
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <div className="mx-auto max-w-3xl">
                  <h2 className="text-3xl font-bold md:text-4xl">
                    Regular Membership
                  </h2>

                  <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                    Choose your membership plan and enjoy our full matchmaking
                    service.
                  </p>
                </div>

                {/* ================================================= */}
                {/* CURRENT PLANS */}
                {/* ================================================= */}

                <div className="mt-12 flex flex-wrap justify-center gap-8">
                  {PLANS.map((plan, index) => (
                    <MotionDiv
                      key={plan.name}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      className={clsx(
                        "relative flex w-full max-w-sm flex-col rounded-lg border bg-card p-8 text-card-foreground shadow-sm transition-transform duration-300",
                        plan.popular &&
                          "border-gold scale-105 transform border-2"
                      )}
                    >
                      {plan.popular && (
                        <div className="btn-gradient absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-sm font-bold text-white">
                          <Flame className="size-4" />
                          <span>Most Popular</span>
                        </div>
                      )}

                      <h2 className="mb-4 text-2xl font-semibold">
                        {plan.name}
                      </h2>

                      <p className="text-4xl font-bold">{plan.price}</p>

                      <div className="mt-1 text-sm font-semibold text-muted-foreground">
                        {isAutoRenew ? (
                          <span>
                            Billed for <del>{plan.recurringInterval.paid}</del>,
                            get <b>{plan.recurringInterval.total}</b>
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
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            transition={{
                              duration: 0.3,
                            }}
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
                        onClick={() => handleChoosePlan(plan)}
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
              </MotionDiv>
            </TabsContent>
          </Tabs>
        </MotionDiv>

        {/* ========================================================= */}
        {/* CONTACT */}
        {/* ========================================================= */}

        <p className="mx-auto mt-16 max-w-3xl text-base text-muted-foreground">
          For more details about any of our subscriptions, plans or membership
          fees, please{" "}
          <Link
            href="/contact"
            className="text-gradient font-semibold transition-all hover:underline hover:brightness-125"
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </section>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div>Loading pricing plans...</div>}>
      <PricingPageContents />
    </Suspense>
  )
}
