"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import confetti from "canvas-confetti"

import { User2, Mail, CheckCircle2, Home, ChevronLeft } from "lucide-react"
import { MotionDiv } from "@/components/motion"
import type { Variants } from "framer-motion"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { websiteReviewSchema } from "@/features/reviews/schemas/review.schema"
import type {
  WebsiteReviewFormInput,
  WebsiteReviewFormOutput,
} from "@/features/reviews/types/review.types"
import { submitReviewAction } from "@/features/reviews/actions/review.action"


export function WebsiteReviewForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isSubmitted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [isSubmitted])

  const form = useForm<
    WebsiteReviewFormInput,
    unknown,
    WebsiteReviewFormOutput
  >({
    resolver: zodResolver(websiteReviewSchema),
    defaultValues: {
      firstImpression: {
        offer: "",
        designedFor: "",
        caughtAttention: "",
        professionalTrustworthy: "",
        professionalTrustworthyReason: "",
      },

      easeOfUse: {
        findServiceInfo: "",
        findRegistration: "",
        confusingPages: "",
        mobileFriendly: "",
      },
      designBranding: {
        overallRating: undefined,
        suitableForPremium: "",
        visuallyAppealing: "",
        outdatedUnprofessional: "",
      },
      understandingService: {
        matchmakingProcess: "",
        matchmakingVsAppsClear: "",
        missingInfo: "",
      },
      trustSafety: {
        feelSafe: "",
        explainPrivacy: "",
        increaseTrust: "",
      },
      contentQuality: {
        englishEasy: "",
        thaiNatural: "",
        serviceDescriptionLength: "",
      },
      registrationProcess: {
        formEaseRating: undefined,
        unnecessaryQuestions: "",
        stoppedAt: "",
      },
      pricingValue: {
        pricingEasyToUnderstand: "",
        expectedServiceTier: "",
        worthThePriceExplained: "",
      },
      overallExperience: {
        mostLiked: "",
        leastLiked: "",
        oneChange: "",
        considerJoining: "",
        considerJoiningReason: "",
      },
      matchmakingSpecific: {
        considerJoiningService: "",
        concernsBeforeJoining: "",
        understandBenefits: "",
        processClearlyExplained: "",
        whatWouldEncourageSignUp: "",
      },
      reviewerInfo: {
        name: "",
        email: "",
      },
    },
  })

  async function onSubmit(values: WebsiteReviewFormOutput) {
    setIsLoading(true)
    try {
      const res = await submitReviewAction(values)

      if (res.success) {
        toast.success("Thank you for your feedback!")
        setIsSubmitted(true)
      } else {
        toast.error(res.error || "There was a problem with your submission.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
      console.error("Submission error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Unified Atmospheric Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(207,161,79,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 size-[550px] rounded-full bg-gradient-to-br from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-40 -z-10 size-[500px] rounded-full bg-gradient-to-tr from-[#D3A753]/10 via-[#E791A7]/5 to-transparent blur-3xl" />

      <MotionDiv layout className="container relative z-10 mx-auto max-w-4xl px-4 py-24">
      <MotionDiv
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="text-center"
      >
        <h1 className="text-gradient mb-8 text-4xl font-bold tracking-tighter md:text-5xl">
          Website Review Questionnaire
        </h1>
      </MotionDiv>
      <MotionDiv
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="mx-auto max-w-3xl space-y-4 text-center text-lg text-muted-foreground md:text-xl"
      >
        <p className="pb-10">
          Please spare 15 minutes to review our new matchmaking website. Your
          honest feedback will help us improve before launch.
        </p>
      </MotionDiv>

      {isSubmitted ? (
        <MotionDiv
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          <Card className="w-full">
            <CardContent className="relative flex flex-col items-center justify-center space-y-6 py-12">
              <Button
                variant="link"
                onClick={() => {
                  setIsSubmitted(false)
                  form.reset()
                }}
                className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" /> Back to Review
              </Button>
              <CheckCircle2 className="h-20 w-20 text-green-500" />
              <CardTitle className="text-3xl font-bold">Thank You!</CardTitle>
              <CardDescription className="text-center text-lg text-muted-foreground">
                Your feedback is much appreciated. If you feel this service is
                for you, we will offer you a 50% discount on the service you
                choose. <br />
                <br />
                If you would like to be contacted about this offer, please
                register your interest on the home page. We will contact you
                when the service is ready to launch.
              </CardDescription>
              <Button asChild className="btn-gradient px-6 py-3 font-semibold">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </MotionDiv>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={[
                "item-1",
                "item-2",
                "item-3",
                "item-4",
                "item-5",
                "item-6",
                "item-7",
                "item-8",
                "item-9",
                "item-10",
                "item-11",
              ]}
            >
              {/* First Impression */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-1">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        1. First Impression (first 30 seconds)
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="firstImpression.offer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What do you think this website offers?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., A matchmaking service for..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="firstImpression.designedFor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Who do you think the website is designed for?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Professionals, specific age groups..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="firstImpression.caughtAttention"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What was the first thing that caught your
                                attention?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., The main photo, the slogan, a specific section..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="firstImpression.professionalTrustworthy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Did the homepage feel professional and
                                trustworthy?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="firstImpression.professionalTrustworthyReason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Why or why not? (regarding feeling professional
                                and trustworthy)
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., The design was modern, or the text had typos..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Ease of Use */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-2">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        2. Ease of Use
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="easeOfUse.findServiceInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Was it easy to find information about our
                                matchmaking service?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="easeOfUse.findRegistration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Could you easily find the registration or
                                contact button?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="easeOfUse.confusingPages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Were any pages confusing or difficult to
                                navigate?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="If yes, which pages and why?"
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="easeOfUse.mobileFriendly"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Did the website work well on your phone or
                                tablet?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="did-not-test" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Didn&apos;t test
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Design & Branding */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-3">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        3. Design & Branding
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="designBranding.overallRating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                How would you rate the overall design? (1–10)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  placeholder="e.g., 8 (1 = poor, 10 = excellent)"
                                  className="mt-1"
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "0" &&
                                      event.currentTarget.value === ""
                                    ) {
                                      event.preventDefault()
                                    }
                                  }}
                                  {...field}
                                  value={
                                    field.value == null
                                      ? ""
                                      : String(field.value)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="designBranding.suitableForPremium"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Do the colours, photos, and logo feel suitable
                                for a premium matchmaking service?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="designBranding.visuallyAppealing"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Is the website visually appealing?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="designBranding.outdatedUnprofessional"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Did anything on the website look outdated or
                                unprofessional?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="If yes, please describe what and where."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Understanding the Service */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-4">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        4. Understanding the Service
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="understandingService.matchmakingProcess"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                After browsing the site, can you explain how the
                                matchmaking process works?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your understanding of the process..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="understandingService.matchmakingVsAppsClear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Was the difference between matchmaking and
                                ordinary dating apps clear?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="understandingService.missingInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What information was missing that you would want
                                before joining?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., More details on pricing, success stories, member screening..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Trust & Safety */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-5">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        5. Trust & Safety
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="trustSafety.feelSafe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Did you feel safe sharing personal information
                                on this website?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="trustSafety.explainPrivacy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Did the site clearly explain privacy,
                                confidentiality, and member screening?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="trustSafety.increaseTrust"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What would increase your trust in the company?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Testimonials, certifications, clearer privacy policy..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Content Quality */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-6">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        6. Content Quality
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="contentQuality.englishEasy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Was the English easy to understand?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contentQuality.thaiNatural"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                (For Thai speakers) Was the Thai language
                                natural and professional?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="not-applicable" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      N/A
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contentQuality.serviceDescriptionLength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Were the service descriptions too short, too
                                long, or about right?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="too-short" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Too Short
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="about-right" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      About Right
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="too-long" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Too Long
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Registration / Inquiry Process */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-7">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        7. Registration / Inquiry Process
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="registrationProcess.formEaseRating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                How easy was it to complete the inquiry or
                                profile form? (1–10)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  placeholder="e.g., 7 (1 = very difficult, 10 = very easy)"
                                  className="mt-1"
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "0" &&
                                      event.currentTarget.value === ""
                                    ) {
                                      event.preventDefault()
                                    }
                                  }}
                                  {...field}
                                  value={
                                    field.value == null
                                      ? ""
                                      : String(field.value)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="registrationProcess.unnecessaryQuestions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Which questions in the form felt unnecessary or
                                too personal?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your feedback here..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="registrationProcess.stoppedAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Did you stop at any point during the form? If
                                yes, where?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., 'I stopped when ...'"
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Pricing & Value */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-8">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        8. Pricing & Value
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="pricingValue.pricingEasyToUnderstand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Was pricing easy to find and understand?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pricingValue.expectedServiceTier"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Based on the website, would you expect this
                                service to be budget, standard, or luxury?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="budget" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Budget
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="standard" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Standard
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="luxury" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Luxury
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pricingValue.worthThePriceExplained"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Does the website explain why the service is
                                worth the price?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Overall Experience */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-9">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        9. Overall Experience
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="overallExperience.mostLiked"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What did you like most about the website?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your answer here..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="overallExperience.leastLiked"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What did you like least?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your answer here..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="overallExperience.oneChange"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What is the one thing you would change before
                                launch?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your answer here..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="overallExperience.considerJoining"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                After visiting the website, would you consider
                                joining or contacting us?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="overallExperience.considerJoiningReason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Why or why not?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your answer here..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Matchmaking Service Specific */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-10">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        10. Matchmaking Service Specific
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="matchmakingSpecific.considerJoiningService"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Would you consider joining this matchmaking
                                service?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="maybe" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Maybe
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="matchmakingSpecific.concernsBeforeJoining"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What concerns would you have before joining?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Price, privacy, quality of matches..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="matchmakingSpecific.understandBenefits"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Do you understand the benefits of using a
                                professional matchmaker rather than dating apps?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="matchmakingSpecific.processClearlyExplained"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block">
                                Is the process for Thai ladies and foreign
                                gentlemen clearly explained?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="matchmakingSpecific.whatWouldEncourageSignUp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What would encourage you to sign up?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., A discount, seeing more success stories, a free consultation..."
                                  className="mt-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>

              {/* Reviewer Information */}
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Card className="mb-4 overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm transition-all duration-300 hover:border-[#D3A753]/50 hover:shadow-lg hover:shadow-[#D3A753]/5">
                  <AccordionItem value="item-11">
                    <CardHeader className="p-0">
                      <AccordionTrigger className="text-gradient flex items-center gap-2 px-6 pb-6 text-xl font-semibold">
                        11. Reviewer Information
                      </AccordionTrigger>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <MotionDiv
                          variants={itemVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: false, amount: 0.15 }}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle>Your Details</CardTitle>
                              <CardDescription>
                                Please provide your name and email.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormField
                                control={form.control}
                                name="reviewerInfo.name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <User2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                          placeholder="Your name"
                                          className="pl-10"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="reviewerInfo.email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                          type="email"
                                          placeholder="you@example.com"
                                          className="pl-10"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        </MotionDiv>
                      </div>
                    </CardContent>
                  </AccordionItem>
                </Card>
              </MotionDiv>
            </Accordion>

            <MotionDiv
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                className="btn-gradient px-8 py-3 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </MotionDiv>
          </form>
        </Form>
      )}
      </MotionDiv>
    </div>
  )
}
