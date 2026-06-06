"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

import type {
  AwardType,
  CategoryType,
  ProjectCardView,
} from "@/lib/spotlight-types"

import ProjectsGrid from "./projects-grid"

export default function LoadMoreProjects({
  filters,
  initialHasMore,
  initialCursor,
}: {
  filters: {
    category?: CategoryType
    tags?: string[]
    award?: AwardType
  }
  initialHasMore: boolean
  initialCursor: string | null
}) {
  const [projects, setProjects] = useState<ProjectCardView[]>([])
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
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
    setProjects([])
    setCursor(initialCursor)
    setHasMore(initialHasMore)
    setRequestedCursor(null)
  }, [filtersKey, initialCursor, initialHasMore])

  useEffect(() => {
    if (!nextPage || !requestedCursor) return

    setProjects((currentProjects) => [
      ...currentProjects,
      ...nextPage.projects,
    ])
    setCursor(nextPage.nextCursor)
    setHasMore(nextPage.hasMore)
    setRequestedCursor(null)
  }, [nextPage, requestedCursor])

  if (!hasMore && projects.length === 0) return null

  return (
    <>
      {projects.length > 0 && <ProjectsGrid projects={projects} />}
      {hasMore && (
        <div className="flex justify-center px-3 lg:px-8 mt-8">
          <button
            type="button"
            onClick={() => {
              if (cursor) setRequestedCursor(cursor)
            }}
            disabled={requestedCursor !== null}
            className="bg-[#f6f6f6] text-[#989898] px-5 py-2 rounded-lg text-sm lg:text-base font-medium disabled:opacity-60"
          >
            {requestedCursor ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  )
}
