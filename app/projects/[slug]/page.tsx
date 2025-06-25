import Image from "next/image"
import { notFound } from "next/navigation"

import { getProjectBySlug } from "@/lib/supabase/actions/projects"

import ProjectDetails from "./components/ProjectDetails"
import ProjectElements from "./components/ProjectElements"
import ProjectHeader from "./components/ProjectHeader"
import ProjectNavigation from "./components/ProjectNavigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  let project
  try {
    const data = await getProjectBySlug(slug)

    project = data
  } catch (error) {
    notFound()
  }

  if (!project) {
    notFound()
  }

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full pb-8 rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <ProjectHeader
          bannerUrl={project.banner_url || ""}
          title={project.title}
          createdAt={project.created_at}
          userAvatarUrl={project.profile.avatar_url}
          userDisplayName={project.profile.display_name}
          userUsername={project.profile.username}
        />
        <ProjectNavigation />
        <div className="px-8">
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
      </div>
    </main>
  )
}
