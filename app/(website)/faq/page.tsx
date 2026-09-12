import type { Metadata } from "next"
import { FaqView } from "@/features/website"

export const metadata: Metadata = {
  title: "FAQ | Thai Soulmate - Verified 1-2-1 Matchmaking in Thailand",
  description:
    "Frequently asked questions about Thai Soulmate private 1-2-1 matchmaking. Learn about member verification, Google Meet video dates, translation services, confidentiality, and fees.",
}

export default function FaqPage() {
  return <FaqView />
}
