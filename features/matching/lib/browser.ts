import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"

import { env } from "@/lib/env"

export async function launchBrowser() {
  const isProduction = process.env.NODE_ENV === "production"

  const executablePath = isProduction
    ? await chromium.executablePath(env.CHROMIUM_PACK_URL)
    : "/usr/bin/brave"

  if (!executablePath) {
    throw new Error(
      "Chromium executable path is not configured. Set CHROMIUM_PACK_URL in production."
    )
  }

  return puppeteer.launch({
    args: isProduction ? chromium.args : [],
    executablePath,
    headless: true,
  })
}
