import { Tables } from "@/database.types";
import Image from "next/image";
import Link from "next/link";

export default function ProjectsGrid({
  projects,
}: {
  projects: Tables<"project">[] | null;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8">
      {projects?.map((project) => (
        <Link
          href={`/projects/${project.slug}`}
          key={project.id}
          className="w-full show-preview-cursor"
        >
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            width={1920}
            height={1080}
            className="w-full aspect-video object-cover rounded-2xl"
          />
        </Link>
      ))}
    </div>
  );
}
