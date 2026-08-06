"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
  User,
  Mail,
  UserCheck,
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
  CardFooter,
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
import { toast } from "sonner"

const formSchema = z.object({
  firstImpression: z.object({
    offer: z.string().min(10, {
      message:
        "Please provide a more detailed answer (at least 10 characters).",
    }),
    designedFor: z.string().optional(),
    caughtAttention: z.string().optional(),
    professionalTrustworthy: z.string({
      message: "Please select an option.",
    }),
    professionalTrustworthyReason: z.string().optional(),
  }),
  easeOfUse: z.object({
    findServiceInfo: z.string({
      message: "Please select an option.",
    }),
    findRegistration: z.string().optional(),
    confusingPages: z.string().optional(),
    mobileFriendly: z.string().optional(),
  }),
  designBranding: z.object({
    overallRating: z.string().min(1, { message: "Please provide a rating." }),
    suitableForPremium: z.string().optional(),
    visuallyAppealing: z.string().optional(),
    outdatedUnprofessional: z.string().optional(),
  }),
  understandingService: z.object({
    matchmakingProcess: z.string().min(10, {
      message:
        "Please provide a more detailed answer (at least 10 characters).",
    }),
    matchmakingVsAppsClear: z.string().optional(),
    missingInfo: z.string().optional(),
  }),
  trustSafety: z.object({
    feelSafe: z.string({
      message: "Please select an option.",
    }),
    explainPrivacy: z.string().optional(),
    increaseTrust: z.string().optional(),
  }),
  contentQuality: z.object({
    englishEasy: z.string({
      message: "Please select an option.",
    }),
    thaiNatural: z.string().optional(),
    serviceDescriptionLength: z.string().optional(),
  }),
  registrationProcess: z.object({
    formEaseRating: z.string().min(1, { message: "Please provide a rating." }),
    unnecessaryQuestions: z.string().optional(),
    stoppedAt: z.string().optional(),
  }),
  pricingValue: z.object({
    pricingEasyToUnderstand: z.string({
      message: "Please select an option.",
    }),
    expectedServiceTier: z.string().optional(),
    worthThePriceExplained: z.string().optional(),
  }),
  overallExperience: z.object({
    mostLiked: z.string().min(10, {
      message:
        "Please provide a more detailed answer (at least 10 characters).",
    }),
    leastLiked: z.string().optional(),
    oneChange: z.string().optional(),
    considerJoining: z.string().optional(),
    considerJoiningReason: z.string().optional(),
  }),
  matchmakingSpecific: z.object({
    considerJoiningService: z.string({
      message: "Please select an option.",
    }),
    concernsBeforeJoining: z.string().optional(),
    understandBenefits: z.string().optional(),
    processClearlyExplained: z.string().optional(),
    whatWouldEncourageSignUp: z.string().optional(),
  }),
  reviewerInfo: z
    .object({
      isAnonymous: z.boolean().default(false),
      name: z.string().optional(),
      email: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.isAnonymous) {
        if (!data.name || data.name.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Name is required.",
            path: ["name"],
          })
        }
        if (!data.email || data.email.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email is required.",
            path: ["email"],
          })
        } else {
          const emailValidation = z
            .string()
            .email({ message: "Please enter a valid email." })
          const result = emailValidation.safeParse(data.email)
          if (!result.success) {
            ctx.addIssue({
              ...result.error.issues[0],
              path: ["email"],
            })
          }
        }
      }
    }),
})

export default function ReviewPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstImpression: {
        offer: "",
        designedFor: "",
        caughtAttention: "",
        professionalTrustworthy: undefined,
        professionalTrustworthyReason: "",
      },
      easeOfUse: {
        findServiceInfo: undefined,
      },
      designBranding: {
        overallRating: "",
      },
      understandingService: {
        matchmakingProcess: "",
      },
      trustSafety: {
        feelSafe: undefined,
      },
      contentQuality: {
        englishEasy: undefined,
      },
      registrationProcess: {
        formEaseRating: "",
      },
      pricingValue: {
        pricingEasyToUnderstand: undefined,
      },
      overallExperience: {
        mostLiked: "",
      },
      matchmakingSpecific: {
        considerJoiningService: undefined,
      },
      reviewerInfo: {
        isAnonymous: false,
        name: "",
        email: "",
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Review Form Data:", values)
    toast.success("Thank you for your feedback!")
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
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <Sparkles className="h-5 w-5" /> First Impression (first 30
                    seconds)
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
                            Did the homepage feel professional and trustworthy?
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
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <MousePointerClick className="h-5 w-5" /> Ease of Use
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
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <Palette className="h-5 w-5" /> Design & Branding
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

            {/* Understanding the Service */}
            <Card className="mb-4">
              <AccordionItem value="item-4">
                <CardHeader className="p-0">
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <Lightbulb className="h-5 w-5" /> Understanding the Service
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
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <ShieldCheck className="h-5 w-5" /> Trust & Safety
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
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <FileText className="h-5 w-5" /> Content Quality
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
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <UserPlus className="h-5 w-5" /> Registration / Inquiry
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

            {/* Pricing & Value */}
            <Card className="mb-4">
              <AccordionItem value="item-8">
                <CardHeader className="p-0">
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <DollarSign className="h-5 w-5" /> Pricing & Value
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
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <Star className="h-5 w-5" /> Overall Experience
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
                  <AccordionTrigger className="flex items-center gap-2 p-6 text-xl font-semibold">
                    <Heart className="h-5 w-5" /> Matchmaking Service Specific
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
                            Would you consider joining this matchmaking service?
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
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <UserCheck className="h-5 w-5" /> Reviewer Information
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
                                  <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Thank You!
              </CardTitle>
              <CardDescription>
                Your feedback is much appreciated. If you feel this service is
                for you, we will offer you a 50% discount on the service you
                choose.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button
                type="submit"
                className="btn-gradient px-8 py-3 text-lg font-semibold"
              >
                Submit Review
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
