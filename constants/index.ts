import { Plan } from "@/types"

export const APP_INFO = {
  name: "Thai Soulmate",
  tagline: "1-2-1 Matchmaking Service",
  secondaryTagline:
    "Real People. Real Relationships.\nPersonally Matched in Thailand.",
  companyName: "Thai Soulmate Co., Ltd.",
} as const

export const CONTACT = {
  email: "contact@thaisoulmate.com",
  whatsapp: "447956385061",
  facebook: "https://facebook.com/thaisoulmate",
  line: "https://line.me/R/ti/p/thaisoulmate",
  instagram: "https://instagram.com/thaisoulmate",
  primaryPhone: "+66 69 999 8888",
  secondaryPhone: "+66 69 999 9999",
} as const

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const DATABASE = {
  DATABASE_URL: process.env.DATABASE_URL,
} as const

export const EMAIL = {
  noreply: "bobo@kkhay.com",
  contact: "boboaungdev@gmail.com",
}

export const NODEMAILER = {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
} as const

export const STRIPE = {
  PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  PLANS: {
    priceIds: {
      subscription: {
        oneMonth: "price_1Trd7hRGO2DKoZ4YKjKdPnAL",
        threeMonth: "price_1Trd5gRGO2DKoZ4Ykj426kku",
        sixMonth: "price_1Trd8nRGO2DKoZ4YWTw2mAKh",
      },
      oneTime: {
        oneMonth: "price_1Trd7iRGO2DKoZ4YgovfP0md",
        threeMonth: "price_1Trcq0RGO2DKoZ4YyYezqShF",
        sixMonth: "price_1Trd8nRGO2DKoZ4YIxDirV8C",
      },
    },
  },
} as const

export const PLANS: Plan[] = [
  {
    id: "1-month",
    name: "1 Month",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.oneMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.oneMonth,
    },
    price: "฿29,999",
    duration: { paid: "1 month", total: "2 months" },
    recurringInterval: { paid: "1 month", total: "2 months" },
    features: [
      "Get 1 month FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
    pricePerMonth: "฿15,000/mo",
  },
  {
    id: "3-months",
    name: "3 Months",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.threeMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.threeMonth,
    },
    price: "฿34,999",
    duration: { paid: "3 months", total: "6 months" },
    recurringInterval: { paid: "3 months", total: "6 months" },
    pricePerMonth: "≈ ฿5,833/mo",
    features: [
      "Get 3 months FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
    popular: true,
  },
  {
    id: "6-months",
    name: "6 Months",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.sixMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.sixMonth,
    },
    price: "฿49,999",
    duration: { paid: "6 months", total: "12 months" },
    recurringInterval: { paid: "6 months", total: "12 months" },
    pricePerMonth: "≈ ฿4,167/mo",
    features: [
      "Get 6 months FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
  },
]
