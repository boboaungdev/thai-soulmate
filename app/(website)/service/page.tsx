import type { Metadata } from "next"
import { HowItWorksContent } from "./how-it-works-content"

export const metadata: Metadata = {
  title: "How It Works | Bespoke Matchmaking in Thailand | Thai Soulmate",
  description:
    "Learn how our personal 1-to-1 matchmaking service works for gentlemen and Thai ladies. From confidential consultation to meeting your life partner in Thailand.",
}

export default function ServicePage() {
  return (
    <main className="min-h-screen">
      <HowItWorksContent />
    </main>
  )
}
