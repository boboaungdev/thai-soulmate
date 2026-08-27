import { Plan } from "@/types"
import { env } from "@/lib/env"

export const APP_INFO = {
  name: "Thai Soulmate",
  tagline: "1-2-1 Matchmaking Service",
  secondaryTagline:
    "Real People. Real Relationships.\nPersonally Matched in Thailand.",
  companyName: "Thai Soulmate Co., Ltd.",
} as const

export const CONTACT = {
  website: "thaisoulmate.org",
  email: "contact@thaisoulmate.org",
  whatsapp: "https://wa.me/66636915263",
  facebook: "https://facebook.com/thaisoulmates",
  line: "https://line.me/ti/p/~thaisoulmate",
  instagram: "https://instagram.com/thaisoulmate",
  tiktok: "https://tiktok.com/@thaisoulmate",
  primaryPhone: "+66 6369 15263",
  secondaryPhone: "+66 6369 15264",
} as const

export const EMAIL = {
  contact: "contact@thaisoulmate.org",
  notify: "notify@thaisoulmate.org",
} as const

export const PLANS: Plan[] = [
  {
    id: "1-month",
    name: "1 Month",
    priceIds: {
      subscription: env.STRIPE.priceIds.subscription.oneMonth,
      oneTime: env.STRIPE.priceIds.oneTime.oneMonth,
    },
    price: "฿29,999",
    duration: { paid: "1 month", total: "2 months" },
    recurringInterval: { paid: "1 month", total: "2 months" },
    features: [
      "1-2-1 Personal Matchmaker",
      "Hand Picked Matches",
      "Robust Security Measures",
      "Discreet Introduction",
      "Video Chat",
      "Data Privacy",
    ],
    pricePerMonth: "฿15,000/mo",
  },
  {
    id: "3-months",
    name: "3 Months",
    priceIds: {
      subscription: env.STRIPE.priceIds.subscription.threeMonth,
      oneTime: env.STRIPE.priceIds.oneTime.threeMonth,
    },
    price: "฿34,999",
    duration: { paid: "3 months", total: "6 months" },
    recurringInterval: { paid: "3 months", total: "6 months" },
    pricePerMonth: "≈ ฿5,833/mo",
    features: [
      "1-2-1 Personal Matchmaker",
      "Hand Picked Matches",
      "Robust Security Measures",
      "Discreet Introduction",
      "Video Chat",
      "Data Privacy",
    ],
    popular: true,
  },
  {
    id: "6-months",
    name: "6 Months",
    priceIds: {
      subscription: env.STRIPE.priceIds.subscription.sixMonth,
      oneTime: env.STRIPE.priceIds.oneTime.sixMonth,
    },
    price: "฿49,999",
    duration: { paid: "6 months", total: "12 months" },
    recurringInterval: { paid: "6 months", total: "12 months" },
    pricePerMonth: "≈ ฿4,167/mo",
    features: [
      "1-2-1 Personal Matchmaker",
      "Hand Picked Matches",
      "Robust Security Measures",
      "Discreet Introduction",
      "Video Chat",
      "Data Privacy",
    ],
  },
]
