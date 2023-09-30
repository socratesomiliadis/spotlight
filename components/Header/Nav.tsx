import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useHeaderTheme } from "@/hooks/useHeaderTheme";

export function SpotlightNavigation() {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const { headerTheme } = useHeaderTheme();

  useEffect(() => {
    const openTl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.4,
        ease: "power4.Out",
      },
    });
    // openTl.to("nav", { borderRadius: "1.5rem", duration: 1.2 });
    openTl.to(".nav-content", {
      height: "300px",
    });
    openTl.to(
      "nav",
      {
        border: "1px solid #f6f6f610",
      },
      0
    );

    openTl.to(
      "nav .nav-indicator",
      {
        rotate: "45deg",
      },
      0
    );

    const closeTl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.4,
        ease: "power3.Out",
      },
    });
    closeTl.to(".nav-content", {
      height: "0",
    });
    // closeTl.to("nav", { borderRadius: "9999px", duration: 0.2 });
    closeTl.to(
      "nav",
      {
        border: "1px solid transparent",
      },
      0.1
    );
    closeTl.to(
      "nav .nav-indicator",
      {
        rotate: "0deg",
      },
      0
    );

    if (isHovering) {
      openTl.restart();
    } else {
      closeTl.restart();
    }

    return () => {
      openTl.kill();
      closeTl.kill();
    };
  }, [isHovering]);

  return (
    <nav
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="absolute group bg-[#d9d9d9]/40 backdrop-blur-xl rounded-3xl overflow-hidden top-8 left-1/2 -translate-x-1/2 w-[40vw]"
    >
      <div className="nav-trigger border-b-[1px] border-transparent transition-[border-color] duration-100 ease-out group-hover:border-[#f6f6f6]/10 cursor-pointer w-full h-12 flex flex-row items-center justify-between px-6">
        <Link href="/" className="h-full flex items-center">
          <Image
            style={{
              filter: headerTheme === "dark" ? "invert(1)" : "invert(0)",
            }}
            src="/static/images/Logo.png"
            width={157}
            height={37}
            alt="Spotlight Logo"
            className="h-[40%] object-contain object-left"
          />
        </Link>
        <span
          style={{
            color: headerTheme === "dark" ? "#000" : "#fff",
          }}
          className="nav-indicator w-5 text-white"
        >
          <svg
            width="100%"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.25 0.99707V21.5032M21.503 11.2501H0.996952"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
      <div className="nav-content w-full h-0"></div>
    </nav>
  );
}
