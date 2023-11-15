import { motion } from "framer-motion";
import { useEffect } from "react";
import { gsap } from "gsap";
import Head from "next/head";
import SignIn from "@/components/Auth/SignIn/SignIn";

export default function OnBoarding() {
  useEffect(() => {
    gsap.to("header", {
      opacity: 0,
      duration: 0.4,
      pointerEvents: "none",
    });

    return () => {
      gsap.to("header", {
        opacity: 1,
        duration: 0.4,
        pointerEvents: "all",
      });
    };
  }, []);
  return (
    <>
      <Head>
        <title>Sign In — Spotlight</title>
        <meta
          name="description"
          content="Spotlight is the no.1 Digital Awards issuer that recognizes and promotes the talent and effort of the best developers, designers and web agencies in the world."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Sign Up — Spotlight" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Spotlight is the no.1 Digital Awards issuer that recognizes and promotes the talent and effort of the best developers, designers and web agencies in the world."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1600" />
        <meta property="og:image:height" content="900" />
        <meta property="og:image:alt" content="Sign Up — Spotlight" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: "easeOut",
          },
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.2,
            ease: "easeOut",
          },
        }}
        className="bg-white sign-up flex items-center justify-center"
      >
        <SignIn />
      </motion.div>
    </>
  );
}
