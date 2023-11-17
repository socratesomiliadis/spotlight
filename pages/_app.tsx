import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "@/components/Layout";
import PreloaderProvider from "@/hooks/usePreloader";
import AuthPopupProvider from "@/hooks/useAuthPopup";
import { MyUserContextProvider } from "@/utils/getUser";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import HeaderThemeProvider from "@/hooks/useHeaderTheme";
import { useRouter } from "next/router";

export const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
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
          {/* <MyUserContextProvider> */}
          <HeaderThemeProvider>
            <PreloaderProvider>
              <AuthPopupProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </AuthPopupProvider>
            </PreloaderProvider>
          </HeaderThemeProvider>
          {/* </MyUserContextProvider> */}
        </div>
      </ClerkProvider>
    </NextUIProvider>
  );
}
