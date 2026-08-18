"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ActionFeedbackContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const isError = searchParams.has("error")
  const errorMessage = searchParams.get("error")

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        {isError ? (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold text-red-600">
              An Error Occurred
            </h1>
            <p className="mt-2 text-gray-700">
              {errorMessage || "Something went wrong. Please try again later."}
            </p>
          </>
        ) : (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="mt-4 text-2xl font-bold text-green-600">
              Thank You!
            </h1>
            <p className="mt-2 text-gray-700">
              {message || "Your action has been recorded successfully."}
            </p>
          </>
        )}
        <div className="mt-6">
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ActionFeedbackPage() {
  // This page is likely the target of a redirect from an API route.
  // The API route `/api/tracking/[id]` redirects to `/response-recorded`.
  // To make this page work with that redirect, you should rename the directory
  // from `action-feedback` to `response-recorded`.
  // i.e., `app/(website)/response-recorded/page.tsx`

  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading feedback...</div>}
    >
      <ActionFeedbackContent />
    </Suspense>
  )
}
