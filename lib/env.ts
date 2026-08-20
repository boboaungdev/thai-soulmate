export const env = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

  DATABASE_URL: process.env.DATABASE_URL,

  RESEND_API_KEY: process.env.RESEND_API_KEY,

  CHROMIUM_EXECUTABLE_PATH:
    process.env.CHROMIUM_EXECUTABLE_PATH || "/usr/bin/brave",

  R2: {
    BUCKET: process.env.R2_BUCKET,
    ENDPOINT: process.env.R2_ENDPOINT,
    PUBLIC_URL: process.env.R2_PUBLIC_URL,
    ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  },

  STRIPE: {
    PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

    SECRET_KEY: process.env.STRIPE_SECRET_KEY,

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
