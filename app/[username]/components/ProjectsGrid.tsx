import { Tables } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

function ProjectCard({ project }: { project: Tables<"project"> }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="w-full overflow-hidden rounded-2xl group show-preview-cursor"
    >
      <Image
        src={project.thumbnail_url}
        alt={project.title}
        width={1920}
        height={1080}
        className="w-full aspect-[16/9] object-cover rounded-2xl group-hover:scale-[1.02] transition-all duration-500 ease-out-expo will-change-transform"
      />
    </Link>
  );
}

export default async function ProjectsGrid({
  projects,
}: {
  projects: Tables<"project">[] | null;
}) {
  const supabase = await createClient();

  let reccomendedProjects: Tables<"project">[] | null = null;

  if (!projects || projects.length <= 0) {
    const { data, error } = await supabase.from("project").select("*").limit(4);

    if (error) {
      console.error(error);
    }

    reccomendedProjects = data;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11 pr-9">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      {!projects ||
        (projects.length <= 0 && (
          <div className="flex flex-col gap-2 col-span-2 w-1/2">
            <span className="text-2xl font-medium tracking-tight">
              Nothing Here Yet
            </span>
            <p className="text-lg text-[#acacac] tracking-tight leading-none">
              This user hasn&apos;t uploaded any projects yet. In the meantime,
              feel free to explore some of our recommended projects below.
            </p>
          </div>
        ))}
      {reccomendedProjects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
