import { Webhook } from "svix";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteUserRecord, upsertUserRecord } from "@/utils/supa-admin";
import { Readable } from "node:stream";

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

const secret = "whsec_55+UNQDPCMKc7Uf9KUFCKkQvbZqTa/mV";

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = (await buffer(req)).toString();
  const headers = req.headers as any;

  const wh = new Webhook(secret);
  let msg: any;
  try {
    msg = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({});
  }

  // res.status(400).json({ msg });

  try {
    switch (msg.data.type) {
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
    res.status(400).send('Webhook error: "Webhook handler failed. View logs."');
  }

  res.status(200).json({});
};
export default webhookHandler;
