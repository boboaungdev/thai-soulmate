import { chromium } from "playwright"
import { BASE_URL } from "@/constants"

export async function generateProfilePdf(profileId: string) {
  const browser = await chromium.launch({
    headless: true,
  })

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1200,
        height: 1600,
      },
    })

    const url = `${BASE_URL}/print/profile/${profileId}`

    console.log("Generating PDF:", url)

    await page.goto(url, {
      waitUntil: "networkidle",
    })

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready)

    // Wait for images
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

    return pdf
  } finally {
    await browser.close()
  }
}
