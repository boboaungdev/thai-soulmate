import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { BASE_URL } from "@/constants"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { priceId, userData, mode } = body

    if (!priceId || !userData || !mode) {
      return new NextResponse("Price ID, user data, and mode are required", {
        status: 400,
      })
    }

    const encodedUserData = Buffer.from(JSON.stringify(userData)).toString(
      "base64"
    )

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: userData.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${BASE_URL}/auth?mode=register&step=profile-setup&userData=${encodedUserData}&success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing?userData=${encodedUserData}&canceled=true&session_id={CHECKOUT_SESSION_ID}`,
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
