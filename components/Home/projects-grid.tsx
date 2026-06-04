"use client"

import type { ProjectCardView } from "@/lib/spotlight-types"

import ProjectCard from "./project-card"

export default function ProjectsGrid({
  projects,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  projects: ProjectCardView[] | null
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 lg:px-8">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {hasMore && onLoadMore && (
        <div className="flex justify-center px-3 lg:px-8 mt-8">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="bg-[#f6f6f6] text-[#989898] px-5 py-2 rounded-lg text-sm lg:text-base font-medium disabled:opacity-60"
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  )
}
