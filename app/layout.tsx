import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { Lenis } from "lenis/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotlight",
  description:
    "Spotlight Awards is a platform for celebrating the best in design, web and motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} font-geist antialiased relative max-w-[100vw]`}
        >
          <Lenis root />
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
