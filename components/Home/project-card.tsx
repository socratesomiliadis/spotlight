import Image from "next/image"
import Link from "next/link"

import type { ProjectCardView } from "@/lib/spotlight-types"
import { cn } from "@/lib/utils"

export default function ProjectCard({
  project,
  className,
  priority = false,
  sizes = "(min-width: 1024px) calc((56vw - 2rem) / 2), (min-width: 768px) calc((100vw - 2.5rem) / 2), calc(100vw - 1.5rem)",
}: {
  project: ProjectCardView
  className?: string
  priority?: boolean
  sizes?: string
}) {
  const hasPreview = !!project.preview_url

  return (
    <Link
      href={`/projects/${project.slug}`}
      key={project.id}
      className={cn(
        "w-full aspect-video overflow-hidden rounded-xl group show-preview-cursor project-card-link relative",
        className
      )}
    >
      {hasPreview && (
        <video
          data-project-preview
          data-preview-src={project.preview_url || undefined}
          muted
          loop
          playsInline
          preload="none"
          poster={project.main_img_url}
          className="absolute inset-0 z-10 hidden w-full aspect-video object-cover rounded-xl opacity-0 transition-opacity duration-200 lg:block lg:rounded-2xl"
        />
      )}

      <Image
        src={project.main_img_url}
        alt={project.title}
        width={1920}
        height={1080}
        sizes={sizes}
        priority={priority}
        className={cn(
          "w-full aspect-video object-cover rounded-xl lg:rounded-2xl group-hover:scale-[1.02] transition-all duration-500 ease-out-expo will-change-transform",
          hasPreview && "group-hover:scale-100"
        )}
      />
    </Link>
  )
}
