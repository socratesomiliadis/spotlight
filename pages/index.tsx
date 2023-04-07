import ExploreAwards from "@/components/Home/ExploreAwards";
import ExploreTextSection from "@/components/Home/ExploreTextSection";
import FeaturedStudios from "@/components/Home/FeaturedStudios";
import HeroSection from "@/components/Home/HeroSection";
import { upsertUserRecord } from "@/utils/supa-admin";
import Head from "next/head";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Spotlight — Digital Awards</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta
          content="Spotlight is the no.1 Digital Awards issuer that recognizes and promotes the talent and effort of the best developers, designers and web agencies in the world."
          name="description"
        />
      </Head>
      <main className="bg-white">
        <HeroSection />
        <ExploreAwards />
        <FeaturedStudios />
        <ExploreTextSection />
        {/* <div className="h-[500vh] bg-white"></div> */}
      </main>
    </>
  );
}
