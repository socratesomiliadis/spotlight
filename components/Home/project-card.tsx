"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tables } from "@/database.types"

import { cn } from "@/lib/utils"

export default function ProjectCard({
  project,
  className,
}: {
  project: Tables<"project">
  className?: string
}) {
  const [isPreviewing, setIsPreviewing] = useState(false)

  const hasPreview = !!project?.preview_url

  return (
    <Link
      onMouseEnter={() => setIsPreviewing(true)}
      onMouseLeave={() => setIsPreviewing(false)}
      href={`/projects/${project.slug}`}
      key={project.id}
      className={cn(
        "w-full overflow-hidden rounded-xl lg:rounded-2xl group show-preview-cursor relative",
        className
      )}
    >
      {hasPreview && isPreviewing && (
        <video
          src={project.preview_url || ""}
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full aspect-video object-cover z-10"
        />
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
