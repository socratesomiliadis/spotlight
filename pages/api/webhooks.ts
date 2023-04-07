import { Webhook } from "svix";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteUserRecord, upsertUserRecord } from "@/utils/supa-admin";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

const secret = process.env.CLERK_WEBHOOK_SECRET as string;

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = (await buffer(req)).toString();
  const headers = req.headers as any;

  res.status(400).send("Webhook error: " + payload);

  const wh = new Webhook(secret);
  let msg: any;
  try {
    msg = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({});
  }

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
    res.status(400).send('Webhook error: "Webhook handler failed. View logs."');
  }
};
export default webhookHandler;
