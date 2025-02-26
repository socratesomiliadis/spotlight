"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import TextSplit from "@/components/TextSplit";
import { useRef, useState } from "react";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";

export default function HeaderLink({
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

  useIsomorphicLayoutEffect(() => {
    const target = ref.current as HTMLAnchorElement;
    const normalChars = target.querySelectorAll(
      ".normal-chars"
    ) as NodeListOf<HTMLElement>;
    const hoverChars = target.querySelectorAll(
      ".hover-chars"
    ) as NodeListOf<HTMLElement>;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 1,
          ease: "elastic.out(1.2, 1)",
          stagger: {
            amount: 0.1,
            from: "center",
          },
        },
      });
      if (isHovered) {
        tl.to(normalChars, {
          y: "-115%",
        });
        tl.to(
          hoverChars,
          {
            y: "0%",
          },
          0
        );
      } else {
        tl.to(normalChars, {
          y: "0%",
        });
        tl.to(
          hoverChars,
          {
            y: "115%",
          },
          0
        );
      }
    });

    return () => {
      ctx.kill();
    };
  }, [isHovered]);

  return (
    <Link
      href={href}
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "bg-darkGreen text-lightGreen px-10 py-2.5 rounded-full tracking-tight text-lg font-medium relative overflow-hidden flex items-center justify-center",
        inverted && "bg-lightGreen text-darkGreen"
      )}
    >
      <TextSplit types={"chars"} charsClassName="normal-chars">
        {text}
      </TextSplit>
      <TextSplit
        types={"chars"}
        charsClassName="hover-chars translate-y-[120%]"
        className="absolute"
      >
        {text}
      </TextSplit>
    </Link>
  );
}
