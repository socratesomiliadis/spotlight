import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function BottomNavItem({
  imageSRC,
  text,
  href,
  className,
}: {
  imageSRC: string;
  text: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "w-full flex flex-row items-center p-3 gap-3 border-[#282828] border-b-[1px] hover:bg-[#242424] group",
        className
      )}
    >
      <Image
        src={imageSRC}
        alt={text}
        width={256}
        height={130}
        className="rounded-lg saturate-0 brightness-50 group-hover:brightness-100 group-hover:saturate-100 w-24 group-hover:w-28 will-change-transform transition-all duration-300 ease-out-expo"
      />
      <span className="text-xl text-white tracking-tight">{text}</span>
    </Link>
  );
}
