import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"
import type { ProjectView } from "@/lib/spotlight-types"
import ProjectCard from "@/components/Home/project-card"

export default async function ProjectsGrid({
  projects,
}: {
  projects: ProjectView[] | null
}) {
  let reccomendedProjects: ProjectView[] | null = null

  if (!projects || projects.length <= 0) {
    reccomendedProjects = await fetchAuthQuery(api.projects.list, { limit: 4 })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-x-6 gap-y-6 pl-4 lg:pl-11 pr-3 lg:pr-9">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      {!projects ||
        (projects.length <= 0 && (
          <div className="flex flex-col gap-1 col-span-2 w-full lg:w-[40%]">
            <span className="text-lg lg:text-xl tracking-tight">
              Nothing here yet...
            </span>
            <p className="text-base lg:text-lg text-[#acacac] tracking-tight leading-none text-balance">
              This user hasn&apos;t uploaded any projects yet. In the meantime,
              feel free to explore some of our recommended projects below.
            </p>
          </div>
        ))}
      {reccomendedProjects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
