"use client"

import { useEffect, useState } from "react"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

import type { ProjectCardView } from "@/lib/spotlight-types"
import ProjectPreviewController from "@/components/Home/project-preview-controller"
import ProjectCard from "@/components/Home/project-card"

export default function ProjectsGrid({
  projects,
  recommendedProjects,
  username,
  projectsPage,
}: {
  projects?: ProjectCardView[] | null
  recommendedProjects?: ProjectCardView[] | null
  username: string
  projectsPage?: {
    hasMore: boolean
    nextCursor: string | null
  }
}) {
  const [visibleProjects, setVisibleProjects] = useState<ProjectCardView[]>(
    projects || []
  )
  const [currentCursor, setCurrentCursor] = useState<string | null>(
    projectsPage?.nextCursor || null
  )
  const [canLoadMore, setCanLoadMore] = useState(!!projectsPage?.hasMore)
  const [requestedCursor, setRequestedCursor] = useState<string | null>(null)
  const nextPage = useQuery(
    api.profiles.listProjectCardsPage,
    requestedCursor
      ? {
          username,
          cursor: requestedCursor,
          limit: 24,
        }
      : "skip"
  )
  const hasProjects = visibleProjects.length > 0

  useEffect(() => {
    setVisibleProjects(projects || [])
    setCurrentCursor(projectsPage?.nextCursor || null)
    setCanLoadMore(!!projectsPage?.hasMore)
    setRequestedCursor(null)
  }, [projects, projectsPage?.nextCursor, projectsPage?.hasMore])

  useEffect(() => {
    if (!nextPage || !requestedCursor) return

    setVisibleProjects((currentProjects) => [
      ...currentProjects,
      ...nextPage.projects,
    ])
    setCurrentCursor(nextPage.nextCursor)
    setCanLoadMore(nextPage.hasMore)
    setRequestedCursor(null)
  }, [nextPage, requestedCursor])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-x-6 gap-y-6 pl-4 lg:pl-11 pr-3 lg:pr-9">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {!hasProjects && (
          <div className="flex flex-col gap-1 col-span-2 w-full lg:w-[40%]">
            <span className="text-lg lg:text-xl tracking-tight">
              Nothing here yet...
            </span>
            <p className="text-base lg:text-lg text-[#acacac] tracking-tight leading-none text-balance">
              This user hasn&apos;t uploaded any projects yet. In the meantime,
              feel free to explore some of our recommended projects below.
            </p>
          </div>
        )}
        {recommendedProjects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {hasProjects && canLoadMore && (
        <div className="flex justify-center px-4 lg:px-11 mt-8">
          <button
            type="button"
            onClick={() => {
              if (currentCursor) setRequestedCursor(currentCursor)
            }}
            disabled={requestedCursor !== null}
            className="bg-[#f6f6f6] text-[#989898] px-5 py-2 rounded-lg text-sm lg:text-base font-medium disabled:opacity-60"
          >
            {requestedCursor ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
      <ProjectPreviewController />
    </>
  )
}
