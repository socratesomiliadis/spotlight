import Image from "next/image";
import Link from "next/link";

export default function AwardThumnail({
  image,
  awardTitle,
  projectTitle,
  projectLink,
}: {
  image: string;
  awardTitle: string;
  projectTitle: string;
  projectLink: string;
}) {
  return (
    <article className="flex flex-col w-full gap-3">
      <Link href={projectLink}>
        <Image
          src={image}
          width={450}
          height={260}
          className="aspect-video w-full h-auto object-cover"
          alt={`${awardTitle} - ${projectTitle}`}
        />
      </Link>
      <div className="flex flex-row w-full justify-between">
        <span className="basis-1/2 flex flex-col">
          <span className="text-[#8F8F8F] uppercase">{awardTitle}</span>
          <span className="text-black">{projectTitle}</span>
        </span>
        <button className="rounded-full py-2 px-12 bg-black flex items-center">
          <span className="text-white ">VISIT</span>
        </button>
      </div>
    </article>
  );
}
