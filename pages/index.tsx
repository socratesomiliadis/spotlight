import ExploreAwards from '@/components/Home/ExploreAwards';
import HeroSection from '@/components/Home/HeroSection';
import Head from 'next/head';

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
      <main className="">
        <HeroSection />
        <ExploreAwards />
      </main>
    </>
  );
}
