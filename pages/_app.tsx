import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import Layout from "@/components/Layout";
import PreloaderProvider from "@/hooks/usePreloader";
import AuthPopupProvider from "@/hooks/useAuthPopup";
import { MyUserContextProvider } from "@/utils/getUser";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";

export const inter = Inter({ subsets: ["latin"], display: "swap" });

export const acidGrotesk = localFont({
  src: [
    {
      path: "./fonts/AcidGrotesk-Normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/AcidGrotesk-Regular.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          fontFamily: inter.style.fontFamily,
          colorPrimary: "#1400FF",
          colorAlphaShade: "#0f0f0f",
        },
        elements: {
          badge: "pt-1 pb-[0.1rem] px-2 text-xs",
        },
      }}
      {...pageProps}
    >
      <div className={`${inter.className} font-wrapper`}>
        <MyUserContextProvider>
          <PreloaderProvider>
            <NextUIProvider>
              <AuthPopupProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </AuthPopupProvider>
            </NextUIProvider>
          </PreloaderProvider>
        </MyUserContextProvider>
      </div>
    </ClerkProvider>
  );
}
