"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tables } from "@/database.types"
import { useMediaQuery } from "usehooks-ts"

import { cn } from "@/lib/utils"

export default function ProjectCard({
  project,
  className,
}: {
  project: Tables<"project">
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const hasPreview = project.preview_url !== null
  const [isPreviewing, setIsPreviewing] = useState(false)

  useEffect(() => {
    if (isMobile || !hasPreview) return

    if (videoRef.current && isPreviewing) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    } else {
      videoRef.current?.pause()
      videoRef.current?.load()
    }
  }, [isPreviewing, isMobile, hasPreview])

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
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={project.main_img_url}
        className="w-full w-max-none aspect-video object-cover rounded-xl"
      >
        {/* @ts-expect-error */}
        <source src={project.preview_url || null} type="video/mp4" />
      </video>

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
