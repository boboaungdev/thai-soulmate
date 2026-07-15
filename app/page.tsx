"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { APP_INFO } from "@/constants"
import { AppName } from "@/components/app-name"
import { UserGallery } from "@/components/user-gallery"
import { Faq } from "@/components/faq"
import { RegisterInterestForm } from "@/components/register-interest-form"
import { MotionDiv } from "@/components/motion"

export default function HomePage() {
  return (
    <main>
      <section className="relative flex h-[80vh] min-h-[500px] flex-col justify-center overflow-hidden text-white">
        <MotionDiv
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/home-landing-mobile.png"
            alt="Background"
            fill
            className="object-cover md:hidden"
            priority
          />
          <Image
            src="/home-landing.png"
            alt="Background"
            fill
            className="hidden object-cover md:block"
            priority
          />
        </MotionDiv>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex max-w-md flex-col items-center space-y-6 text-center"
          >
            <>
  <Image
    src="/logo.png"
    alt={`${APP_INFO.name} Logo`}
    width={150}
    height={150}
    className="h-auto w-auto object-contain"
  />

  <div className="space-y-4">
    <AppName className="text-3xl font-bold sm:text-4xl md:text-4xl" />

    <div className="space-y-0">
      <p className="text-lg font-bold text-white/90 md:text-xl">
        <span className="text-gradient">{APP_INFO.tagline}</span>
      </p>

      <p className="text-lg font-bold md:text-xl">
        <span className="text-gradient whitespace-pre-line">
          {APP_INFO.secondaryTagline}
        </span>
      </p>
    </div>
  </div>

  <div className="flex flex-wrap justify-center gap-4">
    <Button asChild size="lg" className="btn-gradient">
      <Link href="#register-interest">Register Interest</Link>
    </Button>

    <Button
      asChild
      size="lg"
      variant="outline"
      className="bg-transparent text-white transition-opacity hover:bg-white/10 hover:opacity-100"
    >
      <Link href="/service">Learn More</Link>
    </Button>
  </div>
</>
          </MotionDiv>
        </div>
      </section>

      <section id="gallery" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="mb-2 text-3xl font-bold">Featured Members</h2>
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
            <UserGallery layout="scroll" />
          </MotionDiv>
        </div>
      </section>

      <section id="faq" className="bg-muted/50 py-16 sm:py-20 dark:bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="mb-2 text-3xl font-bold">
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

      <section id="register-interest" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <RegisterInterestForm />
        </div>
      </section>
    </main>
  )
}
