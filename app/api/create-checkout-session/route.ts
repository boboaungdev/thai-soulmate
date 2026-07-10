import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { BASE_URL } from "@/constants"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { priceId, email, mode } = body

    if (!priceId || !email || !mode) {
      return new NextResponse("Price ID, email, and mode are required", {
        status: 400,
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/payment/cancelled`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("[CREATE_CHECKOUT_SESSION_ERROR]", error)
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}