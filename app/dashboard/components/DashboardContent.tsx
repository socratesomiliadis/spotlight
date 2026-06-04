"use client"

import Image from "next/image"
import Link from "next/link"
import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"

import AwardButtons from "./AwardButtons"
import DashboardFilters from "./DashboardFilters"

export default function DashboardContent({
  preloadedProjects,
}: {
  preloadedProjects: Preloaded<typeof api.projects.listWithAwardsForStaff>
}) {
  const projects = usePreloadedQuery(preloadedProjects) || []

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <div className="text-sm text-gray-600">{projects.length} projects</div>
      </div>
      <p className="text-gray-600 mt-2">
        Manage project awards by clicking the award buttons. Active awards are
        highlighted.
      </p>

      <div className="mt-8">
        <DashboardFilters />
      </div>

      <div className="flex flex-col divide-y divide-[#EAEAEA] w-full mt-8">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No projects found matching your filters
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-row items-start gap-6 py-6 w-full"
            >
              <div className="flex flex-row items-center gap-4 w-[50%]">
                <Link target="_blank" href={`/projects/${project.slug}`}>
                  <Image
                    src={project.main_img_url}
                    alt={project.title}
                    width={720}
                    height={405}
                    className="rounded-xl w-44 aspect-video shrink-0"
                  />
                </Link>
                <div className="whitespace-nowrap">
                  <h2 className="text-2xl font-medium tracking-tight">
                    {project.title}
                  </h2>
                  <div className="text-sm text-gray-600 mt-1">
                    by{" "}
                    <Link
                      href={`/${project.user?.username}`}
                      className="underline"
                    >
                      {project.user?.display_name || project.user?.username}
                    </Link>{" "}
                    • {project.category}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="w-[50%] flex flex-row items-center gap-20">
                <AwardButtons
                  projectId={project.id}
                  currentAwards={project.award || []}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
