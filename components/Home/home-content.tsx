"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react"

import type {
  AwardType,
  CategoryType,
  ProjectCardView,
} from "@/lib/spotlight-types"
import HomeHero from "@/components/Home/home-hero"
import HomeNavigation from "@/components/Home/home-navigation"
import PreviewCursor from "@/components/Home/preview-cursor"
import ProjectsGrid from "@/components/Home/projects-grid"

export default function HomeContent({
  preloadedHome,
  filters,
}: {
  preloadedHome: Preloaded<typeof api.projects.getHomePage>
  filters: {
    category?: CategoryType
    tags?: string[]
    award?: AwardType
  }
}) {
  const { featuredProject, projects, hasMore, nextCursor } =
    usePreloadedQuery(preloadedHome)
  const [visibleProjects, setVisibleProjects] =
    useState<ProjectCardView[]>(projects)
  const [currentCursor, setCurrentCursor] = useState<string | null>(nextCursor)
  const [canLoadMore, setCanLoadMore] = useState(hasMore)
  const [requestedCursor, setRequestedCursor] = useState<string | null>(null)
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters])
  const nextPage = useQuery(
    api.projects.listCardPage,
    requestedCursor
      ? {
          ...filters,
          cursor: requestedCursor,
          limit: 24,
        }
      : "skip"
  )

  useEffect(() => {
    setVisibleProjects(projects)
    setCurrentCursor(nextCursor)
    setCanLoadMore(hasMore)
    setRequestedCursor(null)
  }, [filtersKey, projects, nextCursor, hasMore])

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
      <HomeHero project={featuredProject} />
      <HomeNavigation />
      <ProjectsGrid
        projects={visibleProjects}
        hasMore={canLoadMore}
        isLoadingMore={requestedCursor !== null}
        onLoadMore={() => {
          if (currentCursor) setRequestedCursor(currentCursor)
        }}
      />
      <PreviewCursor />
    </>
  )
}
