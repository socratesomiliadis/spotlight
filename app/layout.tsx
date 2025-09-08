import type { Metadata } from "next"

import "./globals.css"

import localFont from "next/font/local"
import { ClerkProvider } from "@clerk/nextjs"
import { HeroUIProvider } from "@heroui/react"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "sonner"

import BottomNav from "@/components/BottomNav"
import Header from "@/components/Header"
import CloseCursor from "@/components/Home/close-cursor"
import MainLayout from "@/components/main-layout"

const helveticaNow = localFont({
  src: "../fonts/HelveticaNowVar.woff2",
  variable: "--font-helvetica-now",
})

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Spotlight",
    template: `Spotlight — %s`,
  },
  description:
    "A platform that awards creativity and innovation across industries worldwide.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Spotlight",
    description:
      "A platform that awards creativity and innovation across industries worldwide.",
    images: [
      {
        url: "https://spotlight.day/og-image.png",
        width: 1600,
        height: 900,
        alt: "Preview image for Spotlight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotlight",
    description:
      "A platform that awards creativity and innovation across industries worldwide.",
    images: [
      {
        url: "https://spotlight.day/og-image.png",
        width: 1600,
        height: 900,
        alt: "Preview image for Spotlight",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          fontFamily: "var(--font-helvetica-now)",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${helveticaNow.variable} font-helvetica antialiased relative w-screen max-w-screen`}
        >
          <NuqsAdapter>
            <HeroUIProvider>
              <Header />
              <MainLayout>
                <Toaster richColors />
                {children}
                <CloseCursor />
              </MainLayout>
              <BottomNav />
            </HeroUIProvider>
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  )
}
