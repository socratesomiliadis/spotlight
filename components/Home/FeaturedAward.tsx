import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedAward({
  profileImg,
  username,
  userlink,
  image,
  awardText,
  projectName,
  projectLink,
  date
}: {
  profileImg: string;
  username: string;
  userlink: string;
  image: string;
  awardText: string;
  projectName: string;
  projectLink: string;
  date: string;
}) {
  return (
    <article className="flex flex-col items-center absolute z-20 left-1/2 -translate-x-1/2 top-[31%] gap-6">
      <div className="profile-info-wrapper flex flex-col items-center gap-6">
        <Link href={userlink}>
          <Image
            src={profileImg}
            width={200}
            height={200}
            alt={`${username}'s Profile Picture`}
            className="rounded-full w-[60px] h-[60px]"
          />
        </Link>
        <Link
          href={userlink}
          className="text-white flex flex-row items-center gap-1 text-lg"
        >
          <span className="text-white text-lg">By</span>
          <span className="underline">{username}</span>
        </Link>
      </div>
      <Link
        href={projectLink}
        className="project-wrapper rounded-2xl overflow-hidden flex flex-col"
      >
        <Image
          src={image}
          width={1280}
          height={720}
          alt={`${projectName} Image`}
          className="w-[750px] h-auto aspect-[16/8] object-cover"
        />
        <div className="flex flex-row justify-between items-center px-6 bg-black py-3">
          <span className="flex flex-row items-center text-[#CACACA]">
            <span>{awardText}</span>
            <span>—</span>
            <span className="text-white">{projectName}</span>
          </span>
          <span className="text-white">{date}</span>
        </div>
      </Link>
    </article>
  );
}
