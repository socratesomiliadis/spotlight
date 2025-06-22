"use client";

import { Tables } from "@/database.types";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  project,
  className,
}: {
  project: Tables<"project">;
  className?: string;
}) {
  const [isPreviewing, setIsPreviewing] = useState(false);

  const hasPreview = !!project?.preview_gif_url;

  return (
    <Link
      onMouseEnter={() => setIsPreviewing(true)}
      onMouseLeave={() => setIsPreviewing(false)}
      href={`/projects/${project.slug}`}
      key={project.id}
      className={cn(
        "w-full overflow-hidden rounded-2xl group show-preview-cursor relative",
        className
      )}
    >
      {hasPreview && isPreviewing && (
        <video
          src={project.preview_gif_url || ""}
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full aspect-video object-cover z-10"
        />
      )}
      <Image
        src={project.thumbnail_url}
        alt={project.title}
        width={1920}
        height={1080}
        className={cn(
          "w-full aspect-video object-cover rounded-2xl group-hover:scale-[1.02] transition-all duration-500 ease-out-expo will-change-transform",
          hasPreview && "group-hover:scale-100"
        )}
      />
    </Link>
  );
}
