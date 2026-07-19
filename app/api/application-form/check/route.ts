import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json(
      {
        exists: false,
      },
      {
        status: 400,
      }
    )
  }

  const application = await prisma.applicationForm.findFirst({
    where: {
      contact: {
        path: ["email"],
        equals: email,
      },
    },
  })

  return NextResponse.json({
    exists: !!application,
  })
}
