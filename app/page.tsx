"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { APP_NAME, APP_TAGLINE } from "@/constants"
import { AppName } from "@/components/app-name"
import { UserGallery } from "@/components/user-gallery"
import { Faq } from "@/components/faq"
import { RegisterInterestForm } from "@/components/register-interest-form"

export default function HomePage() {
  return (
    <main>
      <section
        className="relative flex h-[80vh] min-h-[500px] flex-col justify-center bg-cover bg-center text-white"
        style={{ backgroundImage: "url(/home-landing.png)" }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex max-w-md flex-col items-center space-y-6 text-center">
            <Image
              src="/logo.png"
              alt={`${APP_NAME} Logo`}
              width={150}
              height={150}
              className="mb-4 h-auto w-auto object-contain"
            />
            <AppName className="text-3xl font-bold sm:text-4xl md:text-5xl" />
            <div className="space-y-2">
              <p className="text-lg text-white/90 md:text-xl">{APP_TAGLINE}</p>

              <p className="text-lg font-bold md:text-xl">
                <span className="text-gradient">
                  Real People. Real Relationships. Personally Matched in
                  Thailand.
                </span>
              </p>
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
          </div>
        </div>
      </section>

      <section id="gallery" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-3xl font-bold">
            Featured Members
          </h2>
          <p className="mb-6 text-center text-muted-foreground">
            Meet some of our amazing members.
          </p>
          <UserGallery layout="scroll" />
        </div>
      </section>

      <section id="faq" className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
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
