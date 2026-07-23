import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const registerInterest = await prisma.registerInterest.findUnique({
    where: { id },
  })

  if (!registerInterest) {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  return NextResponse.json(registerInterest)
}
