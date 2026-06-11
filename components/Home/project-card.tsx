import Image from "next/image"
import Link from "next/link"

import type {
  AwardType,
  AwardView,
  ProjectCardView,
} from "@/lib/spotlight-types"
import { cn } from "@/lib/utils"

const AWARD_BADGE_STYLES: Record<AwardType, string> = {
  otd: "bg-black text-white",
  otm: "bg-[#A4810E] text-white",
  oty: "bg-[#FF98FB] text-black",
  honorable: "bg-[#f6f6f6] text-[#989898]",
}

const AWARD_RANK: Record<AwardType, number> = {
  oty: 4,
  otm: 3,
  otd: 2,
  honorable: 1,
}

function getHighestAward(awards?: AwardView[]) {
  if (!awards?.length) return null

  return awards.reduce<AwardView | null>((highestAward, award) => {
    if (!highestAward) return award

    return AWARD_RANK[award.award_type] > AWARD_RANK[highestAward.award_type]
      ? award
      : highestAward
  }, null)
}

function TrophyIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M750 50H600C600 22.3125 577.637 0 550 0H250C222.363 0 200 22.3125 200 50H50C22.3625 50 0 72.3125 0 100V200C0 310.45 89.55 400 200 400C202.35 400 204.538 399.362 206.838 399.262C224.8 469.625 279.738 524.663 350 542.875V700H250C222.363 700 200 722.313 200 750V800H600V750C600 722.313 577.637 700 550 700H450V542.875C520.262 524.663 575.2 469.637 593.162 399.275C595.462 399.362 597.65 400 600 400C710.45 400 800 310.45 800 200V100C800 72.3125 777.637 50 750 50ZM100 200V150H200V300C144.775 300 100 255.175 100 200ZM700 200C700 255.175 655.225 300 600 300V150H700V200Z"
        fill="currentColor"
      />
    </svg>
  )
}

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
  const creator = project.user?.display_name || project.user?.username
  const linkLabel = creator
    ? `View ${project.title} by ${creator}`
    : `View ${project.title}`
  const highestAward = getHighestAward(project.award)

  return (
    <Link
      href={`/projects/${project.slug}`}
      key={project.id}
      aria-label={linkLabel}
      className={cn(
        "w-full aspect-video overflow-hidden rounded-xl group show-preview-cursor project-card-link relative",
        className
      )}
    >
      <span className="sr-only">{linkLabel}</span>
      {highestAward && (
        <span
          aria-hidden
          className={cn(
            "absolute left-3 top-3 z-20 flex size-9 items-center justify-center rounded-lg shadow-sm lg:left-4 lg:top-4 lg:size-10",
            AWARD_BADGE_STYLES[highestAward.award_type]
          )}
        >
          <span className="flex size-4 lg:size-[1.1rem]">
            <TrophyIcon />
          </span>
        </span>
      )}
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
        alt={`${project.title} project preview`}
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
