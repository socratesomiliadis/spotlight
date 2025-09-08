"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

export default function CloseCursor() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.querySelector(".close-cursor") as HTMLElement
      if (cursor) {
        cursor.style.left = `${e.clientX}px`
        cursor.style.top = `${e.clientY}px`
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="fixed flex flex-row items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 close-cursor z-1000 opacity-0 transition-opacity duration-200 ease-out-expo">
      <X size={16} color="white" />
      <span className="text-white text-sm">Close</span>
    </div>
  )
}
