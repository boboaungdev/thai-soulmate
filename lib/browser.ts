import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"

export async function launchBrowser() {
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  })
}
