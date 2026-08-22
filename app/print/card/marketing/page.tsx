import { MarketingPrintCard } from "@/components/marketing-print-card"

export default function BusinessMarketingPrintPage() {
  return (
    <MarketingPrintCard
      variant="classic"
      copy={{
        eyebrow: "Meaningful connections, personally matched",
        headline: "Meet someone who is truly right for you.",
        backHeadline: "Begin something beautifully real.",
      }}
    />
  )
}
