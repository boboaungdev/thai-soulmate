import { BASE_URL } from "@/constants"

export async function generateProfilePdf(profileId: string) {
  const url = `${BASE_URL}/print/profile/${profileId}`

  const response = await fetch(
    `https://production-sfo.browserless.io/pdf?token==${process.env.BROWSERLESS_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,

        options: {
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,

          margin: {
            top: "10mm",
            right: "10mm",
            bottom: "10mm",
            left: "10mm",
          },
        },

        gotoOptions: {
          waitUntil: "networkidle2",
          timeout: 30000,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()

    throw new Error(`PDF generation failed: ${response.status} ${error}`)
  }

  const arrayBuffer = await response.arrayBuffer()

  return Buffer.from(arrayBuffer)
}
