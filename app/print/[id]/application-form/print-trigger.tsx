"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function PrintTrigger({ id }: { id: string }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      const originalTitle = document.title
      document.title = `application-${id}.pdf`
      window.print()
      document.title = originalTitle
    }
  }, [searchParams, id])

  return null
}
