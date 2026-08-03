import { APP_INFO, BASE_URL, EMAIL } from "@/constants"
import { SendFemaleMatchEmail, SendMaleMatchEmail } from "@/emails"
import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

import { resend } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    const { profile, to, profileId } = await req.json()

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    const url = `${BASE_URL}/print/profile/${profileId}`

    await page.goto(url, {
      waitUntil: "networkidle0",
    })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    })

    const pdfBuffer = Buffer.from(pdf)

    await browser.close()

    const reactEmail =
      to.gender.toUpperCase() === "FEMALE"
        ? SendFemaleMatchEmail({ to })
        : SendMaleMatchEmail({ profileId, to })

    await resend.emails.send({
      from: `${APP_INFO.name} <${EMAIL.contact}>`,
      // to: [to.email],
      to: ['boolean405@gmail.com'],
      subject:
        to.gender.toUpperCase() === "FEMALE"
          ? "A Potential Match Has Been Selected for You"
          : "Your Match Has Accepted – Please Review Her Profile",
      react: reactEmail,
      attachments: [
        {
          filename: `Match profile - ${profile.prefix} ${profile.name}.pdf`,
          content: pdfBuffer,
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
