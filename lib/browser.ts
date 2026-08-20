import fs from "node:fs"
import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"

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

  if (!cachedExecutablePath) {
    // This will download the browser if it's not already cached
    cachedExecutablePath = await chromium.executablePath()
  }

  return puppeteer.launch({
    args: chromium.args,
    executablePath: cachedExecutablePath,
    headless: true, // Use modern headless mode
  })
}
