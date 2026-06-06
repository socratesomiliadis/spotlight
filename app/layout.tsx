import type { Metadata, Viewport } from "next"

import "./globals.css"

import localFont from "next/font/local"
import { Toaster } from "sonner"

import { getToken } from "@/lib/auth-server"
import {
  defaultDescription,
  defaultOgImage,
  publicRobots,
  siteName,
  siteUrl,
} from "@/lib/seo"
import BottomNav from "@/components/BottomNav"
import Header from "@/components/Header"
import CloseCursor from "@/components/Home/close-cursor"
import MainLayout from "@/components/main-layout"

import Providers from "./providers"

const helveticaNow = localFont({
  src: "../fonts/HelveticaNowVar.woff2",
  variable: "--font-helvetica-now",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteName,
    type: "website",
    url: "/",
    siteName,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImage,
        width: 1600,
        height: 900,
        alt: "Preview image for Spotlight",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SpotlightDay",
    title: siteName,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  robots: publicRobots,
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = await getToken()

  return (
    <html lang="en">
      <body
        className={`${helveticaNow.variable} font-helvetica antialiased relative w-screen max-w-screen`}
      >
        <Providers initialToken={token}>
          <Header />
          <MainLayout>
            <Toaster richColors />
            {children}
            <CloseCursor />
          </MainLayout>
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
