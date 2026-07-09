import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { BASE_URL, STRIPE } from "@/constants"

export async function POST(req: Request) {
  try {
    const { plan } = await req.json()

    const priceId = STRIPE.PLANS[plan as keyof typeof STRIPE.PLANS]

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${BASE_URL}/payment/cancel`,
    })

    return NextResponse.json({
      url: session.url,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Checkout creation failed",
      },
      {
        status: 500,
      }
    )
  }
}
