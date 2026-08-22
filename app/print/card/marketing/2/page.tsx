import { MarketingPrintCard } from "@/components/marketing-print-card"

export default function BusinessMarketingPrintPage() {
  return (
    <MarketingPrintCard
      variant="photographic"
      copy={{
        eyebrow: "A meaningful beginning",
        headline: (
          <>
            Meet your
            <br />
            meaningful
            <br />
            match.
          </>
        ),
        backHeadline: (
          <>
            Your story deserves
            <br />a beautiful beginning.
          </>
        ),
        showFrontFooter: true,
      }}
    />
  )
}
