import { Tables } from "@/database.types";
import Image from "next/image";
import Link from "next/link";

export default function HomeHero({
  project,
}: {
  project: (Tables<"project"> & { user: Tables<"profile"> }) | null;
}) {
  const isStaffProject = project?.is_staff_project;

  return (
    <div className="w-full p-4 relative flex items-center justify-center">
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
              By <span className="underline">{project?.user.display_name}</span>
            </p>
          </Link>
        )}
        <Link
          href={`/projects/${project?.slug}`}
          className="w-[38%] show-preview-cursor overflow-hidden rounded-2xl group"
        >
          <Image
            src={project?.thumbnail_url || ""}
            alt="Project Thumbnail"
            width={1920}
            height={1080}
            className="rounded-2xl w-full h-auto object-cover aspect-video group-hover:scale-[1.02] transition-all duration-500 ease-out-expo will-change-transform"
          />
        </Link>
      </div>
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
