import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
})

export const STRIPE_CONFIG = {
  PRICE_ID: process.env.STRIPE_PRICE_ID!,
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
} as const
