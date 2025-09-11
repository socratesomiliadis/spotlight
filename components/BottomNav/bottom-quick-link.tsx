"use client"

import { useRef, useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export default function BottomNavQuickLink({
  text,
  href,
  inverted,
  isExternal,
  className,
}: {
  text: string
  href: string
  inverted?: boolean
  isExternal?: boolean
  className?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : "_self"}
      ref={ref}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "bg-[#1E1E1E]/90 backdrop-blur-xl px-5 py-3.5 rounded-xl text-white tracking-tight text-base font-medium relative overflow-hidden flex items-center justify-center bottom-nav-quick-link whitespace-nowrap",
        inverted && "bg-white text-black py-2 rounded-lg",
        className
      )}
    >
      <span>{text}</span>
    </Link>
  )
}
