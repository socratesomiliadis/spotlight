import Image from "next/image";
import ProjectHeader from "./components/ProjectHeader";
import ProjectNavigation from "./components/ProjectNavigation";
import ProjectElements from "./components/ProjectElements";
import ProjectDetails from "./components/ProjectDetails";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  let project;
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("project")
      .select("*, profile(avatar_url, display_name, username)")
      .eq("slug", slug)
      .single();

    if (error) {
      console.log(error);
      notFound();
    }

    project = data;
  } catch (error) {
    notFound();
  }

  if (!project) {
    notFound();
  }

  const isStaffProject = project.is_staff_project;

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full pb-8 rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <ProjectHeader
          bannerUrl={project.banner_url || ""}
          title={project.title}
          createdAt={project.created_at}
          userAvatarUrl={
            isStaffProject
              ? (project.user_fake as { image_url: string }).image_url
              : project.profile.avatar_url
          }
          userDisplayName={
            isStaffProject
              ? (project.user_fake as { name: string }).name
              : project.profile.display_name
          }
          userUsername={isStaffProject ? "staff" : project.profile.username}
          isStaffProject={isStaffProject}
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
        <ProjectDetails tools={project.tools_used} />
      </div>
    </main>
  );
}
