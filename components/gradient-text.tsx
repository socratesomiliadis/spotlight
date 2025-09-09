"use client"

import React, { forwardRef, useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

export default function AnimatedCopy({
  children,
  colorInitial = "#dddddd",
  colorAccent = "#abff02",
  colorFinal = "#000000",
}: {
  children: React.ReactNode
  colorInitial?: string
  colorAccent?: string
  colorFinal?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const splitRefs = useRef<{ wordSplit: SplitText; charSplit: SplitText }[]>([])
  const colorTransitionTimers = useRef(new Map())
  const completedChars = useRef(new Set())
  const [isInView, setIsInView] = useState(false)

  // Intersection Observer to detect when container is in view
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "-10% 0px -10% 0px",
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  useGSAP(
    () => {
      if (!containerRef.current) return

      splitRefs.current = []
      colorTransitionTimers.current.clear()
      completedChars.current.clear()

      let elements = []
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children)
      } else {
        elements = [containerRef.current]
      }

      elements.forEach((element) => {
        const wordSplit = SplitText.create(element, {
          type: "words",
          wordsClass: "word",
        })

        const charSplit = SplitText.create(wordSplit.words, {
          type: "chars",
          charsClass: "char",
        })

        splitRefs.current.push({ wordSplit, charSplit })
      })

      const allChars = splitRefs.current.flatMap(
        ({ charSplit }) => charSplit.chars
      )

      gsap.set(allChars, { color: colorInitial })

      const scheduleFinalTransition = (char: HTMLElement, index: number) => {
        if (colorTransitionTimers.current.has(index)) {
          clearTimeout(colorTransitionTimers.current.get(index))
        }

        const timer = setTimeout(() => {
          if (!completedChars.current.has(index)) {
            gsap.to(char, {
              duration: 0.2,
              ease: "none",
              color: colorFinal,
              onComplete: () => {
                completedChars.current.add(index)
              },
            })
          }
          colorTransitionTimers.current.delete(index)
        }, 100)

        colorTransitionTimers.current.set(index, timer)
      }

      // Animate characters when in view
      if (isInView) {
        allChars.forEach((char, index) => {
          // Stagger the animation based on character index
          gsap.to(char, {
            color: colorAccent,
            duration: 0.25,
            delay: index * 0.08,
            ease: "none",
            onComplete: () => {
              scheduleFinalTransition(char as HTMLElement, index)
            },
          })
        })
      } else {
        // Reset when out of view
        colorTransitionTimers.current.forEach((timer) => clearTimeout(timer))
        colorTransitionTimers.current.clear()
        completedChars.current.clear()
        gsap.set(allChars, { color: colorInitial })
      }

      return () => {
        colorTransitionTimers.current.forEach((timer) => clearTimeout(timer))
        colorTransitionTimers.current.clear()
        completedChars.current.clear()

        splitRefs.current.forEach(({ wordSplit, charSplit }) => {
          if (charSplit) charSplit.revert()
          if (wordSplit) wordSplit.revert()
        })
      }
    },
    {
      scope: containerRef,
      dependencies: [colorInitial, colorAccent, colorFinal, isInView],
    }
  )

  if (React.Children.count(children) === 1) {
    const child = React.Children.only(children) as React.ReactElement
    return React.cloneElement(child, {
      //@ts-expect-error this is an error
      ref: containerRef,
    })
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  )
}
