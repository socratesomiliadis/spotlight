"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"

import ProjectAwards from "./ProjectAwards"
import ProjectDetails from "./ProjectDetails"
import ProjectElements from "./ProjectElements"
import ProjectHeader from "./ProjectHeader"
import ProjectVisitManager from "./ProjectVisitManager"

export default function ProjectPageContent({
  preloadedProject,
}: {
  preloadedProject: Preloaded<typeof api.projects.getPageBySlug>
}) {
  const projectPage = usePreloadedQuery(preloadedProject)

  if (!projectPage) {
    notFound()
  }

  const { project, canEdit } = projectPage

  return (
    <>
      <ProjectVisitManager liveUrl={project.live_url} />
      <ProjectHeader
        bannerUrl={project.banner_url || ""}
        title={project.title}
        createdAt={project.created_at}
        userAvatarUrl={project.profile?.avatar_url || ""}
        userDisplayName={
          project.profile?.display_name || project.profile?.username || ""
        }
        userUsername={project.profile?.username || ""}
        slug={project.slug}
        canEdit={canEdit}
      />
      {project.award && project.award.length > 0 && (
        <ProjectAwards awards={project.award} category={project.category} />
      )}
      <div className="px-4 lg:px-8">
        <Image
          src={project.main_img_url}
          alt="Project Image"
          width={2560}
          height={1440}
          className="w-full aspect-video object-cover rounded-2xl"
        />
      </div>
      {project.elements_url && project.elements_url.length > 0 && (
        <ProjectElements elementURLs={project.elements_url} />
      )}
      <ProjectDetails tags={project.tags} />
    </>
  )
}
