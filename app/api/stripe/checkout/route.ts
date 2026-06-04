import { NextRequest, NextResponse } from "next/server"

import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"
import { stripe, STRIPE_CONFIG } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const checkoutState = await fetchAuthQuery(
      api.subscriptions.getCurrentForCheckout
    ).catch(() => null)

    if (!checkoutState) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (checkoutState.activeSubscription) {
      return NextResponse.json(
        { error: "User already has an active subscription" },
        { status: 400 }
      )
    }

    // Create or retrieve Stripe customer
    let customer
    if (checkoutState.stripeCustomerId) {
      customer = await stripe.customers.retrieve(checkoutState.stripeCustomerId)
    } else {
      customer = await stripe.customers.create({
        email: checkoutState.email,
        metadata: {
          clerk_user_id: checkoutState.userId,
          auth_user_id: checkoutState.userId,
          username: checkoutState.username,
        },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_CONFIG.PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/premium`,
      metadata: {
        clerk_user_id: checkoutState.userId,
        auth_user_id: checkoutState.userId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
