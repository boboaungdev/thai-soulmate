import { MarketingPrintCard } from "@/components/marketing-print-card"

export default function BusinessMarketingPrintPage() {
  return (
    <MarketingPrintCard
      variant="editorial"
      copy={{
        eyebrow: "Matchmaking, with heart",
        headline: (
          <>
            Meet someone
            <br />
            who feels
            <br />
            like home.
          </>
        ),
        backHeadline: (
          <>
            Your next
            <br />
            chapter starts here.
          </>
        ),
        showFrontFooter: true,
      }}
    />
  )
}
