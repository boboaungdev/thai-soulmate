"use client"

import clsx from "clsx"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Flame, Sparkles, Crown, Clock, Venus } from "lucide-react"
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
          }}
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

            <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {/* Tabs */}
              <div className="w-full overflow-x-auto sm:w-auto">
                <TabsList className="mx-auto flex w-max min-w-max">
                  <TabsTrigger
                    value="promotion"
                    variant="gradient"
                    className="gap-2 px-4 py-2.5 text-sm font-semibold sm:px-5"
                  >
                    <Flame className="size-4 shrink-0" />

                    <span className="hidden sm:inline">
                      Special Promotion Offers
                    </span>

                    <span className="sm:hidden">Promotions</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="regular"
                    variant="gradient"
                    className="gap-2 px-4 py-2.5 text-sm font-semibold sm:px-5"
                  >
                    <Crown className="size-4 shrink-0" />

                    <span className="hidden sm:inline">Regular Membership</span>

                    <span className="sm:hidden">Regular</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="female"
                    variant="gradient"
                    className="gap-2 px-4 py-2.5 text-sm font-semibold sm:px-5"
                  >
                    <Venus className="size-4 shrink-0" />

                    <span className="hidden sm:inline">Female VIP</span>

                    <span className="sm:hidden">Female VIP</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Auto Renew */}
              <div className="flex shrink-0 items-center gap-2">
                <Label
                  htmlFor="auto-renew-toggle"
                  className="cursor-pointer text-sm font-semibold"
                >
                  Auto-renew
                </Label>

                <Switch
                  id="auto-renew-toggle"
                  checked={isAutoRenew}
                  onCheckedChange={setIsAutoRenew}
                />
              </div>
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
                  {/* Promotion Heading */}

                  <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                      Special Promotion Offers
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                      Special introductory packages created for the exclusive of
                      our 1-2-1 matchmaking service.
                    </p>

                    {/* Limited Availability */}

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D3A753]/10 via-[#E791A7]/10 to-[#CA617D]/10 px-4 py-2 text-sm font-semibold">
                      <Clock className="size-4 animate-spin text-[#CA617D]" />

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
                    {/* 1 MONTH */}
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
                        <p className="font-semibold">
                          {isAutoRenew
                            ? "Subscribe for 1 month"
                            : "Pay for 1 month"}
                        </p>

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
                        size="default"
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

                    <div className="relative flex flex-col rounded-2xl bg-card p-[2px] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

                      <div className="relative flex h-full flex-col rounded-[14px] bg-card p-7 text-left">
                        {/* Most Popular */}

                        <div className="btn-gradient absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-sm font-bold whitespace-nowrap text-white shadow-lg">
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
                          <p className="font-semibold">
                            {isAutoRenew
                              ? "Subscribe for 3 months"
                              : "Pay for 3 months"}
                          </p>

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
                          size="default"
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
                        <span className="text-sm text-muted-foreground line-through">
                          ฿14,999
                        </span>

                        <div className="mt-1 text-4xl font-bold">
                          Free Trial
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl bg-[#E791A7]/10 p-4">
                        <p className="font-semibold">
                          {isAutoRenew
                            ? "Subscribe for 1 month at ฿24,999"
                            : "Continue with 1 month for ฿24,999"}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Get 6 months of membership
                        </p>
                      </div>

                      <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-[#CA617D]">✓</span>

                          <span>Meet 1 personally selected matches</span>
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
                        size="default"
                        className="mt-7 w-full border-[#CA617D]/40 hover:bg-[#CA617D]/10"
                        onClick={() => {
                          console.log("Try Before You Buy selected")
                        }}
                      >
                        Try Before You Buy
                      </Button>
                    </div>
                  </div>

                  {/* Promotion Note */}

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
                {/* Regular Heading */}

                <div className="mx-auto max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Regular Membership
                  </h2>

                  <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                    Choose your membership plan and enjoy our 1-2-1 matchmaking
                    service.
                  </p>
                </div>

                {/* Regular Cards */}

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  {PLANS.map((plan, index) => (
                    <MotionDiv
                      key={plan.name}
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
                        delay: index * 0.1,
                      }}
                      className="relative"
                    >
                      {plan.popular ? (
                        /* ================================================= */
                        /* MOST POPULAR CARD */
                        /* ================================================= */

                        <div className="relative flex h-full flex-col rounded-2xl bg-card p-[2px] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                          {/* Gradient Border */}

                          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

                          {/* Inner Card */}

                          <div className="relative flex h-full flex-col rounded-[14px] bg-card p-7 text-left">
                            {/* Most Popular */}

                            <div className="btn-gradient absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-sm font-bold whitespace-nowrap text-white shadow-lg">
                              <Flame className="size-4" />

                              <span>Most Popular</span>
                            </div>

                            {/* Plan Name */}

                            <h3 className="text-gradient mt-2 text-2xl font-bold">
                              {plan.name}
                            </h3>

                            {/* Price */}

                            <div className="mt-5">
                              <div className="text-4xl font-bold">
                                {plan.price}
                              </div>

                              {plan.pricePerMonth && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {plan.pricePerMonth}
                                </p>
                              )}
                            </div>

                            {/* Membership Value */}

                            <div className="mt-5 rounded-xl bg-gradient-to-r from-[#D3A753]/20 via-[#E791A7]/25 to-[#CA617D]/20 p-4">
                              <p className="font-semibold">
                                {isAutoRenew
                                  ? `Subscribe for ${plan.recurringInterval.paid}`
                                  : `Pay for ${plan.duration.paid}`}
                              </p>

                              <p className="mt-1 text-sm text-muted-foreground">
                                {isAutoRenew
                                  ? `Get ${plan.recurringInterval.total} of membership`
                                  : `Get ${plan.duration.total} of membership`}
                              </p>
                            </div>

                            {/* Features */}

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
                                  <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                    {plan.features.map(
                                      (feature, featureIndex) => (
                                        <li
                                          key={featureIndex}
                                          className="flex gap-2"
                                        >
                                          <span className="shrink-0 text-[#CA617D]">
                                            ✓
                                          </span>

                                          <span>{feature}</span>
                                        </li>
                                      )
                                    )}
                                  </ul>

                                  {isEmbedded && (
                                    <Button
                                      variant="link"
                                      className="mt-4 px-0"
                                      onClick={() => setExpandedPlan(null)}
                                    >
                                      Hide features
                                    </Button>
                                  )}
                                </MotionDiv>
                              ) : null}
                            </AnimatePresence>

                            {/* Choose Plan */}

                            <Button
                              className="btn-gradient mt-7 w-full text-white"
                              size="default"
                              onClick={() => handleChoosePlan(plan)}
                            >
                              Choose Plan
                            </Button>

                            {/* Show Features */}

                            {isEmbedded && expandedPlan !== plan.name && (
                              <Button
                                variant="link"
                                className="mt-4"
                                onClick={() => setExpandedPlan(plan.name)}
                              >
                                Show features
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* ================================================= */
                        /* NORMAL CARD */
                        /* ================================================= */

                        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#D3A753]/30 bg-card p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                          {/* Plan Name */}

                          <h3 className="mt-2 text-2xl font-bold">
                            {plan.name}
                          </h3>

                          {/* Price */}

                          <div className="mt-5">
                            <div className="text-4xl font-bold">
                              {plan.price}
                            </div>

                            {plan.pricePerMonth && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {plan.pricePerMonth}
                              </p>
                            )}
                          </div>

                          {/* Membership Value */}

                          <div className="mt-5 rounded-xl bg-[#D3A753]/10 p-4">
                            <p className="font-semibold">
                              {isAutoRenew
                                ? `Subscribe for ${plan.recurringInterval.paid}`
                                : `Pay for ${plan.duration.paid}`}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {isAutoRenew
                                ? `Get ${plan.recurringInterval.total} of membership`
                                : `Get ${plan.duration.total} of membership`}
                            </p>
                          </div>

                          {/* Features */}

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
                                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                  {plan.features.map(
                                    (feature, featureIndex) => (
                                      <li
                                        key={featureIndex}
                                        className="flex gap-2"
                                      >
                                        <span className="shrink-0 text-[#D3A753]">
                                          ✓
                                        </span>

                                        <span>{feature}</span>
                                      </li>
                                    )
                                  )}
                                </ul>

                                {isEmbedded && (
                                  <Button
                                    variant="link"
                                    className="mt-4 px-0"
                                    onClick={() => setExpandedPlan(null)}
                                  >
                                    Hide features
                                  </Button>
                                )}
                              </MotionDiv>
                            ) : null}
                          </AnimatePresence>

                          {/* Choose Plan */}

                          <Button
                            variant="outline"
                            size="default"
                            className="mt-7 w-full border-[#D3A753]/40 hover:border-[#CA617D]/50 hover:bg-[#D3A753]/10"
                            onClick={() => handleChoosePlan(plan)}
                          >
                            Choose Plan
                          </Button>

                          {/* Show Features */}

                          {isEmbedded && expandedPlan !== plan.name && (
                            <Button
                              variant="link"
                              className="mt-4"
                              onClick={() => setExpandedPlan(plan.name)}
                            >
                              Show features
                            </Button>
                          )}
                        </div>
                      )}
                    </MotionDiv>
                  ))}
                </div>
              </MotionDiv>
            </TabsContent>

            {/* ===================================================== */}
            {/* FEMALE VIP TAB */}
            {/* ===================================================== */}

            <TabsContent value="female" className="mt-10">
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
                {/* Female VIP Heading */}

                <div className="mx-auto max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Female VIP Membership
                  </h2>

                  <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                    Exclusive matchmaking services designed specifically for
                    female members.
                  </p>
                </div>

                {/* ================================================= */}
                {/* FEMALE VIP CARD */}
                {/* ================================================= */}

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  <div className="relative md:col-start-2">
                    {/* ================================================= */}
                    {/* MOST POPULAR STYLE CARD */}
                    {/* ================================================= */}

                    <div className="relative flex h-full min-h-[520px] flex-col rounded-2xl bg-card p-[2px] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                      {/* Gradient Border */}

                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

                      {/* Inner Card */}

                      <div className="relative flex h-full flex-col rounded-[14px] bg-card p-7 text-left">
                        {/* Most Popular Style Badge */}

                        <div className="btn-gradient absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-sm font-bold whitespace-nowrap text-white shadow-lg">
                          <Venus className="size-4" />

                          <span>Female VIP</span>
                        </div>

                        {/* Plan Name */}

                        <h3 className="text-gradient mt-2 text-2xl font-bold">
                          Female VIP Membership
                        </h3>

                        {/* VIP Service */}

                        <div className="mt-5 rounded-xl bg-gradient-to-r from-[#D3A753]/20 via-[#E791A7]/25 to-[#CA617D]/20 p-4">
                          <p className="font-semibold">
                            Exclusive Female VIP Service
                          </p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Personalised matchmaking plans available by
                            consultation.
                          </p>
                        </div>

                        {/* Description */}

                        <p className="mt-6 text-sm leading-6 text-muted-foreground">
                          Female VIP plans are available by consultation. For
                          female VIP membership plans and pricing, please
                          contact us for more details.
                        </p>

                        {/* Features / Service Details */}

                        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                          {PLANS[0].features.map((feature, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="shrink-0 text-[#CA617D]">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Contact Button */}

                        <Button
                          asChild
                          className="btn-gradient mt-4 w-full text-white"
                          size="default"
                        >
                          <Link href="/contact">Contact Us</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
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
