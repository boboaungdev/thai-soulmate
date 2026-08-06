"use client"

import { Prisma, WebsiteReview } from "@/lib/generated/prisma/client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface WebsiteReviewDetailsProps {
  item: WebsiteReview | null
  onClose: () => void
}

const DetailSection = ({ title, data }: { title: string, data: Prisma.JsonValue }) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">{title}</h4>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="text-sm">
          <span className="font-medium text-muted-foreground capitalize">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
          </span>{' '}
          <span>
            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value) || 'N/A'}
          </span>
        </div>
      ))}
      <Separator className="my-4" />
    </div>
  )
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
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="space-y-4 py-4">
            <DetailSection title="First Impression" data={item.firstImpression} />
            <DetailSection title="Ease of Use" data={item.easeOfUse} />
            <DetailSection title="Design & Branding" data={item.designBranding} />
            <DetailSection title="Understanding of Service" data={item.understandingService} />
            <DetailSection title="Trust & Safety" data={item.trustSafety} />
            <DetailSection title="Content Quality" data={item.contentQuality} />
            <DetailSection title="Registration Process" data={item.registrationProcess} />
            <DetailSection title="Pricing & Value" data={item.pricingValue} />
            <DetailSection title="Overall Experience" data={item.overallExperience} />
            <DetailSection title="Matchmaking Specific" data={item.matchmakingSpecific} />
            <DetailSection title="Reviewer Info" data={item.reviewerInfo} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
