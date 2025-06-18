import Image from "next/image";
import Link from "next/link";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectHeader({
  bannerUrl,
  title,
  createdAt,
  userAvatarUrl,
  userDisplayName,
  userUsername,
}: {
  bannerUrl: string;
  title: string;
  createdAt: string;
  userAvatarUrl: string;
  userDisplayName: string;
  userUsername: string;
}) {
  return (
    <div className="flex flex-col p-3">
      <div className="w-full aspect-[3/1] bg-[#f6f6f6] rounded-2xl overflow-hidden banner-image flex items-center justify-center">
        <Image
          src={bannerUrl}
          alt="Project Banner"
          width={3000}
          height={1000}
          priority
          className="w-full aspect-[3/1] object-cover object-center"
        />
      </div>
      <div className="flex flex-col items-center gap-2 py-10">
        <p className="text-sm text-[#ACACAC] -mb-2">{formatDate(createdAt)}</p>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <Link
          href={`/${userUsername}`}
          className="flex flex-col items-center gap-2 mt-6"
        >
          <Image
            src={userAvatarUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full size-10"
          />
          <p className="text-sm text-[#ACACAC]">
            By <span className="underline">{userDisplayName}</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
