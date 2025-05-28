import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { deleteUser } from "@/lib/supabase/actions";
import { upsertUser } from "@/lib/supabase/actions";
import type { NextApiRequest, NextApiResponse } from "next";

export async function clerkWebhook(req: NextApiRequest, res: NextApiResponse) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  // Get headers
  const headerPayload = req.headers;
  const svix_id = headerPayload["svix-id"];
  const svix_timestamp = headerPayload["svix-timestamp"];
  const svix_signature = headerPayload["svix-signature"];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing Svix headers" });
  }

  // Get body
  const payload = req.body;
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return res.status(400).json({ error: "Verification error" });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  if (!evt.data.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    switch (eventType) {
      case "user.created":
        await upsertUser(evt.data);
        break;
      case "user.updated":
        await upsertUser(evt.data);
        break;
      case "user.deleted":
        await deleteUser(evt.data.id);
        break;
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Webhook handler failed. View logs." });
  }

  return res.status(200).json({ message: "Webhook received" });
}
