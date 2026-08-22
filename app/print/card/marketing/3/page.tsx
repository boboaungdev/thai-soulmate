import { MarketingPrintCard } from "@/components/marketing-print-card"

export default function BusinessMarketingPrintPage() {
  return (
    <MarketingPrintCard
      variant="sage"
      copy={{
        eyebrow: "Thoughtful introductions, lasting possibilities",
        headline: (
          <>
            Start with
            <br />
            something real.
          </>
        ),
        backHeadline: (
          <>
            There is more
            <br />
            to come.
          </>
        ),
      }}
    />
  )
}
