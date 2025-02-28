"use client";

import { Lenis } from "lenis/react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative max-w-[100vw] layout-wrapper">
      <Lenis root>{children}</Lenis>
    </div>
  );
}
