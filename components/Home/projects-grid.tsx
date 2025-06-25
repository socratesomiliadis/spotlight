"use client"

import { Tables } from "@/database.types"

import ProjectCard from "./project-card"

export default function ProjectsGrid({
  projects,
}: {
  projects: Tables<"project">[] | null
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
