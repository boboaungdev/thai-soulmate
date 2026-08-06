"use client"

import { WebsiteReview } from "@/lib/generated/prisma/client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface WebsiteReviewDetailsProps {
  item: WebsiteReview | null
  onClose: () => void
}

export function WebsiteReviewDetails({
  item,
  onClose,
}: WebsiteReviewDetailsProps) {
  if (!item) {
    return null
  }

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Review Details</SheetTitle>
          <SheetDescription>
            Detailed information from the website review.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold">Ratings</h4>
            <p>First Impression: {item.firstImpression} / 5</p>
            <p>Ease of Use: {item.easeOfUse} / 5</p>
            <p>Design & Branding: {item.designBranding} / 5</p>
            <p>Understanding of Service: {item.understandingService} / 5</p>
            <p>Trust & Safety: {item.trustSafety} / 5</p>
            <p>Content Quality: {item.contentQuality} / 5</p>
            <p>Registration Process: {item.registrationProcess} / 5</p>
            <p>Pricing & Value: {item.pricingValue} / 5</p>
            <p>Overall Experience: {item.overallExperience} / 5</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold">Matchmaking Specific</h4>
            {typeof item.matchmakingSpecific === 'object' && item.matchmakingSpecific !== null ? (
              Object.entries(item.matchmakingSpecific).map(([key, value]) => (
                <p key={key}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:{' '}
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </p>
              ))
            ) : (
              <p>{String(item.matchmakingSpecific)}</p>
            )}
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold">Reviewer Info</h4>
            <p>
              {item.reviewerInfo === null
                ? 'N/A'
                : typeof item.reviewerInfo === 'object'
                  ? JSON.stringify(item.reviewerInfo)
                  : String(item.reviewerInfo)}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
