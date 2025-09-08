import Image from "next/image"
import Link from "next/link"
import { Tables } from "@/database.types"

import ProjectCard from "./project-card"

export default function HomeHero({
  project,
}: {
  project: (Tables<"project"> & { user: Tables<"profile"> }) | null
}) {
  return (
    <div className="w-full p-3 lg:p-4 relative flex items-center justify-center">
      {project && (
        <div className="absolute flex flex-col items-center gap-3 lg:gap-5 -mt-16 lg:-mt-20">
          <Link
            href={`/${project?.user.username}`}
            className="flex flex-col items-center gap-1 mt-6"
          >
            <Image
              src={project?.user.avatar_url || ""}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full size-8 lg:size-10"
            />
            <p className="text-sm text-white">
              By <span className="underline">{project?.user.display_name}</span>
            </p>
          </Link>

          <ProjectCard
            project={project as Tables<"project">}
            className="w-[70%] lg:w-[38%]"
          />
        </div>
      )}
      <Image
        src="/static/images/hero.png"
        width={1800}
        height={1100}
        quality={100}
        alt=""
        className="w-full aspect-[2.5/3] lg:aspect-auto h-auto object-cover rounded-2xl"
      />
    </div>
  )
}
