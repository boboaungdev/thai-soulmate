"use client"

import { useEffect } from "react"

export default function AutoPrint() {
  useEffect(() => {
    window.print()

    window.onafterprint = () => {
      window.close()
    }
  }, [])

  return null
}
