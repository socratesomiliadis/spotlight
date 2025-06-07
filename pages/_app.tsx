import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { HeroUIProvider } from "@heroui/react";
import MainLayout from "@/components/main-layout";
import { NuqsAdapter } from "nuqs/adapters/next/pages";

export const helveticaNeue = localFont({
  src: [
    {
      path: "../fonts/HelveticaNeue-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNeue-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica-neue",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NuqsAdapter>
      <ClerkProvider>
        <HeroUIProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </HeroUIProvider>
      </ClerkProvider>
    </NuqsAdapter>
  );
}
