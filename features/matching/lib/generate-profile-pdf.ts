import { launchBrowser } from "./browser"

type Browser = Awaited<ReturnType<typeof launchBrowser>>

export async function generateProfilePdf(
  browser: Browser,
  url: string
): Promise<Buffer> {
  const page = await browser.newPage()

  try {
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    })

    await page.waitForSelector("#printable-area", {
      timeout: 10_000,
    })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    })

    return Buffer.from(pdf)
  } finally {
    await page.close()
  }
}
