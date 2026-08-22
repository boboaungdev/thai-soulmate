import { MarketingPrintCard } from "@/components/marketing-print-card"

export default function BusinessMarketingPrintPage() {
  return (
    <MarketingPrintCard
      variant="sunset"
      copy={{
        eyebrow: "Love worth taking your time for",
        headline: (
          <>
            A better way
            <br />
            to find love.
          </>
        ),
        backHeadline: (
          <>
            Let the right
            <br />
            story find you.
          </>
        ),
        showFrontFooter: true,
      }}
    />
  )
}
