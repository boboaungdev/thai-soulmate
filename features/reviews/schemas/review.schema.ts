import { z } from "zod"

export const websiteReviewSchema = z.object({
  firstImpression: z.object({
    offer: z.string().min(1, { message: "This field is required." }),
    designedFor: z.string().min(1, { message: "This field is required." }),
    caughtAttention: z.string().min(1, { message: "This field is required." }),
    professionalTrustworthy: z
      .string()
      .min(1, { message: "Please select an option." }),
    professionalTrustworthyReason: z
      .string()
      .min(1, { message: "This field is required." }),
  }),
  easeOfUse: z.object({
    findServiceInfo: z.string().min(1, { message: "Please select an option." }),
    findRegistration: z
      .string()
      .min(1, { message: "Please select an option." }),
    confusingPages: z.string().min(1, { message: "This field is required." }),
    mobileFriendly: z.string().min(1, { message: "Please select an option." }),
  }),
  designBranding: z.object({
    overallRating: z.coerce
      .number({
        error: "Please rate the overall design and branding.",
      })
      .min(1, "Rating must be 1-10")
      .max(10, "Rating must be 1-10"),

    suitableForPremium: z
      .string()
      .min(1, { message: "Please select an option." }),
    visuallyAppealing: z
      .string()
      .min(1, { message: "Please select an option." }),
    outdatedUnprofessional: z
      .string()
      .min(1, { message: "This field is required." }),
  }),
  understandingService: z.object({
    matchmakingProcess: z
      .string()
      .min(1, { message: "This field is required." }),
    matchmakingVsAppsClear: z
      .string()
      .min(1, { message: "Please select an option." }),
    missingInfo: z.string().min(1, { message: "This field is required." }),
  }),
  trustSafety: z.object({
    feelSafe: z.string().min(1, { message: "Please select an option." }),
    explainPrivacy: z.string().min(1, { message: "Please select an option." }),
    increaseTrust: z.string().min(1, { message: "This field is required." }),
  }),
  contentQuality: z.object({
    englishEasy: z.string().min(1, { message: "Please select an option." }),
    thaiNatural: z.string().min(1, { message: "Please select an option." }),
    serviceDescriptionLength: z
      .string()
      .min(1, { message: "Please select an option." }),
  }),
  registrationProcess: z.object({
    formEaseRating: z.coerce
      .number({
        error: "Please rate the form ease.",
      })
      .min(1, "Rating must be 1-10")
      .max(10, "Rating must be 1-10"),
    unnecessaryQuestions: z
      .string()
      .min(1, { message: "This field is required." }),
    stoppedAt: z.string().min(1, { message: "This field is required." }),
  }),
  pricingValue: z.object({
    pricingEasyToUnderstand: z
      .string()
      .min(1, { message: "Please select an option." }),
    expectedServiceTier: z
      .string()
      .min(1, { message: "Please select an option." }),
    worthThePriceExplained: z
      .string()
      .min(1, { message: "Please select an option." }),
  }),
  overallExperience: z.object({
    mostLiked: z.string().min(1, { message: "This field is required." }),
    leastLiked: z.string().min(1, { message: "This field is required." }),
    oneChange: z.string().min(1, { message: "This field is required." }),
    considerJoining: z.string().min(1, { message: "Please select an option." }),
    considerJoiningReason: z
      .string()
      .min(1, { message: "This field is required." }),
  }),
  matchmakingSpecific: z.object({
    considerJoiningService: z
      .string()
      .min(1, { message: "Please select an option." }),
    concernsBeforeJoining: z
      .string()
      .min(1, { message: "This field is required." }),
    understandBenefits: z
      .string()
      .min(1, { message: "Please select an option." }),
    processClearlyExplained: z
      .string()
      .min(1, { message: "Please select an option." }),
    whatWouldEncourageSignUp: z
      .string()
      .min(1, { message: "This field is required." }),
  }),
  reviewerInfo: z
    .object({
      name: z.string().min(1, "Name is required."),
      email: z.string().email("Invalid email format."),
    })
    .optional()
    .nullable(),
})

