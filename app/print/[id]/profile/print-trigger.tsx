"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function PrintTrigger() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      window.print()
    }
  }, [searchParams])

  return null
}
