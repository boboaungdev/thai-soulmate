"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ActionFeedbackContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const error = searchParams.get("error")

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h1>
            <p className="text-gray-700">{error}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h1>
            <p className="text-gray-700">{message || "Your action has been recorded."}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function ActionFeedbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActionFeedbackContent />
    </Suspense>
  )
}
