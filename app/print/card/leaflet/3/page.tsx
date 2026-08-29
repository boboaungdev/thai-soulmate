import { MarketingPrintCard } from "@/components/marketing-print-card"

export default function BusinessMarketingPrintPage() {
  return (
    <MarketingPrintCard
      variant="striped"
      copy={{
        eyebrow: "Designed for something lasting",
        headline: (
          <>
            Your next
            <br />
            great chapter
            <br />
            starts here.
          </>
        ),
        backHeadline: (
          <>
            A thoughtful way
            <br />
            to meet.
          </>
        ),
      }}
    />
  )
}
