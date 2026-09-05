"use client"

import Link from "next/link"
import Image from "next/image"
import { APP_INFO } from "@/constants"
import { AppName } from "@/components/app-name"
// import { ProfileGallery } from "@/components/profile-gallery"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Target, Eye, Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      <section className="relative flex h-[85vh] min-h-[580px] flex-col justify-center overflow-hidden text-white">
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
            className="flex max-w-xl flex-col items-center space-y-4 text-center"
          >
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} Logo`}
              width={160}
              height={160}
              className="h-24 w-24 object-contain sm:h-32 sm:w-32 md:h-36 md:w-36"
              priority
            />

            <div className="space-y-3">
              <AppName className="text-4xl font-black tracking-tight uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl" />

              <div className="space-y-2">
                <p className="inline-flex items-center justify-center gap-2 text-[9px] font-semibold tracking-[0.35em] text-[#E791A7] uppercase sm:text-[10px]">
                  <span className="h-px w-6 bg-[#CA617D]/70" />
                  EXCLUSIVE
                  <span className="h-px w-6 bg-[#CA617D]/70" />
                </p>

                <p className="text-sm font-semibold tracking-[0.2em] text-[#D3A753] uppercase sm:text-base md:text-lg">
                  {APP_INFO.tagline}
                </p>

                <p className="pt-1 text-sm font-medium whitespace-pre-line text-white/85 sm:text-base md:text-lg">
                  {APP_INFO.secondaryTagline}
                </p>

                <p className="pt-2 text-base font-bold tracking-wide text-white sm:text-lg md:text-xl">
                  Personal Assistant in Your Search for a Life Partner in
                  Thailand
                </p>

                <p className="pt-1 text-sm leading-relaxed font-medium text-white/90 sm:text-base md:text-lg">
                  Stop searching. Let us do the matching.
                  <span className="mt-1 block text-xs font-normal text-white/75 sm:text-sm">
                    Real 1-2-1 personal matchmaking for men seeking genuine,
                    lasting relationships with Thai women.
                  </span>
                </p>
              </div>

              {/* Two Hero CTAs */}
              <div className="flex w-full flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="btn-gradient w-full font-semibold shadow-lg sm:w-auto"
                >
                  <Link href="/#register-interest">
                    Arrange a Confidential Consultation
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-white/25 bg-black/40 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white sm:w-auto"
                >
                  <Link href="/service">See How It Works</Link>
                </Button>
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

      {/* About Us */}
      <section id="about" className="py-12 md:py-24">
        <div className="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          {/* Centered title */}
          <div className="space-y-4 text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                About Us
              </h2>
            </MotionDiv>
          </div>

          {/* Content text */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 text-left"
          >
            <p className="text-muted-foreground md:text-xl">
              Welcome to <AppName className="font-bold" /> – where connections
              are made and stories begin. We are dedicated to bringing people
              together in meaningful ways.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;you don&apos;t have time for dating apps that offer no real
              value, and you don&apos;t have the time to engage with individuals
              who aren&apos;t the right fit for YOU.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;understands you are at a stage in your life where everything
              is in place, and all that&apos;s missing is the right
              person—someone with whom you can share the rest of your life in
              happiness.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;is a personalised matchmaking service dedicated to creating
              a genuine, meaningful connection between YOU and your future
              partner.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;takes the time to understand each individual&apos;s values,
              lifestyle, and relationship goals to connect YOU with your future
              life partner.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;approach is respectful and discreet, ensuring every
              introduction is made with care and integrity.
            </p>
          </MotionDiv>

          {/* Mission, Vision, Values */}
          <div className="grid gap-8 md:grid-cols-3">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <Target className="mb-2 h-6 w-6 text-[var(--gold)]" />
                  <CardTitle className="text-center">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                      <li>
                        Create a vibrant and secure platform that fosters
                        genuine connections, empowering individuals to find
                        companionship, friendship, and love.
                      </li>
                      <li>
                        Provide an inclusive environment where everyone feels
                        valued and respected.
                      </li>
                      <li>
                        Is to offer YOU an unparalleled matchmaking service that
                        meets with your expectations.
                      </li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <Eye className="mb-2 h-6 w-6 text-[var(--gold)]" />
                  <CardTitle className="text-center">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                      <li>
                        To be the leading platform for meaningful international
                        connections.
                      </li>
                      <li>
                        To build a world where technology enhances human
                        relationships, making it easier to build lasting bonds.
                      </li>
                      <li>
                        To set the standard for excellence and integrity in the
                        personalized matchmaking industry.
                      </li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <Handshake className="mb-2 h-6 w-6 text-[var(--gold)]" />
                  <CardTitle className="text-center">Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                      <li>
                        Integrity: Upholding honesty and transparency in all our
                        interactions.
                      </li>
                      <li>
                        Empathy: Understanding and respecting the feelings,
                        needs, matches, and perspectives of our members.
                      </li>
                      <li>
                        Discretion: Ensuring the privacy and confidentiality of
                        all our clients.
                      </li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </MotionDiv>
          </div>
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
