import type { Metadata, Viewport } from "next"

import "./globals.css"

import localFont from "next/font/local"
import { ProjectVisitProvider } from "@/contexts/project-visit-context"
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

export const metadata: Metadata = {
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
        url: "https://spotlight.day/ogImage.png",
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
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
              <ProjectVisitProvider>
                <Header />
                <MainLayout>
                  <Toaster richColors />
                  {children}
                  <CloseCursor />
                </MainLayout>
                <BottomNav />
              </ProjectVisitProvider>
            </HeroUIProvider>
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  )
}
