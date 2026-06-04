"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useMediaQuery } from "usehooks-ts"

import type { ProjectCardView } from "@/lib/spotlight-types"
import { cn } from "@/lib/utils"

export default function ProjectCard({
  project,
  className,
}: {
  project: ProjectCardView
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const hasPreview = !!project.preview_url
  const [isPreviewing, setIsPreviewing] = useState(false)
  const shouldUseVideo = !isMobile && hasPreview
  const shouldLoadVideo = shouldUseVideo && isPreviewing

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!shouldLoadVideo) {
      video.pause()
      video.removeAttribute("src")
      video.load()
      return
    }

    video.currentTime = 0
    void video.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return
      }

      console.error("Project preview playback failed:", error)
    })
  }, [shouldLoadVideo])

  return (
    <Link
      onMouseEnter={() => setIsPreviewing(true)}
      onMouseLeave={() => setIsPreviewing(false)}
      href={`/projects/${project.slug}`}
      key={project.id}
      className={cn(
        "w-full aspect-video overflow-hidden rounded-xl group show-preview-cursor relative",
        className
      )}
    >
      {shouldUseVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={project.main_img_url}
          className="absolute inset-0 z-10 w-full w-max-none aspect-video object-cover rounded-xl lg:rounded-2xl"
        >
          {shouldLoadVideo && (
            <source src={project.preview_url!} type="video/mp4" />
          )}
        </video>
      )}

      <Image
        src={project.main_img_url}
        alt={project.title}
        width={1920}
        height={1080}
        className={cn(
          "w-full aspect-video object-cover rounded-xl lg:rounded-2xl group-hover:scale-[1.02] transition-all duration-500 ease-out-expo will-change-transform",
          hasPreview && "group-hover:scale-100"
        )}
      />
    </Link>
  )
}
