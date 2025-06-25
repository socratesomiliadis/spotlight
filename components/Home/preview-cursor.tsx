"use client"

import { useRef, useState } from "react"

import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect"

export default function PreviewCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!cursorRef.current) return
    const showPreviewCursorElements = document.querySelectorAll(
      ".show-preview-cursor"
    )

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        left: e.clientX,
        top: e.clientY,
      })
    }

    showPreviewCursorElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        setIsVisible(true)
      })
      element.addEventListener("mouseleave", () => {
        setIsVisible(false)
      })
    })

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      showPreviewCursorElements.forEach((element) => {
        element.removeEventListener("mouseenter", () => {
          setIsVisible(true)
        })
        element.removeEventListener("mouseleave", () => {
          setIsVisible(false)
        })
      })
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-[100] -translate-x-[80%] -translate-y-[80%] px-6 py-2 bg-black/10 text-white backdrop-blur-md rounded-md pointer-events-none transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      ref={cursorRef}
    >
      Preview
    </div>
  )
}
