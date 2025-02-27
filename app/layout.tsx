import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { Lenis } from "lenis/react";
import { HeroUIProvider } from "@heroui/react";
import localFont from "next/font/local";
import BottomNav from "@/components/BottomNav";
const helveticaNeue = localFont({
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
          className={`${helveticaNeue.variable} font-helvetica antialiased relative max-w-[100vw]`}
        >
          <HeroUIProvider>
            <Lenis root />
            <Header />
            {auth}
            {children}
            <BottomNav />
          </HeroUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
