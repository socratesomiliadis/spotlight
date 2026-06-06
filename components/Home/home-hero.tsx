import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"

import type { ProjectCardView } from "@/lib/spotlight-types"

import ProjectCard from "./project-card"

export default function HomeHero({
  project,
}: {
  project: ProjectCardView | null
}) {
  return (
    <div className="w-full p-3 lg:p-4 relative flex items-center justify-center">
      <Suspense>
        {project && (
          <div className="absolute flex flex-col items-center gap-3 lg:gap-5 -mt-16 lg:-mt-20">
            <Link
              href={`/${project.user?.username || ""}`}
              className="flex flex-col items-center gap-1 mt-6"
            >
              <Image
                src={project.user?.avatar_url || ""}
                alt={project.user?.display_name || project.user?.username || ""}
                width={40}
                height={40}
                sizes="(min-width: 1024px) 40px, 32px"
                className="rounded-full size-8 lg:size-10"
              />
              <p className="text-sm text-white">
                By{" "}
                <span className="underline">
                  {project.user?.display_name || project.user?.username}
                </span>
              </p>
            </Link>

            <ProjectCard
              project={project}
              className="w-[70%] lg:w-[20vw]"
              priority
              sizes="(min-width: 1024px) 20vw, 70vw"
            />
          </div>
        )}
      </Suspense>
      <Image
        src="/static/images/hero.png"
        width={1800}
        height={1100}
        quality={80}
        priority
        sizes="(min-width: 1024px) 56vw, calc(100vw - 1.5rem)"
        alt=""
        className="w-full aspect-[2.5/3] lg:aspect-auto h-auto object-cover rounded-2xl"
      />
    </div>
  )
}
