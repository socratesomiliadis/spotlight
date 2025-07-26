"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"
import { Lenis, useLenis } from "lenis/react"

import { ScrollTrigger } from "@/lib/gsap"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lenis = useLenis()
  const pathname = usePathname()
  useLayoutEffect(() => {
    ScrollTrigger.clearScrollMemory("manual")
  }, [])
  useLayoutEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [lenis, pathname])

  return (
    <div className="relative max-w-[100vw] layout-wrapper px-3 lg:px-[22vw]">
      <Lenis root />

      {children}
    </div>
  )
}
