import type { Metadata } from "next"
import { FaqContent } from "./faq-content"

export const metadata: Metadata = {
  title: "FAQ | Thai Soulmate - Verified 1-to-1 Matchmaking in Thailand",
  description:
    "Frequently asked questions about Thai Soulmate private 1-to-1 matchmaking. Learn about member verification, Google Meet video dates, translation services, confidentiality, and fees.",
}

export default function FaqPage() {
  return (
    <main className="min-h-screen">
      <FaqContent />
    </main>
  )
}
