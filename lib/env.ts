export const env = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

  DATABASE_URL: process.env.DATABASE_URL,

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_WEBHOOK_SECRET: process.env.RESEND_WEBHOOK_SECRET,

  CHROMIUM_EXECUTABLE_PATH:
    process.env.CHROMIUM_EXECUTABLE_PATH || "/usr/bin/brave",

  R2: {
    BUCKET: process.env.R2_BUCKET,
    ENDPOINT: process.env.R2_ENDPOINT,
    PUBLIC_URL: process.env.R2_PUBLIC_URL,
    ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  },
} as const
