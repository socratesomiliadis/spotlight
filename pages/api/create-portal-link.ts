import { NextApiHandler } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { stripe } from "@/utils/stripe";
import { createOrRetrieveCustomer } from "@/utils/supa-admin";
import { getURL } from "@/utils/helpers";

const CreatePortalLink: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { userId, user } = getAuth(req);
    try {
      if (!user) throw Error("Could not get user");
      const primaryEmail = user?.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      )?.emailAddress;

      const customer = await createOrRetrieveCustomer({
        userId: userId || "",
        email: primaryEmail || "",
      });

      if (!customer) throw Error("Could not get customer");
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/account`,
      });

      return res.status(200).json({ url });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default CreatePortalLink;
