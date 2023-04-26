import IndividualSection from "@/components/Subscribe/IndividualSection";
import Head from "next/head";

export default function Subscribe() {
  return (
    <>
      <Head>
        <title>Spotlight — Subscribe</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta
          content="Spotlight is the no.1 Digital Awards issuer that recognizes and promotes the talent and effort of the best developers, designers and web agencies in the world."
          name="description"
        />
      </Head>
      <main className="bg-white relative">
        <IndividualSection />
        {/* <div className="h-[500vh] bg-white"></div> */}
      </main>
    </>
  );
}
