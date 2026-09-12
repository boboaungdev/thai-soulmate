"use client"
import clsx from "clsx"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Flame } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { PLANS } from "@/constants"
import { MotionDiv } from "@/components/motion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { AnimatePresence } from "framer-motion"
import type { User, Plan } from "@/types"

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

  const handleChoosePlan = (plan: Plan) => {
    if (isFromApplicationForm) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("step", "plans")
      params.set("plan", plan.name)
      params.set("autoRenew", isAutoRenew.toString())
      params.delete("mode")
      router.push(`/application-form?${params.toString()}`)
      return
    }

    router.push(`/application-form?plan=${encodeURIComponent(plan.name)}`)
  }

  return (
    <section className="relative overflow-hidden bg-muted/50 py-20 sm:py-24 dark:bg-muted/30">
      {/* Unified Atmospheric Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 size-[550px] rounded-full bg-gradient-to-br from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
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
        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
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
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={clsx(
                "relative flex w-full max-w-sm flex-col rounded-2xl border bg-card p-8 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#D3A753]/10",
                plan.popular
                  ? "border-gold border-2 shadow-lg shadow-[#D3A753]/15"
                  : "border-border/70 hover:border-[#D3A753]/50"
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
        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </MotionDiv>
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
