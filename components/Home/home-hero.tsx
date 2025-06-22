import { Tables } from "@/database.types";
import Image from "next/image";
import Link from "next/link";
import ProjectCard from "./project-card";

export default function HomeHero({
  project,
}: {
  project: (Tables<"project"> & { user: Tables<"profile"> }) | null;
}) {
  const isStaffProject = project?.is_staff_project;

  return (
    <div className="w-full p-4 relative flex items-center justify-center">
      {project && (
        <div className="absolute flex flex-col items-center gap-5 -mt-20">
          {isStaffProject ? (
            <div className="flex flex-col items-center gap-2 mt-6">
              <Image
                src={(project.user_fake as { image_url: string }).image_url}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full size-10"
              />
              <p className="text-sm text-[#fff]">
                By {(project.user_fake as { name: string }).name}
              </p>
            </div>
          ) : (
            <Link
              href={`/${project?.user.username}`}
              className="flex flex-col items-center gap-1 mt-6"
            >
              <Image
                src={project?.user.avatar_url || ""}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full size-10"
              />
              <p className="text-sm text-[#fff]">
                By{" "}
                <span className="underline">{project?.user.display_name}</span>
              </p>
            </Link>
          )}

          <ProjectCard
            project={project as Tables<"project">}
            className="w-[38%]"
          />
        </div>
      )}
      <Image
        src="/static/images/hero.png"
        width={1800}
        height={1100}
        quality={100}
        alt=""
        className="w-full h-auto object-cover rounded-2xl"
      />
    </div>
  );
}
