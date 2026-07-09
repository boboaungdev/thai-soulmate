export const APP_INFO = {
  name: "Thai Soulmate",
  tagline: "1-2-1 Matchmaking",
  secondaryTagline:
    "Real People. Real Relationships. Personally Matched in Thailand.",
  companyName: "Thai Soulmate Co., Ltd.",
} as const

export const CONTACT = {
  email: "boboaungdev@gmail.com",
  whatsapp: "447956385061",
  facebook: "https://facebook.com/thaisoulmate",
  line: "https://line.me/R/ti/p/thaisoulmate",
  instagram: "https://instagram.com/thaisoulmate",
  phone: "+44 7956 385061",
} as const

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const RESEND_API_KEY = process.env.RESEND_API_KEY

export const STRIPE = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  PLANS: {
    oneMonth: "price_1TrDiKRGO2DKoZ4YValprXFX",
    threeMonths: "price_1TrDkhRGO2DKoZ4YVUzTLZfF",
    sixMonths: "price_1TrDljRGO2DKoZ4YzZJqMLAp",
  },
} as const
