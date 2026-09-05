import type { Metadata } from "next"
import { Faq } from "@/components/faq"
import { Cta } from "@/components/cta"
import { MotionDiv } from "@/components/motion"

export const metadata: Metadata = {
  title: "FAQ | Thai Soulmate",
  description:
    "Frequently asked questions about Thai Soulmate 1-2-1 matchmaking service.",
}

export default function FaqPage() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main>
        <section className="py-12 md:py-24">
          <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center">
              <h1 className="text-gradient text-4xl font-bold tracking-tighter md:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Find answers to common questions about our 1-2-1 matchmaking
                service.
              </p>
            </div>
            <Faq />
          </div>
        </section>
        <Cta />
      </main>
    </MotionDiv>
  )
}
