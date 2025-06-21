"use client";

import { ScrollTrigger } from "@/lib/gsap";
import PageWrapper from "./PageWrapper";
import { Lenis } from "lenis/react";
import { useLayoutEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    ScrollTrigger.clearScrollMemory("manual");
  }, []);
  return (
    <div className="relative max-w-[100vw] layout-wrapper">
      <Lenis root>{children}</Lenis>
    </div>
  );
}
