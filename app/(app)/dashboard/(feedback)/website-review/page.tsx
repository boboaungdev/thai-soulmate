"use client"

import { useEffect, useState } from "react"
import { getColumns } from "./columns"
import { DataTable } from "./data-table"
import { WebsiteReviewDetails } from "./website-review-details"
import { Skeleton } from "@/components/ui/skeleton"
import { WebsiteReview } from "@/lib/generated/prisma/client"
import { useWebsiteReviewStore } from "@/stores/website-review-store"

export default function WebsiteReviewPage() {
  const data = useWebsiteReviewStore((state) => state.reviews)
  const loading = useWebsiteReviewStore((state) => state.loading)
  const actions = useWebsiteReviewStore((state) => state.actions)

  const [selectedItem, setSelectedItem] = useState<WebsiteReview | null>(null)

  useEffect(() => {
    actions.fetchReviews()
  }, [actions])

  useEffect(() => {
    const handleUpdated = () => actions.forceFetchReviews()
    window.addEventListener("website-review-updated", handleUpdated)
    return () => {
      window.removeEventListener("website-review-updated", handleUpdated)
    }
  }, [actions])

  const handleRowClick = (item: WebsiteReview) => {
    setSelectedItem(item)
  }

  const handleCloseDetails = () => {
    setSelectedItem(null)
  }

  if (loading && data.length === 0) {
    return (
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Website Reviews
            </h1>
            <p className="text-sm text-muted-foreground">
              Feedback submitted by users about the website.
            </p>
          </div>
        </div>
        <div className="rounded-md border">
          <div className="w-full space-y-4 p-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Website Reviews
            </h1>
            <p className="text-sm text-muted-foreground">
              Feedback submitted by users about the website.
            </p>
          </div>
        </div>
        <DataTable
          data={data}
          columns={getColumns}
          onRowClick={handleRowClick}
          forceFetch={actions.forceFetchReviews}
        />
      </div>
      <WebsiteReviewDetails
        item={selectedItem}
        onClose={handleCloseDetails}
      />
    </>
  )
}
