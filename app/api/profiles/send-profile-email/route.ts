import { APP_INFO, BASE_URL, EMAIL } from "@/constants"
import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { id, email } = await req.json()

    const browser = await puppeteer.launch({
      headless: true,
    })

    const page = await browser.newPage()

    const url = `${BASE_URL}/print/profile/${id}`

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    })

    await page.goto(url, {
      waitUntil: "networkidle0",
    })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    })

    const pdfBuffer = Buffer.from(pdf)

    console.log(pdfBuffer.length)

    await browser.close()

    await resend.emails.send({
      from: `${APP_INFO.name} <${EMAIL.noreply}>`,
      to: ["boolean405@gmail.com"],
      subject: "Your Profile",
      html: `
        <h2>Your profile</h2>
        <p>Please find your profile attached.</p>
      `,
      attachments: [
        {
          filename: "profile.pdf",
          content: pdfBuffer.toString("base64"),
        },
      ],
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed",
      },
      {
        status: 500,
      }
    )
  }
}
