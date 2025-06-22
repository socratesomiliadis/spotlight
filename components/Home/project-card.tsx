"use client";

import { Tables } from "@/database.types";
import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  project,
}: {
  project: Tables<"project">;
}) {
  const [isPreviewing, setIsPreviewing] = useState(false);

  const hasPreview = !!project.preview_gif_url;

  return (
    <Link
      onMouseEnter={() => setIsPreviewing(true)}
      onMouseLeave={() => setIsPreviewing(false)}
      href={`/projects/${project.slug}`}
      key={project.id}
      className="w-full overflow-hidden rounded-2xl group show-preview-cursor "
    >
      <ViewTransition name={`project-img-${project.id}`}>
        <Image
          src={
            isPreviewing
              ? project.preview_gif_url || project.thumbnail_url
              : project.thumbnail_url
          }
          alt={project.title}
          width={1920}
          height={1080}
          className={cn(
            "w-full aspect-video object-cover rounded-2xl group-hover:scale-[1.02] transition-all duration-500 ease-out-expo will-change-transform",
            hasPreview && "group-hover:scale-100"
          )}
        />
      </ViewTransition>
    </Link>
  );
}
