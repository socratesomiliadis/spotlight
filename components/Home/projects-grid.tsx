"use client"

import type { ProjectView } from "@/lib/spotlight-types"

import ProjectCard from "./project-card"

export default function ProjectsGrid({
  projects,
}: {
  projects: ProjectView[] | null
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 lg:px-8">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
