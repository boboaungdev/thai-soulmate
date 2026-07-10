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
