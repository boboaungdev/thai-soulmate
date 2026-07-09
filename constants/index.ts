export const APP_INFO = {
  name: "Thai Soulmate",
  tagline: "1-2-1 Matchmaking",
  secondaryTagline:
    "Real People. Real Relationships. Personally Matched in Thailand.",
  companyName: "Thai Soulmate Co., Ltd.",
} as const

export const CONTACT = {
  email: "contact@thaisoulmate.com",
  whatsapp: "447956385061",
  facebook: "https://facebook.com/thaisoulmate",
  line: "https://line.me/R/ti/p/thaisoulmate",
  instagram: "https://instagram.com/thaisoulmate",
  primaryPhone: "+44 79 563 85061",
  secondaryPhone: "+66 69 999 9999",
} as const

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const RESEND = {
  API_KEY: process.env.RESEND_API_KEY,
  EMAIL_ADDRESS: 'boboaungdev@gmail.com',
} as const

export const STRIPE = {
  PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  PLANS: {
    oneMonth: "price_1TrDiKRGO2DKoZ4YValprXFX",
    threeMonth: "price_1TrDkhRGO2DKoZ4YVUzTLZfF",
    sixMonth: "price_1TrDljRGO2DKoZ4YzZJqMLAp",
  },
} as const
