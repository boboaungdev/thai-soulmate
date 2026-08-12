import { launchBrowser } from "./browser"

export async function generateProfilePdf(url: string): Promise<Buffer> {
  const browser = await launchBrowser()

  try {
    const page = await browser.newPage()

    await page.goto(url, {
      waitUntil: "networkidle0",
    })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    })

    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
