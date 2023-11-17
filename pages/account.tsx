import Account from "@/components/Account";
import Head from "next/head";

export default function AccountPage() {
  return (
    <>
      <Head>
        <title>Account — Spotlight</title>
        <meta
          name="description"
          content="Spotlight is the no.1 Digital Awards issuer that recognizes and promotes the talent and effort of the best developers, designers and web agencies in the world."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Account — Spotlight" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Spotlight is the no.1 Digital Awards issuer that recognizes and promotes the talent and effort of the best developers, designers and web agencies in the world."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1600" />
        <meta property="og:image:height" content="900" />
        <meta property="og:image:alt" content="Account — Spotlight" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <div className="account flex items-center justify-center">
        <Account />
      </div>
    </>
  );
}
