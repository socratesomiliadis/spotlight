"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import TextSplit from "@/components/text-split";
import { RefObject, useRef, useState } from "react";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";

export default function CustomButton({
  text,
  href,
  inverted,
  className,
  onClick,
  type,
}: {
  text: string;
  href?: string;
  inverted?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "button";
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const target = ref.current as HTMLElement;
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
            from: "start",
          },
        },
      });
      if (isHovered) {
        tl.to(normalChars, {
          y: "-120%",
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
            y: "120%",
          },
          0
        );
      }
    });

    return () => {
      ctx.kill();
    };
  }, [isHovered, text]);

  const classes = cn(
    "bg-black px-6 py-2 rounded-xl text-white tracking-tight text-lg relative overflow-hidden flex items-center justify-center font-[550]",
    inverted &&
      "bg-white py-[0.4rem] border-[2px] box-border border-black text-black",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as RefObject<HTMLAnchorElement>}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={classes}
      >
        <span className="normal-chars">{text}</span>
        <span className="absolute hover-chars">{text}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      ref={ref as RefObject<HTMLButtonElement>}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={classes}
    >
      <span className="normal-chars">{text}</span>
      <span className="absolute hover-chars">{text}</span>
    </button>
  );
}
