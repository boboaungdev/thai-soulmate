import fs from "node:fs"
import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"
import { env } from "./env"

// For linux
const LOCAL_BRAVE_PATH = "/usr/bin/brave"

let cachedExecutablePath: string | null = null

export async function launchBrowser() {
  if (process.env.NODE_ENV === "development") {
    if (!fs.existsSync(LOCAL_BRAVE_PATH)) {
      throw new Error(`Brave not found at ${LOCAL_BRAVE_PATH}`)
    }

    return puppeteer.launch({
      executablePath: LOCAL_BRAVE_PATH,
      headless: true,
    })
  }

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
