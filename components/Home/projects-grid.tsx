import type { ProjectCardView } from "@/lib/spotlight-types"

import ProjectCard from "./project-card"

export default function ProjectsGrid({
  projects,
}: {
  projects: ProjectCardView[] | null
}) {
  if (!projects?.length) {
    return <EmptyProjectsState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 lg:px-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

function EmptyProjectsState() {
  return (
    <section className="px-3 lg:px-8 pb-10">
      <div className="flex min-h-48 flex-col items-center justify-center text-center">
        <h2 className="text-xl font-medium tracking-tight text-black">
          No projects found
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#989898]">
          Try adjusting your filters or check back soon for new submissions.
        </p>
      </div>
    </section>
  )
}
