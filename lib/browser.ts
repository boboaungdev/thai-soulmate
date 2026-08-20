import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium"
import { env } from "./env"

export async function launchBrowser() {
  const isProduction = process.env.NODE_ENV === "production"

  const executablePath = isProduction
    ? await chromium.executablePath()
    : env.CHROMIUM_EXECUTABLE_PATH

  if (!executablePath) {
    throw new Error(
      "Chrome executable path is not configured. Set CHROMIUM_EXECUTABLE_PATH in .env"
    )
  }

  return puppeteer.launch({
    args: isProduction ? chromium.args : [],
    executablePath,
    headless: true,
  })
}
