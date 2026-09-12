import { Cta } from "@/components/layout"
import { ProfileGallery } from "./profile-gallery"
import { MotionDiv } from "@/components/motion"
import { Sparkles } from "lucide-react"

export function WebsiteGalleryView() {
  return (
    <main className="relative min-h-screen overflow-hidden py-12 md:py-18">
      {/* Background Subtle Radial Glows matching Pricing, Contact, Service & FAQ */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(207,161,79,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[650px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 size-[550px] rounded-full bg-gradient-to-br from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-2/3 -left-40 -z-10 size-[500px] rounded-full bg-gradient-to-tr from-[#D3A753]/10 via-[#E791A7]/5 to-transparent blur-3xl" />

      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl space-y-4 text-center"
        >
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
            <Sparkles className="size-3.5" />
            <span>Verified Member Network</span>
          </div>

          <h1 className="text-gradient text-4xl font-bold tracking-tight md:text-5xl">
            Meet a Few of Our Members
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            Explore verified profiles of our relationship-minded community.
            Every member is identity verified, intention screened, and seeking a
            sincere life partner.
          </p>
        </MotionDiv>

        {/* Gallery Grid */}
        <ProfileGallery layout="grid" />

        {/* Bottom Luxury CTA */}
        <Cta />
      </div>
    </main>
  )
}
