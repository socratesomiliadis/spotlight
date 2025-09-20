import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { Webhook } from "svix"

import { deleteUser, upsertUser } from "@/lib/supabase/actions"
import { finalizeAccountClaim } from "@/lib/supabase/actions/claim"

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env"
    )
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error: Could not verify webhook:", err)
    return new Response("Error: Verification error", {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  console.log("Webhook payload:", body)

  if (!evt.data.id) {
    return new Response("Error: User ID is missing", {
      status: 400,
    })
  }

  try {
    switch (eventType) {
      case "user.created":
        await upsertUser(evt.data)
        break
      case "user.updated":
        await upsertUser(evt.data, true)

        // Check if this is an unclaimed account being claimed
        // We look for accounts that have is_unclaimed=true but now have password_enabled=true
        const wasUnclaimed = evt.data.public_metadata?.is_unclaimed
        const hasPassword = evt.data.password_enabled

        if (wasUnclaimed && hasPassword) {
          try {
            await finalizeAccountClaim(evt.data.id)
            console.log(`Account claimed for user: ${evt.data.id}`)

            // Log that the claim was successful - the success page will handle the redirect
            console.log(
              `Claim completed for user ${evt.data.id} (${evt.data.username})`
            )
          } catch (error) {
            console.error(
              `Failed to finalize claim for user ${evt.data.id}:`,
              error
            )
          }
        }
        break
      case "user.deleted":
        await deleteUser(evt.data.id)
        break
      case "session.created":
        // Additional check for when a session is created for an unclaimed account
        // This catches cases where the account is accessed via password reset
        const sessionData = evt.data as any
        if (sessionData.user_id) {
          // We'll check the user's metadata in the webhook to see if they need to be claimed
          // This is handled in the user.updated event above when password is enabled
        }
        break
    }
  } catch (error) {
    console.log(error)
    return new Response("Webhook error: 'Webhook handler failed. View logs.'", {
      status: 400,
    })
  }

  return new Response("Webhook received", { status: 200 })
}
