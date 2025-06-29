import type { Metadata } from "next"

import "./globals.css"

import localFont from "next/font/local"
import { ClerkProvider } from "@clerk/nextjs"
import { HeroUIProvider } from "@heroui/react"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "sonner"

import BottomNav from "@/components/BottomNav"
import Header from "@/components/Header"
import MainLayout from "@/components/main-layout"

const helveticaNow = localFont({
  src: "../fonts/HelveticaNowVar.woff2",
  variable: "--font-helvetica-now",
})

export const metadata: Metadata = {
  title: "Spotlight",
  description:
    "Spotlight Awards is a platform for celebrating the best in design, web and motion.",
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
          className={`${helveticaNow.variable} font-helvetica antialiased relative max-w-[100vw]`}
        >
          <NuqsAdapter>
            <HeroUIProvider>
              <Header />
              <MainLayout>
                <Toaster richColors />
                {children}
              </MainLayout>
              <BottomNav />
            </HeroUIProvider>
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  )
}
