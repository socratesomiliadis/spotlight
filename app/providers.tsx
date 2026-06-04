"use client"

import type { ReactNode } from "react"
import { ProjectVisitProvider } from "@/contexts/project-visit-context"
import { HeroUIProvider } from "@heroui/react"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import ConvexClientProvider from "@/components/ConvexClientProvider"

export default function Providers({
  children,
  initialToken,
}: {
  children: ReactNode
  initialToken?: string | null
}) {
  return (
    <ConvexClientProvider initialToken={initialToken}>
      <NuqsAdapter>
        <HeroUIProvider>
          <ProjectVisitProvider>{children}</ProjectVisitProvider>
        </HeroUIProvider>
      </NuqsAdapter>
    </ConvexClientProvider>
  )
}
