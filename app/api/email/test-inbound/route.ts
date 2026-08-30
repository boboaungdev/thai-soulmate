import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { EMAIL_ACCOUNTS } from "@/constants/email"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const mailbox = body.mailbox || "contact"
    const fromName = body.fromName || "Liam Walker"
    const fromEmail = body.fromEmail || "liam.walker@example.com"
    const subject = body.subject || "Inquiry regarding 1-to-1 Matchmaking Service"
    const text = body.text || "Hello Thai Soulmate team, I would like to inquire about your matchmaking services and membership plans. Looking forward to your response."
    const html = body.html || `<p>${text}</p>`

    const accountConfig = EMAIL_ACCOUNTS.find(
      (a) => a.id === mailbox || a.email.toLowerCase() === mailbox.toLowerCase()
    )
    const targetEmail = accountConfig ? accountConfig.email : `${mailbox}@thaisoulmate.org`

    const emailId = crypto.randomUUID()

    const createdEmail = await prisma.emailMessage.create({
      data: {
        id: emailId,
        resendId: `test_${emailId}`,
        mailbox,
        folder: "INBOX",
        direction: "INBOUND",
        fromEmail,
        fromName,
        toEmails: [targetEmail],
        ccEmails: [],
        bccEmails: [],
        subject,
        preview: text.slice(0, 200),
        bodyText: text,
        bodyHtml: html,
        isRead: false,
        isStarred: false,
        isArchived: false,
        isTrash: false,
        receivedAt: new Date(),
      },
      include: {
        attachments: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Test inbound email created for ${targetEmail}`,
      data: createdEmail,
    })
  } catch (error: any) {
    console.error("Error in test-inbound:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create test inbound email" },
      { status: 500 }
    )
  }
}
