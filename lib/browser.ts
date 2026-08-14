import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"

let cachedExecutablePath: string | null = null

export async function launchBrowser() {
  const isDevelopment = process.env.NODE_ENV === "development"

  // Local Mac development
  // if (isDevelopment) {
  //   return puppeteer.launch({
  //     executablePath:
  //       process.env.CHROME_EXECUTABLE_PATH ??
  //       "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  //     headless: true,
  //   })
  // }

  // Vercel / production
  const chromiumPackUrl = process.env.CHROMIUM_PACK_URL

  if (!chromiumPackUrl) {
    throw new Error("CHROMIUM_PACK_URL is not configured")
  }

  if (!cachedExecutablePath) {
    cachedExecutablePath = await chromium.executablePath(chromiumPackUrl)
  }

  return puppeteer.launch({
    args: chromium.args,
    executablePath: cachedExecutablePath,
    headless: "shell",
  })
}
