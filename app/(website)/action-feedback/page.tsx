"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, ShieldCheck, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import { processTrackingEmailResponseAction } from "@/features/matching"

function ActionFeedbackContent() {
  const searchParams = useSearchParams()
  const trackingId = searchParams.get("trackingId")
  const response = searchParams.get("response")
  const from = searchParams.get("from")

  const [message, setMessage] = useState<string | null>(searchParams.get("message"))
  const [isError, setIsError] = useState<boolean>(searchParams.has("error"))
  const [errorMessage, setErrorMessage] = useState<string | null>(
    searchParams.get("error")
  )
  const [isProcessing, setIsProcessing] = useState<boolean>(
    Boolean(trackingId && response && from)
  )

  useEffect(() => {
    if (trackingId && response && from) {
      processTrackingEmailResponseAction({ trackingId, response, from })
        .then((res) => {
          if (res.success) {
            setMessage(res.message)
            setIsError(false)
          } else {
            setIsError(true)
            setErrorMessage(res.message)
          }
          setIsProcessing(false)
        })
        .catch(() => {
          setIsError(true)
          setErrorMessage("An unexpected error occurred.")
          setIsProcessing(false)
        })
    }
  }, [trackingId, response, from])

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] flex-1 flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D3A753]/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-[#CA617D]/15 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D3A753]/5 blur-[150px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="relative">
          {/* Outer glow frame */}
          <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-[#D3A753]/30 via-transparent to-[#CA617D]/20 opacity-70 blur-md" />

          <div className="relative overflow-hidden rounded-3xl border border-[#D3A753]/30 bg-card/85 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
            {/* Top edge highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D3A753]/60 to-transparent" />

            {/* Trust Pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#D3A753] uppercase backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D3A753]" />
              <span>Confidential Matchmaking</span>
            </div>

            {/* Status Visual */}
            {isProcessing ? (
              <>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D3A753]/30 bg-[#D3A753]/10 text-[#D3A753] shadow-xl shadow-[#D3A753]/10">
                  <Loader2 className="h-10 w-10 animate-spin text-[#D3A753]" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Processing Your Response
                </h1>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  Please wait while we record your introduction preferences...
                </p>
              </>
            ) : isError ? (
              <>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-500 shadow-xl shadow-rose-500/10">
                  <XCircle className="h-10 w-10 text-rose-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-destructive sm:text-4xl">
                  An Error Occurred
                </h1>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {errorMessage ||
                    "Something went wrong. Please try again later."}
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Thank You!
                </h1>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {message || "Your action has been recorded successfully."}
                </p>
              </>
            )}

            {/* Subtle Divider */}
            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[#D3A753]/20 to-transparent" />

            {/* Reassurance text */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you have any questions, please don&apos;t hesitate to contact
              our support team.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="btn-gradient h-11 w-full rounded-xl px-7 text-base font-semibold shadow-md shadow-[#D3A753]/15 transition-all hover:shadow-[#D3A753]/30 sm:w-auto"
              >
                <Link href="/">Return to Homepage</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl border-[#D3A753]/30 text-foreground transition-all hover:bg-[#D3A753]/10 sm:w-auto"
              >
                <Link href="/contact">Contact Concierge</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

export default function ActionFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      }
    >
      <ActionFeedbackContent />
    </Suspense>
  )
}
