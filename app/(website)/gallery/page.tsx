import type { Metadata } from "next"
import { WebsiteGalleryView } from "@/features/members"

export const metadata: Metadata = {
  title: "Meet Our Members | Thai Soulmate - Verified Matchmaking in Thailand",
  description:
    "Explore verified profiles of relationship-minded members in our private Thailand matchmaking network. 100% verified identities.",
}

export default function GalleryPage() {
  return <WebsiteGalleryView />
}
