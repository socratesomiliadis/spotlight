"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import TextSplit from "@/components/TextSplit";
import { useRef, useState } from "react";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";

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

  // useIsomorphicLayoutEffect(() => {
  //   const target = ref.current as HTMLAnchorElement;
  //   const normalChars = target.querySelectorAll(
  //     ".normal-chars"
  //   ) as NodeListOf<HTMLElement>;
  //   const hoverChars = target.querySelectorAll(
  //     ".hover-chars"
  //   ) as NodeListOf<HTMLElement>;

  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({
  //       defaults: {
  //         duration: 1,
  //         ease: "elastic.out(1.2, 1)",
  //         stagger: {
  //           amount: 0.1,
  //           from: "start",
  //         },
  //       },
  //     });
  //     if (isHovered) {
  //       tl.to(normalChars, {
  //         y: "-120%",
  //       });
  //       tl.to(
  //         hoverChars,
  //         {
  //           y: "0%",
  //         },
  //         0
  //       );
  //     } else {
  //       tl.to(normalChars, {
  //         y: "0%",
  //       });
  //       tl.to(
  //         hoverChars,
  //         {
  //           y: "120%",
  //         },
  //         0
  //       );
  //     }
  //   });

  //   return () => {
  //     ctx.kill();
  //   };
  // }, [isHovered]);

  return (
    <Link
      href={href}
      ref={ref}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "bg-[#1E1E1E] px-5 py-4 rounded-xl text-white tracking-tight text-base font-medium relative overflow-hidden flex items-center justify-center",
        inverted && "bg-white text-black py-2.5 rounded-lg"
      )}
    >
      <span className="-mb-1">{text}</span>
    </Link>
  );
}
