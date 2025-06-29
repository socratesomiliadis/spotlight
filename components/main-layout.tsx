"use client"

import { useLayoutEffect } from "react"
import { Lenis } from "lenis/react"

import { ScrollTrigger } from "@/lib/gsap"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useLayoutEffect(() => {
    ScrollTrigger.clearScrollMemory("manual")
  }, [])
  return (
    <div className="relative max-w-[100vw] layout-wrapper px-3 lg:px-[22vw]">
      <Lenis root />

      {children}
    </div>
  )
}
