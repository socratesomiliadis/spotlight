"use client";

import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import SplitType, { TypesList } from "split-type";

export default function TextSplit({
  children,
  types,
  className,
  wordsClassName,
  charsClassName,
  linesClassName,
}: {
  children: React.ReactNode;
  types: TypesList | undefined;
  className?: string;
  wordsClassName?: string;
  charsClassName?: string;
  linesClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState<SplitType | null>(null);
  useIsomorphicLayoutEffect(() => {
    const target = ref.current as HTMLDivElement;

    function createSplit() {
      const split = SplitType.create(target, {
        types,
        ...(types?.includes("lines") &&
          linesClassName && { lineClass: linesClassName }),
        ...(types?.includes("words") &&
          wordsClassName && { wordClass: wordsClassName }),
        ...(types?.includes("chars") &&
          charsClassName && { charClass: charsClassName }),
      });

      setSplit(split);
    }

    createSplit();

    window.addEventListener("resize", createSplit);

    return () => {
      split?.revert();
      window.removeEventListener("resize", createSplit);
    };
  }, []);

  return (
    <div ref={ref} className={cn(" ", className)}>
      {children}
    </div>
  );
}
