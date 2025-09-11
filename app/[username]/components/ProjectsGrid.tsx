import { Tables } from "@/database.types"

import { createClient } from "@/lib/supabase/server"
import ProjectCard from "@/components/Home/project-card"

export default async function ProjectsGrid({
  projects,
}: {
  projects: Tables<"project">[] | null
}) {
  const supabase = await createClient()

  let reccomendedProjects: Tables<"project">[] | null = null

  if (!projects || projects.length <= 0) {
    const { data, error } = await supabase.from("project").select("*").limit(4)

    if (error) {
      console.error(error)
    }

    reccomendedProjects = data
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
