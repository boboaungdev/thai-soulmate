"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Flame, Crown, Clock, Check } from "lucide-react"
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

  const tabParam = searchParams.get("tab")
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (tabParam === "vip" || tabParam === "female") return "vip"
    return "membership"
  })

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "vip" || tab === "female") {
      setActiveCategory("vip")
    } else if (tab === "membership" || tab === "male") {
      setActiveCategory("membership")
    }
  }, [searchParams])

  const handleCategoryChange = (val: string) => {
    setActiveCategory(val)
    if (!isEmbedded && !isFromApplicationForm) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set("tab", val)
      router.replace(`/pricing?${newParams.toString()}`, { scroll: false })
    }
  }

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
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(207,161,79,0.08),transparent_70%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <MotionDiv
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.2,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          {!isEmbedded && !isFromApplicationForm && (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
                <Crown className="size-3.5" />
                <span>Exclusive Matchmaking</span>
              </div>

              <h1 className="text-gradient text-4xl font-bold tracking-tight md:text-5xl">
                {activeCategory === "vip" ? "Female VIP" : "Male Membership"}
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {activeCategory === "vip"
                  ? "Exclusive matchmaking services designed specifically for female members."
                  : "Unlock exclusive features and get more matches!"}
              </p>
            </>
          )}

          {isFromApplicationForm && (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
                <Crown className="size-3.5" />
                <span>Member Consultation</span>
              </div>

              <h1 className="text-gradient text-4xl font-bold tracking-tight md:text-5xl">
                {activeCategory === "vip"
                  ? "Female VIP Details"
                  : "Male Membership Details"}
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {userData?.name && `Dear ${userData.prefix} ${userData.name}, `}
                Here are the full details of our{" "}
                {activeCategory === "vip"
                  ? "Female VIP"
                  : "Male Membership"}{" "}
                plans.
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
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.15,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="mt-10"
        >
          <Tabs
            value={activeCategory}
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            {/* ===================================================== */}
            {/* MEMBERSHIP (MALE) TAB CONTENT */}
            {/* ===================================================== */}

            <TabsContent value="membership" className="mt-0">
              <Tabs defaultValue="promotion" className="w-full">
                {/* ================================================= */}
                {/* MALE SUB-TABS (PROMOTIONS vs REGULAR) */}
                {/* ================================================= */}

                <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                  <div className="w-full overflow-x-auto sm:w-auto">
                    <TabsList className="mx-auto flex w-max min-w-max rounded-xl border border-border/70 bg-card/80 p-1 backdrop-blur-sm group-data-horizontal/tabs:h-10">
                      <TabsTrigger
                        value="promotion"
                        variant="gradient"
                        className="h-full gap-2 rounded-lg px-4 text-xs font-semibold sm:px-5 sm:text-sm"
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
                        className="h-full gap-2 rounded-lg px-4 text-xs font-semibold sm:px-5 sm:text-sm"
                      >
                        <Crown className="size-4 shrink-0" />

                        <span className="hidden sm:inline">
                          Regular Membership
                        </span>

                        <span className="sm:hidden">Regular</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Auto Renew */}

                  <div className="flex h-10 shrink-0 items-center gap-2.5 rounded-xl border border-border/70 bg-card/80 px-3.5 backdrop-blur-sm">
                    <Label
                      htmlFor="auto-renew-toggle"
                      className="cursor-pointer text-xs font-semibold text-muted-foreground sm:text-sm"
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

                {/* ================================================= */}
                {/* PROMOTION TAB */}
                {/* ================================================= */}

                <TabsContent value="promotion" className="mt-10">
                  {!isEmbedded && !isFromApplicationForm && (
                    <MotionDiv
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: false,
                        amount: 0.15,
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
                          Special introductory packages created for the
                          exclusive of our 1-2-1 matchmaking service.
                        </p>

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

                        <MotionDiv
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{
                            once: false,
                            amount: 0.15,
                          }}
                          transition={{
                            duration: 0.4,
                            delay: 0 * 0.1,
                          }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="relative"
                        >
                          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#D3A753]/30 bg-card/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/60 hover:shadow-2xl sm:p-7">
                            <div className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-[#D3A753] to-[#B78D46] px-3 py-1 text-xs font-bold text-white shadow-sm">
                              50% OFF
                            </div>

                            <p className="mt-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
                              Special Offer
                            </p>

                            <h3 className="mt-2 text-2xl font-bold">1 Month</h3>

                            <div className="mt-4">
                              <span className="text-sm text-muted-foreground line-through">
                                ฿29,999
                              </span>

                              <div className="mt-1 text-4xl font-bold tracking-tight">
                                ฿14,999
                              </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-[#D3A753]/20 bg-[#D3A753]/10 p-4">
                              <p className="font-semibold text-foreground">
                                {isAutoRenew
                                  ? "Subscribe for 1 month"
                                  : "Pay for 1 month"}
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Get 6 months of membership
                              </p>
                            </div>

                            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                              {PLANS[0]?.features?.map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2.5"
                                >
                                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                                    <Check className="size-3 stroke-[2.5]" />
                                  </span>

                                  <span className="leading-snug">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-auto pt-7">
                              <Button
                                className="h-10 w-full border-border/80 font-semibold text-foreground hover:border-[#D3A753]/50 hover:bg-[#D3A753]/10 hover:text-foreground"
                                variant="outline"
                                onClick={() => {
                                  const plan = PLANS.find(
                                    (item) => item.id === "1-month"
                                  )

                                  if (plan) {
                                    handleChoosePlan(plan)
                                  }
                                }}
                              >
                                Claim Special Offer
                              </Button>
                            </div>
                          </div>
                        </MotionDiv>

                        {/* ================================================= */}
                        {/* 3 MONTHS — MOST POPULAR */}
                        {/* ================================================= */}

                        <MotionDiv
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{
                            once: false,
                            amount: 0.15,
                          }}
                          transition={{
                            duration: 0.4,
                            delay: 1 * 0.1,
                          }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="relative"
                        >
                          <div className="relative flex h-full flex-col rounded-2xl bg-gradient-to-b from-[#D3A753] via-[#E791A7] to-[#CA617D] p-[2px] shadow-xl transition-all duration-300 hover:shadow-2xl">
                            <div className="relative flex h-full flex-col rounded-[14px] bg-card p-6 text-left sm:p-7">
                              {/* Most Popular */}

                              <div className="btn-gradient absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold whitespace-nowrap text-white shadow-lg">
                                <Flame className="size-3.5 fill-current" />

                                <span>Most Popular</span>
                              </div>

                              {/* Discount */}

                              <div className="btn-gradient absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm">
                                43% OFF
                              </div>

                              <p className="text-gradient mt-2 text-xs font-semibold tracking-wider uppercase">
                                Best Special Value
                              </p>

                              <h3 className="mt-2 text-2xl font-bold">
                                3 Months
                              </h3>

                              <div className="mt-4">
                                <span className="text-sm text-muted-foreground line-through">
                                  ฿34,999
                                </span>

                                <div className="mt-1 text-4xl font-bold tracking-tight">
                                  ฿19,999
                                </div>
                              </div>

                              <div className="mt-5 rounded-xl border border-[#CA617D]/20 bg-gradient-to-r from-[#D3A753]/15 via-[#E791A7]/20 to-[#CA617D]/15 p-4">
                                <p className="font-semibold text-foreground">
                                  {isAutoRenew
                                    ? "Subscribe for 3 months"
                                    : "Pay for 3 months"}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  Get 9 months of membership
                                </p>
                              </div>

                              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                {PLANS.find(
                                  (item) => item.id === "3-months"
                                )?.features?.map((feature, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2.5"
                                  >
                                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#CA617D]/20 text-[#CA617D]">
                                      <Check className="size-3 stroke-[2.5]" />
                                    </span>

                                    <span className="leading-snug">
                                      {feature}
                                    </span>
                                  </li>
                                ))}
                              </ul>

                              <div className="mt-auto pt-7">
                                <Button
                                  className="btn-gradient h-10 w-full font-semibold text-white shadow-md shadow-[#D3A753]/20 hover:brightness-110"
                                  onClick={() => {
                                    const plan = PLANS.find(
                                      (item) => item.id === "3-months"
                                    )

                                    if (plan) {
                                      handleChoosePlan(plan)
                                    }
                                  }}
                                >
                                  Claim Special Offer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </MotionDiv>

                        {/* ================================================= */}
                        {/* TRY BEFORE YOU BUY */}
                        {/* ================================================= */}

                        <MotionDiv
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{
                            once: false,
                            amount: 0.15,
                          }}
                          transition={{
                            duration: 0.4,
                            delay: 2 * 0.1,
                          }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="relative"
                        >
                          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#D3A753]/30 bg-card/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/60 hover:shadow-2xl sm:p-7">
                            <div className="absolute top-4 right-4 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/15 px-3 py-1 text-xs font-bold text-[#D3A753]">
                              Free Trial
                            </div>

                            <p className="mt-2 text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
                              New Member Experience
                            </p>

                            <h3 className="mt-2 text-2xl font-bold">
                              Try Before You Buy
                            </h3>

                            <div className="mt-4">
                              <span className="text-sm text-muted-foreground line-through">
                                ฿14,999
                              </span>

                              <div className="mt-1 text-4xl font-bold tracking-tight">
                                Free Trial
                              </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-[#D3A753]/20 bg-[#D3A753]/10 p-4">
                              <p className="font-semibold text-foreground">
                                {isAutoRenew
                                  ? "Subscribe for 1 month at ฿24,999"
                                  : "Continue with 1 month for ฿24,999"}
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Get 6 months of membership
                              </p>
                            </div>

                            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                              <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                                  <Check className="size-3 stroke-[2.5]" />
                                </span>

                                <span className="leading-snug">
                                  Meet 1 personally selected matches
                                </span>
                              </li>

                              <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                                  <Check className="size-3 stroke-[2.5]" />
                                </span>

                                <span className="leading-snug">
                                  Personal 1-2-1 matchmaking service
                                </span>
                              </li>

                              <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                                  <Check className="size-3 stroke-[2.5]" />
                                </span>

                                <span className="leading-snug">
                                  Hand picked introductions
                                </span>
                              </li>

                              <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                                  <Check className="size-3 stroke-[2.5]" />
                                </span>

                                <span className="leading-snug">
                                  Experience the service before committing
                                </span>
                              </li>

                              <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                                  <Check className="size-3 stroke-[2.5]" />
                                </span>

                                <span className="leading-snug">
                                  Continue with 1 month membership
                                </span>
                              </li>

                              <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                                  <Check className="size-3 stroke-[2.5]" />
                                </span>

                                <span className="leading-snug">
                                  Get 6 months of membership for ฿24,999
                                </span>
                              </li>
                            </ul>

                            <div className="mt-auto pt-7">
                              <Button
                                variant="outline"
                                className="h-10 w-full border-border/80 font-semibold text-foreground hover:border-[#D3A753]/50 hover:bg-[#D3A753]/10 hover:text-foreground"
                                onClick={() => {
                                  console.log("Try Before You Buy selected")
                                }}
                              >
                                Try Before You Buy
                              </Button>
                            </div>
                          </div>
                        </MotionDiv>
                      </div>

                      <div className="mx-auto mt-8 max-w-xl text-center">
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          Special promotion is available to the first 15
                          eligible members only. Terms and availability may
                          apply.
                        </p>
                      </div>
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
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: false,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  >
                    <div className="mx-auto max-w-3xl">
                      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Regular Membership
                      </h2>

                      <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Choose your membership plan and enjoy our 1-2-1
                        matchmaking service.
                      </p>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                      {PLANS.map((plan, index) => (
                        <MotionDiv
                          key={plan.name}
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{
                            once: false,
                            amount: 0.15,
                          }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                          }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="relative"
                        >
                          {plan.popular ? (
                            <div className="relative flex h-full flex-col rounded-2xl bg-gradient-to-b from-[#D3A753] via-[#E791A7] to-[#CA617D] p-[2px] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                              <div className="relative flex h-full flex-col rounded-[14px] bg-card p-6 text-left sm:p-7">
                                <div className="btn-gradient absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold whitespace-nowrap text-white shadow-lg">
                                  <Flame className="size-3.5 fill-current" />

                                  <span>Most Popular</span>
                                </div>

                                <h3 className="text-gradient mt-2 text-2xl font-bold">
                                  {plan.name}
                                </h3>

                                <div className="mt-4">
                                  <div className="text-4xl font-bold tracking-tight">
                                    {plan.price}
                                  </div>

                                  {plan.pricePerMonth && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {plan.pricePerMonth}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-5 rounded-xl border border-[#CA617D]/20 bg-gradient-to-r from-[#D3A753]/15 via-[#E791A7]/20 to-[#CA617D]/15 p-4">
                                  <p className="font-semibold text-foreground">
                                    {isAutoRenew
                                      ? `Subscribe for ${plan.recurringInterval.paid}`
                                      : `Pay for ${plan.duration.paid}`}
                                  </p>

                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {isAutoRenew
                                      ? `Get ${plan.recurringInterval.total} of membership`
                                      : `Get ${plan.duration.total} of membership`}
                                  </p>
                                </div>

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
                                              className="flex items-start gap-2.5"
                                            >
                                              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#CA617D]/20 text-[#CA617D]">
                                                <Check className="size-3 stroke-[2.5]" />
                                              </span>

                                              <span className="leading-snug">
                                                {feature}
                                              </span>
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

                                <div className="mt-auto pt-7">
                                  <Button
                                    className="btn-gradient h-10 w-full font-semibold text-white shadow-md shadow-[#D3A753]/20 hover:brightness-110"
                                    onClick={() => handleChoosePlan(plan)}
                                  >
                                    Choose Plan
                                  </Button>
                                </div>

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
                            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#D3A753]/30 bg-card/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/60 hover:shadow-2xl sm:p-7">
                              <h3 className="mt-2 text-2xl font-bold">
                                {plan.name}
                              </h3>

                              <div className="mt-4">
                                <div className="text-4xl font-bold tracking-tight">
                                  {plan.price}
                                </div>

                                {plan.pricePerMonth && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {plan.pricePerMonth}
                                  </p>
                                )}
                              </div>

                              <div className="mt-5 rounded-xl border border-[#D3A753]/20 bg-[#D3A753]/10 p-4">
                                <p className="font-semibold text-foreground">
                                  {isAutoRenew
                                    ? `Subscribe for ${plan.recurringInterval.paid}`
                                    : `Pay for ${plan.duration.paid}`}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  {isAutoRenew
                                    ? `Get ${plan.recurringInterval.total} of membership`
                                    : `Get ${plan.duration.total} of membership`}
                                </p>
                              </div>

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
                                            className="flex items-start gap-2.5"
                                          >
                                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                                              <Check className="size-3 stroke-[2.5]" />
                                            </span>

                                            <span className="leading-snug">
                                              {feature}
                                            </span>
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

                              <div className="mt-auto pt-7">
                                <Button
                                  variant="outline"
                                  className="h-10 w-full border-border/80 font-semibold text-foreground hover:border-[#D3A753]/50 hover:bg-[#D3A753]/10 hover:text-foreground"
                                  onClick={() => handleChoosePlan(plan)}
                                >
                                  Choose Plan
                                </Button>
                              </div>

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
              </Tabs>
            </TabsContent>

            {/* ===================================================== */}
            {/* VIP (FEMALE) TAB */}
            {/* ===================================================== */}

            <TabsContent value="vip" className="mt-0">
              <MotionDiv
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: false,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                {/* Female Heading (Shown when embedded or from application form) */}
                {(isEmbedded || isFromApplicationForm) && (
                  <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                      Female VIP
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                      Exclusive matchmaking services designed specifically for
                      female members.
                    </p>
                  </div>
                )}

                {/* Female Cards */}

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {/* ================================================= */}
                  {/* WELCOME PLAN */}
                  {/* ================================================= */}

                  <MotionDiv
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: false,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0 * 0.1,
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative"
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#CA617D]/30 bg-card/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#CA617D]/60 hover:shadow-2xl sm:p-7">
                      <p className="mt-2 text-xs font-semibold tracking-wider text-[#CA617D] uppercase">
                        Introductory VIP
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">Welcome Plan</h3>

                      <div className="mt-5 rounded-xl border border-[#CA617D]/20 bg-[#CA617D]/10 p-4">
                        <p className="font-semibold text-foreground">
                          Welcome to Thai Soulmate
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Start your personalised matchmaking journey with
                          professional support.
                        </p>
                      </div>

                      <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                        {PLANS[0]?.features?.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#CA617D]/15 text-[#CA617D]">
                              <Check className="size-3 stroke-[2.5]" />
                            </span>

                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-7">
                        <Button
                          asChild
                          variant="outline"
                          className="h-10 w-full border-border/80 font-semibold text-foreground hover:border-[#CA617D]/50 hover:bg-[#CA617D]/10 hover:text-foreground"
                        >
                          <Link href="/contact">Contact Us</Link>
                        </Button>
                      </div>
                    </div>
                  </MotionDiv>

                  {/* ================================================= */}
                  {/* 6 MONTHS — MOST POPULAR */}
                  {/* ================================================= */}

                  <MotionDiv
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: false,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 1 * 0.1,
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative"
                  >
                    <div className="relative flex h-full flex-col rounded-2xl bg-gradient-to-b from-[#D3A753] via-[#E791A7] to-[#CA617D] p-[2px] shadow-xl transition-all duration-300 hover:shadow-2xl">
                      <div className="relative flex h-full flex-col rounded-[14px] bg-card p-6 text-left sm:p-7">
                        {/* Most Popular */}

                        <div className="btn-gradient absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold whitespace-nowrap text-white shadow-lg">
                          <Flame className="size-3.5 fill-current" />

                          <span>Most Popular</span>
                        </div>

                        <p className="text-gradient mt-2 text-xs font-semibold tracking-wider uppercase">
                          Signature VIP
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">6 Months</h3>

                        <div className="mt-5 rounded-xl border border-[#CA617D]/20 bg-gradient-to-r from-[#D3A753]/15 via-[#E791A7]/20 to-[#CA617D]/15 p-4">
                          <p className="font-semibold text-foreground">
                            Personalised Female VIP Service
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Enjoy personalised matchmaking with carefully
                            selected introductions.
                          </p>
                        </div>

                        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                          {PLANS[0]?.features?.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2.5"
                            >
                              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#CA617D]/20 text-[#CA617D]">
                                <Check className="size-3 stroke-[2.5]" />
                              </span>

                              <span className="leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto pt-7">
                          <Button
                            asChild
                            className="btn-gradient h-10 w-full font-semibold text-white shadow-md shadow-[#CA617D]/20 hover:brightness-110"
                          >
                            <Link href="/contact">Contact Us</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </MotionDiv>

                  {/* ================================================= */}
                  {/* 12 MONTHS */}
                  {/* ================================================= */}

                  <MotionDiv
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: false,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 2 * 0.1,
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative"
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#CA617D]/30 bg-card/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#CA617D]/60 hover:shadow-2xl sm:p-7">
                      <p className="mt-2 text-xs font-semibold tracking-wider text-[#CA617D] uppercase">
                        Prestige VIP
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">12 Months</h3>

                      <div className="mt-5 rounded-xl border border-[#CA617D]/20 bg-[#CA617D]/10 p-4">
                        <p className="font-semibold text-foreground">
                          Exclusive Female VIP Service
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Enjoy ongoing personalised matchmaking and
                          professional support.
                        </p>
                      </div>

                      <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                        {PLANS[0]?.features?.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#CA617D]/15 text-[#CA617D]">
                              <Check className="size-3 stroke-[2.5]" />
                            </span>

                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-7">
                        <Button
                          asChild
                          variant="outline"
                          className="h-10 w-full border-border/80 font-semibold text-foreground hover:border-[#CA617D]/50 hover:bg-[#CA617D]/10 hover:text-foreground"
                        >
                          <Link href="/contact">Contact Us</Link>
                        </Button>
                      </div>
                    </div>
                  </MotionDiv>
                </div>
              </MotionDiv>
            </TabsContent>
          </Tabs>
        </MotionDiv>

        {/* ========================================================= */}
        {/* BOTTOM LUXURY CTA CARD */}
        {/* ========================================================= */}

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="mt-16 sm:mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card/90 via-card/70 to-[#D3A753]/10 p-8 text-center backdrop-blur-sm sm:p-12">
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
                <Crown className="size-3.5" />
                <span>Confidential Concierge Service</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Questions About Our Membership?
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                For more details about any of our subscriptions, plans or
                membership fees, please{" "}
                <Link
                  href="/contact"
                  className="text-gradient font-semibold transition-all hover:underline hover:brightness-125"
                >
                  contact us
                </Link>
                . Our dedicated matchmaking team in Thailand is always here to
                assist you.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                <Button
                  asChild
                  className="btn-gradient h-10 px-6 font-semibold text-white shadow-lg shadow-[#D3A753]/20"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-10 border-border/80 px-6 font-semibold hover:border-[#D3A753]/50 hover:bg-[#D3A753]/10"
                >
                  <Link href="/#register-interest">
                    Arrange a Confidential Consultation
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                100% confidential • Bespoke matchmaking • Direct personal
                support
              </p>
            </div>
          </div>
        </MotionDiv>
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
