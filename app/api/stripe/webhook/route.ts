import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { api } from "@/convex/_generated/api"
import { ConvexHttpClient } from "convex/browser"
import Stripe from "stripe"

import { stripe, STRIPE_CONFIG } from "@/lib/stripe"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
const convexStripeWebhookSecret =
  process.env.CONVEX_STRIPE_WEBHOOK_SECRET || STRIPE_CONFIG.WEBHOOK_SECRET

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
        await convex.mutation(api.subscriptions.deleteByStripeSubscriptionId, {
          webhookSecret: convexStripeWebhookSecret,
          stripeSubscriptionId: subscription.id,
        })
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

    const authUserId =
      customer.metadata?.auth_user_id || customer.metadata?.clerk_user_id

    if (!authUserId) {
      console.error("No auth user id found in customer metadata")
      return
    }

    const priceId = subscription.items?.data?.[0]?.price?.id

    await convex.mutation(api.subscriptions.upsert, {
      webhookSecret: convexStripeWebhookSecret,
      userAuthUserId: authUserId,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000).toISOString()
        : undefined,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : undefined,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    })

    console.log(
      `Subscription ${subscription.status}: ${subscription.id} for user: ${authUserId}`
    )
  } catch (error) {
    console.error("Error handling subscription change:", error)
    throw error
  }
}
