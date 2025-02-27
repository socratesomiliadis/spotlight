"use client";
import { cn } from "@/lib/utils";
import Search from "./search";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const isAuthRoute =
    pathname.includes("/sign-in") || pathname.includes("/sign-up");

  if (isAuthRoute) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-12 bg-[#1E1E1E] p-1.5 z-[100] w-[40vw] rounded-xl flex flex-col">
      <div
        className={cn(
          "w-full h-0 transition-all duration-500 ease-out-expo overflow-hidden",
          isExpanded && "h-96"
        )}
      ></div>
      <div className="w-full flex flex-row items-center justify-between">
        <Search />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mr-3 flex justify-end"
        >
          <span className="size-4 relative flex items-center justify-center">
            <span
              className={cn(
                "absolute w-[2px] h-full bg-white transition-all duration-500 ease-out-expo",
                isExpanded && "rotate-90"
              )}
            ></span>
            <span className="absolute w-full h-[2px] bg-white"></span>
          </span>
        </button>
      </div>
    </div>
  );
}
