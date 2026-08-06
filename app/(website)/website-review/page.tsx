"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
  Sparkles,
  MousePointerClick,
  Palette,
  Lightbulb,
  ShieldCheck,
  FileText,
  UserPlus,
  DollarSign,
  Star,
  Heart,
  User2,
  Mail,
  UserCheck,
  CheckCircle2,
  Home,
  ChevronLeft,
} from "lucide-react"

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



type WebsiteReviewFormValues = {
  firstImpression: {
    offer: string
    designedFor: string
    caughtAttention: string
    professionalTrustworthy: string
    professionalTrustworthyReason: string
  }
  easeOfUse: {
    findServiceInfo: string
    findRegistration: string
    confusingPages: string
    mobileFriendly: string
  }
  designBranding: {
    overallRating: number | undefined
    suitableForPremium: string
    visuallyAppealing: string
    outdatedUnprofessional: string
  }
  understandingService: {
    matchmakingProcess: string
    matchmakingVsAppsClear: string
    missingInfo: string
  }
  trustSafety: {
    feelSafe: string
    explainPrivacy: string
    increaseTrust: string
  }
  contentQuality: {
    englishEasy: string
    thaiNatural: string
    serviceDescriptionLength: string
  }
  registrationProcess: {
    formEaseRating: number | undefined
    unnecessaryQuestions: string
    stoppedAt: string
  }
  pricingValue: {
    pricingEasyToUnderstand: string
    expectedServiceTier: string
    worthThePriceExplained: string
  }
  overallExperience: {
    mostLiked: string
    leastLiked: string
    oneChange: string
    considerJoining: string
    considerJoiningReason: string
  }
  matchmakingSpecific: {
    considerJoiningService: string
    concernsBeforeJoining: string
    understandBenefits: string
    processClearlyExplained: string
    whatWouldEncourageSignUp: string
  }
  reviewerInfo: {
    isAnonymous: boolean
    name: string
    email: string
  }
}

export default function WebsiteReviewPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<WebsiteReviewFormValues>({
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
        isAnonymous: false,
        name: "",
        email: "",
      },
    },
  })

  async function onSubmit(values: WebsiteReviewFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/website-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        toast.success("Thank you for your feedback!")
        setIsSubmitted(true)
      } else {
        toast.error("There was a problem with your submission.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
      console.error("Submission error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isAnonymous = form.watch("reviewerInfo.isAnonymous")

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-gradient mb-2 text-4xl font-bold">
          Website Review Questionnaire
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Please spare 15 minutes to review our new matchmaking website. Your
          honest feedback will help us improve before launch.
        </p>
      </div>

      {isSubmitted ? (
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
            <CardDescription className="max-w-md text-lg text-muted-foreground">
              Your feedback is much appreciated. If you feel this service is for
              you, we will offer you a 50% discount on the service you choose.
            </CardDescription>
            <Button asChild className="btn-gradient px-6 py-3 font-semibold">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
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
              <Card className="mb-4">
                <AccordionItem value="item-1">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
                       1. First Impression (first
                      30 seconds)
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              {/* Ease of Use */}
              <Card className="mb-4">
                <AccordionItem value="item-2">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              {/* Design & Branding */}
              <Card className="mb-4">
                <AccordionItem value="item-3">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
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
                                placeholder="e.g., 8"
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
                                value={field.value ?? ""}
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

              {/* Understanding the Service */}
              <Card className="mb-4">
                <AccordionItem value="item-4">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
                       4. Understanding the
                      Service
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

              {/* Trust & Safety */}
              <Card className="mb-4">
                <AccordionItem value="item-5">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
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
                              Did you feel safe sharing personal information on
                              this website?
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

              {/* Content Quality */}
              <Card className="mb-4">
                <AccordionItem value="item-6">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              {/* Registration / Inquiry Process */}
              <Card className="mb-4">
                <AccordionItem value="item-7">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
                       7. Registration / Inquiry
                      Process
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
                              How easy was it to complete the inquiry or profile
                              form? (1–10)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                placeholder="e.g., 7"
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
                                value={field.value ?? ""}
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

              {/* Pricing & Value */}
              <Card className="mb-4">
                <AccordionItem value="item-8">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              {/* Overall Experience */}
              <Card className="mb-4">
                <AccordionItem value="item-9">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              {/* Matchmaking Service Specific */}
              <Card className="mb-4">
                <AccordionItem value="item-10">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="flex items-center gap-2 px-6 pb-6 text-xl font-semibold text-gradient">
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

              {/* Reviewer Information */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gradient">
                     11. Reviewer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="reviewerInfo.isAnonymous"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Submit Anonymously
                            </FormLabel>
                            <CardDescription>
                              You can submit your review anonymously.
                            </CardDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {!isAnonymous && (
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
                    )}
                  </div>
                </CardContent>
              </Card>
            </Accordion>

            <div className="flex justify-center">
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
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
