"use client"

import { RefObject, useRef, useState } from "react"
import Link from "next/link"

import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect"
import TextSplit from "@/components/text-split"

export default function CustomButton({
  text,
  href,
  inverted,
  className,
  onClick,
  type,
  disabled,
}: {
  text: string
  href?: string
  inverted?: boolean
  className?: string
  onClick?: () => void
  type?: "submit" | "button"
  disabled?: boolean
}) {
  const classes = cn(
    "bg-black group/btn px-6 py-2 rounded-lg lg:rounded-xl text-white tracking-tight text-sm lg:text-lg relative overflow-hidden flex items-center justify-center font-[550]",
    inverted &&
      "bg-white py-[0.4rem] border-[2px] box-border border-black text-black",
    disabled && "opacity-50 cursor-not-allowed",
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        <span className="normal-chars group-hover/btn:translate-y-[-120%] transition-all duration-400 ease-spring">
          {text}
        </span>
        <span className="absolute hover-chars translate-y-[120%] group-hover/btn:translate-y-0 transition-all duration-400 ease-spring">
          {text}
        </span>
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      <span className="normal-chars group-hover/btn:translate-y-[-120%] transition-all duration-400 ease-spring">
        {text}
      </span>
      <span className="absolute hover-chars translate-y-[120%] group-hover/btn:translate-y-0 transition-all duration-400 ease-spring">
        {text}
      </span>
    </button>
  )
}
