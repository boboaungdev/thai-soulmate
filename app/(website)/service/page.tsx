import type { Metadata } from "next"
import { ServiceView } from "@/features/website"

export const metadata: Metadata = {
  title: "How It Works | Bespoke Matchmaking in Thailand | Thai Soulmate",
  description:
    "Learn how our personal 1-2-1 matchmaking service works for gentlemen living in Thailand or abroad, and relationship-minded Thai ladies. From confidential consultation to meeting your life partner in Thailand.",
}

export default function ServicePage() {
  return <ServiceView />
}
