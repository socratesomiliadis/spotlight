import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { HeroUIProvider } from "@heroui/react";
import localFont from "next/font/local";
import BottomNav from "@/components/BottomNav";
import MainLayout from "@/components/main-layout";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const helveticaNow = localFont({
  src: "../fonts/HelveticaNowVar.woff2",
  variable: "--font-helvetica-now",
});

export const metadata: Metadata = {
  title: "Spotlight",
  description:
    "Spotlight Awards is a platform for celebrating the best in design, web and motion.",
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${helveticaNow.variable} font-helvetica antialiased relative max-w-[100vw]`}
        >
          <NuqsAdapter>
            <HeroUIProvider>
              <MainLayout>
                <Header />
                {auth}
                {children}
                <BottomNav />
              </MainLayout>
            </HeroUIProvider>
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  );
}
