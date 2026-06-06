"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

function stopPreview(video: HTMLVideoElement) {
  video.pause()
  video.removeAttribute("src")
  video.load()
  video.classList.remove("opacity-100")
}

export default function ProjectPreviewController() {
  const [isVisible, setIsVisible] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const activeVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const canPreview = window.matchMedia("(min-width: 1024px)")

    const handlePointerMove = (event: PointerEvent) => {
      if (!cursorRef.current) return
      cursorRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-80%, -80%)`
    }

    const handlePointerOver = (event: PointerEvent) => {
      if (!canPreview.matches) return

      const card = (event.target as Element | null)?.closest(
        ".project-card-link"
      )
      if (!card) return

      const video = card.querySelector<HTMLVideoElement>(
        "video[data-project-preview]"
      )
      const previewSrc = video?.dataset.previewSrc

      setIsVisible(true)
      if (!video || !previewSrc || activeVideoRef.current === video) return

      if (activeVideoRef.current) stopPreview(activeVideoRef.current)

      activeVideoRef.current = video
      video.src = previewSrc
      video.currentTime = 0
      video.classList.add("opacity-100")
      void video.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        console.error("Project preview playback failed:", error)
      })
    }

    const handlePointerOut = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest(
        ".project-card-link"
      )
      if (!card || card.contains(event.relatedTarget as Node | null)) return

      setIsVisible(false)
      if (activeVideoRef.current) {
        stopPreview(activeVideoRef.current)
        activeVideoRef.current = null
      }
    }

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    })
    document.addEventListener("pointerover", handlePointerOver)
    document.addEventListener("pointerout", handlePointerOut)

    return () => {
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerover", handlePointerOver)
      document.removeEventListener("pointerout", handlePointerOut)
      if (activeVideoRef.current) stopPreview(activeVideoRef.current)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed hidden left-0 top-0 z-100 px-6 py-2 bg-black/10 text-white backdrop-blur-md rounded-md pointer-events-none transition-opacity duration-300 lg:block",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      ref={cursorRef}
    >
      Preview
    </div>
  )
}
