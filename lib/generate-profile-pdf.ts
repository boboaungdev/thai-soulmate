import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium"

import { BASE_URL } from "@/constants"

export async function generateProfilePdf(profileId: string) {
  const url = `${BASE_URL}/print/profile/${profileId}`

  console.log("Generating profile PDF:", url)

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  })

  try {
    const page = await browser.newPage()

    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 1,
    })

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    })

    // Make sure fonts are loaded
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    // Make sure profile images are loaded
    await page.evaluate(async () => {
      await Promise.all(
        Array.from(document.images).map((img) => {
          if (img.complete) {
            return Promise.resolve()
          }

          return new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve())
            img.addEventListener("error", () => resolve())
          })
        })
      )
    })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,

      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    })

    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
