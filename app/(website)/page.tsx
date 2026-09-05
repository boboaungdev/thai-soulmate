"use client"

import Image from "next/image"
import { APP_INFO } from "@/constants"
import { AppName } from "@/components/app-name"
// import { ProfileGallery } from "@/components/profile-gallery"
import { Faq } from "@/components/faq"
import { RegisterInterestForm } from "@/components/register-interest-form"
import { MotionDiv } from "@/components/motion"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

export default function HomePage() {
  const router = useRouter()
  const registerInterestRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.location.hash === "#register-interest") {
      registerInterestRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [router]) // Re-run effect when the route (including hash) changes

  return (
    <main>
      <section className="relative flex h-[80vh] min-h-[520px] flex-col justify-center overflow-hidden text-white">
        <MotionDiv
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/home-landing-mobile-2.png"
            alt="Background"
            fill
            className="object-cover md:hidden"
            priority
          />
          <Image
            src="/home-landing-2.png"
            alt="Background"
            fill
            className="hidden object-cover md:block"
            priority
          />
        </MotionDiv>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-60 sm:px-6 sm:pt-0 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex max-w-lg flex-col items-center space-y-4 text-center"
          >
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} Logo`}
              width={160}
              height={160}
              className="h-28 w-28 object-contain sm:h-36 sm:w-36 md:h-40 md:w-40"
              priority
            />

            <div className="space-y-3">
              <AppName className="text-4xl font-black tracking-tight uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl" />

              <div className="space-y-1.5">
                <p className="inline-flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.35em] text-[#E791A7] uppercase sm:text-xs">
                  <span className="h-px w-6 bg-[#CA617D]/70" />
                  EXCLUSIVE
                  <span className="h-px w-6 bg-[#CA617D]/70" />
                </p>

                <p className="text-sm font-semibold tracking-[0.2em] text-[#D3A753] sm:text-base md:text-lg">
                  {APP_INFO.tagline}
                </p>

                <p className="pt-2 text-sm leading-relaxed font-medium whitespace-pre-line text-white/85 sm:text-base md:text-lg">
                  {APP_INFO.secondaryTagline}
                </p>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* <section id="gallery" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-gradient mb-2 text-3xl font-bold">
              Featured Members
            </h2>
            <p className="mb-6 text-muted-foreground">
              Meet some of our amazing members.
            </p>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProfileGallery layout="scroll" />
          </MotionDiv>
        </div>
      </section> */}

      <section id="faq" className="bg-muted/50 py-16 sm:py-20 dark:bg-muted/30">
        <div className="mx-auto w-full max-w-2xl px-4">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-gradient mb-2 text-3xl font-bold">
              Frequently Asked Questions
            </h2>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <p className="mb-8 text-muted-foreground">
              Find answers to common questions about our service.
            </p>
          </MotionDiv>
          <Faq />
        </div>
      </section>

      <section
        id="register-interest"
        ref={registerInterestRef}
        className="py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <RegisterInterestForm />
        </div>
      </section>
    </main>
  )
}
