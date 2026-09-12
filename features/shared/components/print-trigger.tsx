"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function PrintTrigger({
  id,
  prefix = "document",
}: {
  id?: string
  prefix?: string
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      const originalTitle = document.title
      if (id) {
        document.title = `${prefix}-${id}.pdf`
      }
      window.print()
      document.title = originalTitle // Restore original title
    }
  }, [searchParams, id, prefix])

  return null
}
