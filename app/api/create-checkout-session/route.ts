import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { BASE_URL } from "@/constants"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { priceId, mode, autoRenew, plan } = body

    if (!priceId || !mode || autoRenew === undefined || !plan) {
      return NextResponse.json(
        {
          error: "Price ID, user data, mode, autoRenew, and plan are required",
        },
        { status: 400 }
      )
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${BASE_URL}/application-form?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${plan}&autoRenew=${autoRenew}`,
      cancel_url: `${BASE_URL}/application-form?canceled=true&session_id={CHECKOUT_SESSION_ID}&plan=${plan}&autoRenew=${autoRenew}`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("[CREATE_CHECKOUT_SESSION_ERROR]", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
