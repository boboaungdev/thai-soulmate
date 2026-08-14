import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"
import { env } from "./env"

let cachedExecutablePath: string | null = null

export async function launchBrowser() {
  const chromiumPackUrl = env.CHROMIUM_PACK_URL

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
