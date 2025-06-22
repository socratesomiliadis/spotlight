"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export default function BottomNavQuickLink({
  text,
  href,
  inverted,
}: {
  text: string;
  href: string;
  inverted?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      ref={ref}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "bg-[#1E1E1E]/90 backdrop-blur-xl px-5 py-3.5 rounded-xl text-white tracking-tight text-base font-medium relative overflow-hidden flex items-center justify-center",
        inverted && "bg-white text-black py-2 rounded-lg"
      )}
    >
      <span>{text}</span>
    </Link>
  );
}
