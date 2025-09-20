import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import { stripe, STRIPE_CONFIG } from "@/lib/stripe"
import {
  deleteSubscription,
  upsertSubscription,
} from "@/lib/supabase/actions/subscriptions"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    console.error("No Stripe signature found")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.WEBHOOK_SECRET
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await handleSubscriptionChange(subscription)
        }
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await deleteSubscription(subscription.id)
        console.log(`Subscription deleted: ${subscription.id}`)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any

        if (invoice.subscription && typeof invoice.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          )
          await handleSubscriptionChange(subscription)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any

        if (invoice.subscription && typeof invoice.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          )
          await handleSubscriptionChange(subscription)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function handleSubscriptionChange(subscription: any) {
  try {
    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    )

    if (!customer || customer.deleted) {
      console.error("Customer not found or deleted")
      return
    }

    const clerkUserId = customer.metadata?.clerk_user_id

    if (!clerkUserId) {
      console.error("No clerk_user_id found in customer metadata")
      return
    }

    const priceId = subscription.items?.data?.[0]?.price?.id

    await upsertSubscription({
      user_id: clerkUserId,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status: subscription.status,
      current_period_start: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000).toISOString()
        : undefined,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : undefined,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })

    console.log(
      `Subscription ${subscription.status}: ${subscription.id} for user: ${clerkUserId}`
    )
  } catch (error) {
    console.error("Error handling subscription change:", error)
    throw error
  }
}
