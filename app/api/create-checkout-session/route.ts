import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const plans = {
  basic: "price_basic123",
  pro: "price_pro456",
  premium: "price_premium789",
};

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    const priceId = plans[plan as keyof typeof plans];

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({
      url: session.url,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Checkout creation failed",
      },
      {
        status: 500,
      }
    );
  }
}