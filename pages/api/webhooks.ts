import { Webhook } from "svix";
import { Readable } from "node:stream";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteUserRecord, upsertUserRecord } from "@/utils/supa-admin";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const secret = process.env.CLERK_WEBOOHK_SECRET as string;

const relevantEvents = new Set([
  "user.created",
  "user.updated",
  "user.deleted",
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = (await buffer(req)).toString();
  const headers = req.headers as any;

  const wh = new Webhook(secret);
  let msg: any;
  try {
    msg = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({});
  }

  if (relevantEvents.has(msg.type)) {
    try {
      switch (msg.type) {
        case "user.created":
          upsertUserRecord(msg.data);
          break;
        case "user.updated":
          upsertUserRecord(msg.data);
          break;
        case "user.deleted":
          deleteUserRecord(msg.data.id);
          break;
      }
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send('Webhook error: "Webhook handler failed. View logs."');
    }
  }
}