"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ActionFeedbackContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const isError = searchParams.has("error")
  const errorMessage = searchParams.get("error")

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 lg:p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          {isError ? (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <CardTitle className="text-red-600">An Error Occurred</CardTitle>
              <CardDescription>
                {errorMessage ||
                  "Something went wrong. Please try again later."}
              </CardDescription>
            </>
          ) : (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <CardTitle className="text-green-600">Thank You!</CardTitle>
              <CardDescription>
                {message || "Your action has been recorded successfully."}
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            If you have any questions, please don&apos;t hesitate to contact our
            support team.
          </p>
        </CardContent>
        <div className="flex items-center justify-center p-6 pt-0">
          <Button asChild className="btn-gradient">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </Card>
    </main>
  )
}

export default function ActionFeedbackPage() {
  // This page is likely the target of a redirect from an API route.
  // The API route `/api/tracking/[id]` redirects to `/response-recorded`.
  // To make this page work with that redirect, you should rename the directory
  // from `action-feedback` to `response-recorded`.
  // i.e., `app/(website)/response-recorded/page.tsx`

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ActionFeedbackContent />
    </Suspense>
  )
}
