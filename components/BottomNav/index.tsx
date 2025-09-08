"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { useOnClickOutside } from "usehooks-ts"

import { cn } from "@/lib/utils"
import { XIcon } from "@/components/icons"

import GooeySvgFilter from "../gooey-filter"
import BottomNavItem from "./bottom-nav-item"
import BottomNavQuickLink from "./bottom-quick-link"
import Search, { SearchResults } from "./search"
import SearchResultsComponent from "./search-results"

export default function BottomNav() {
  const ref = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResults>({
    users: [],
    projects: [],
  })
  const [isSearchActive, setIsSearchActive] = useState(false)
  const pathname = usePathname()

  const isAuthRoute =
    pathname.includes("/sign-in") || pathname.includes("/sign-up")

  useEffect(() => {
    //Close on Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false)
      }
    }
    window.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleClickOutside = () => {
    setIsExpanded(false)
    setIsSearchActive(false)
  }

  //@ts-expect-error dont care
  useOnClickOutside(ref, handleClickOutside)

  if (isAuthRoute) return null

  return (
    <>
      <div className="fixed w-screen bottom-4 lg:bottom-8 left-0 z-100">
        <div
          ref={ref}
          className={cn(
            "absolute bottom-0 z-100 left-1/2 -translate-x-1/2 flex flex-row items-center gap-1 transition-transform duration-500 ease-out-expo will-change-transform",
            !isExpanded && "-translate-x-1/2 lg:-translate-x-[71%]"
          )}
        >
          <div
            className={cn(
              "bg-[#1E1E1E]/90 backdrop-blur-xl p-0 w-[calc(100vw-1.75rem)] lg:w-[25vw] rounded-xl flex flex-col transition-all duration-500 ease-out-expo",
              isExpanded && "lg:w-[40vw]"
            )}
          >
            <div
              className={cn(
                "w-full h-0 transition-all duration-500 ease-out-expo overflow-hidden",
                isExpanded && "h-80 lg:h-120"
              )}
            >
              <div className="h-full flex flex-col pb-2 pr-2">
                <div
                  className={cn(
                    "px-4 w-full flex flex-row justify-between pt-4 pb-8 lg:pb-16",
                    isSearchActive && "pb-8 lg:pb-16"
                  )}
                >
                  <Link href="/" className="w-24 flex items-center text-white">
                    <svg
                      width="100%"
                      viewBox="0 0 2158 532"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M131.634 432.193C48.3527 432.193 2.38581 390.011 0.222656 324.576H70.525C72.1473 361.89 95.942 378.114 131.093 378.114C167.867 378.114 187.876 360.809 187.876 334.31C187.876 311.056 173.275 296.996 136.501 296.996H104.054C41.8633 296.996 5.63053 262.926 5.63053 212.633C5.63053 155.85 51.5974 116.373 129.471 116.373C209.507 116.373 253.311 158.554 255.474 221.826H185.713C184.09 188.298 165.704 170.452 129.471 170.452C97.0236 170.452 77.0144 185.594 77.0144 209.929C77.0144 232.101 93.7788 242.917 121.359 242.917H157.051C228.435 242.917 260.882 282.935 260.882 331.606C260.882 390.552 214.374 432.193 131.634 432.193Z"
                        fill="currentColor"
                      />
                      <path
                        d="M291.238 531.157V125.566H358.836V147.198C358.836 158.014 358.836 167.207 358.296 177.482H359.377C377.223 139.627 413.456 116.373 458.882 116.373C528.103 116.373 591.375 170.992 591.375 274.283C591.375 377.573 528.103 432.193 458.882 432.193C413.456 432.193 377.223 408.939 359.377 371.084H358.296C358.836 382.44 358.836 392.174 358.836 402.99V531.157H291.238ZM358.836 274.283C358.836 337.014 388.58 378.114 438.332 378.114C488.625 378.114 518.369 337.014 518.369 274.283C518.369 211.551 488.625 170.452 438.332 170.452C388.58 170.452 358.836 211.551 358.836 274.283Z"
                        fill="currentColor"
                      />
                      <path
                        d="M759.205 432.193C675.383 432.193 608.325 375.951 608.325 274.283C608.325 172.615 675.383 116.373 759.205 116.373C843.027 116.373 910.084 172.615 910.084 274.283C910.084 375.951 843.027 432.193 759.205 432.193ZM681.331 274.283C681.331 342.963 712.156 378.114 759.205 378.114C806.253 378.114 837.078 342.963 837.078 274.283C837.078 205.603 806.253 170.452 759.205 170.452C712.156 170.452 681.331 205.603 681.331 274.283Z"
                        fill="currentColor"
                      />
                      <path
                        d="M1044.09 422.999C991.092 422.999 962.972 396.501 962.972 342.422V181.267H905.648V125.566H962.972V44.4483H1031.65V125.566H1121.42V181.267H1031.65V332.147C1031.65 357.564 1044.63 367.298 1067.34 367.298H1123.04V422.999H1044.09Z"
                        fill="currentColor"
                      />
                      <path
                        d="M1147.75 422.999V0.644531H1215.89V422.999H1147.75Z"
                        fill="currentColor"
                      />
                      <path
                        d="M1266.2 422.999V125.566H1334.34V422.999H1266.2ZM1265.12 78.5179V12.5418H1334.88V78.5179H1265.12Z"
                        fill="currentColor"
                      />
                      <path
                        d="M1445.34 531.157C1385.85 531.157 1357.73 503.577 1357.73 466.803C1357.73 438.141 1374.49 414.887 1408.02 407.316V406.235C1386.39 397.582 1372.33 379.736 1372.33 355.401C1372.33 327.28 1391.8 308.893 1416.68 305.648L1423.71 304.567V303.485C1389.64 289.425 1368.55 259.141 1368.55 218.582C1368.55 153.147 1424.25 116.373 1490.22 116.373C1533.49 116.373 1571.88 133.137 1593.51 161.799H1594.59C1595.68 139.086 1609.2 125.566 1631.37 125.566H1644.89V181.267H1623.8C1614.06 181.267 1609.74 184.512 1608.65 192.624C1610.82 200.736 1611.9 209.388 1611.9 218.582C1611.9 282.395 1559.44 321.331 1492.39 321.331H1458.32C1442.09 321.331 1431.82 326.739 1431.82 340.259C1431.82 352.697 1441.01 359.727 1458.32 359.727H1549.71C1611.9 359.727 1648.13 392.715 1648.13 445.172C1648.13 497.628 1611.9 531.157 1549.71 531.157H1445.34ZM1415.59 448.416C1415.59 468.966 1428.57 483.027 1457.23 483.027H1539.43C1565.93 483.027 1581.07 470.048 1581.07 448.416C1581.07 426.244 1565.93 413.806 1539.43 413.806H1457.23C1429.65 413.806 1415.59 427.326 1415.59 448.416ZM1433.44 221.826C1433.44 256.978 1459.4 273.201 1490.22 273.201C1521.05 273.201 1547 256.978 1547 221.826C1547 186.675 1521.05 170.452 1490.22 170.452C1459.4 170.452 1433.44 186.675 1433.44 221.826Z"
                        fill="currentColor"
                      />
                      <path
                        d="M1669.44 422.999V0.644531H1737.58V121.781C1737.58 135.301 1737.58 145.575 1736.5 170.992H1737.58C1753.26 138.545 1784.09 116.373 1826.81 116.373C1887.92 116.373 1929.56 158.554 1929.56 231.02V422.999H1861.42V244.54C1861.42 191.542 1838.71 170.992 1805.18 170.992C1770.03 170.992 1737.58 193.165 1737.58 252.651V422.999H1669.44Z"
                        fill="currentColor"
                      />
                      <path
                        d="M2078.87 422.999C2025.88 422.999 1997.76 396.501 1997.76 342.422V181.267H1940.43V125.566H1997.76V44.4483H2066.44V125.566H2156.21V181.267H2066.44V332.147C2066.44 357.564 2079.41 367.298 2102.13 367.298H2157.83V422.999H2078.87Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                </div>
                <div
                  data-lenis-prevent
                  className="w-full h-full overflow-y-auto bottom-nav-scroller flex flex-col gap-0 pb-16 relative"
                >
                  {isSearchActive ? (
                    <div className="px-2 py-2 border-white/5 border-t">
                      <SearchResultsComponent
                        users={searchResults.users}
                        projects={searchResults.projects}
                        isVisible={true}
                        onResultClick={() => {
                          setIsExpanded(false)
                          setIsSearchActive(false)
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <BottomNavItem
                        imageSRC="/static/images/bottom-nav/web.png"
                        text="Websites"
                        href="/?category=websites"
                        className="border-t"
                      />
                      <BottomNavItem
                        imageSRC="/static/images/bottom-nav/design.png"
                        text="Design"
                        href="/?category=design"
                      />

                      <BottomNavItem
                        imageSRC="/static/images/bottom-nav/crypto.png"
                        text="Crypto"
                        href="/?category=crypto"
                      />
                      <BottomNavItem
                        imageSRC="/static/images/bottom-nav/film.png"
                        text="Films"
                        href="/?category=films"
                      />
                      <BottomNavItem
                        imageSRC="/static/images/bottom-nav/ai.png"
                        text="AI"
                        href="/?category=ai"
                      />
                      <BottomNavItem
                        imageSRC="/static/images/bottom-nav/startup.png"
                        text="Start-Ups"
                        href="/?category=startups"
                      />
                    </>
                  )}
                  {/* <div
                  className={cn(
                    "w-full h-16 bg-linear-to-t from-[#1e1e1e] via-[#1e1e1e]/80 to-transparent fixed bottom-[3.6rem] left-0 z-10 pointer-events-none",
                    !isExpanded && "hidden"
                  )}
                ></div> */}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row justify-between">
              <div className="min-w-fit flex items-center justify-center p-1.5">
                <Search
                  isExpanded={isExpanded}
                  setIsExpanded={setIsExpanded}
                  onSearchResults={setSearchResults}
                  onSearchActive={setIsSearchActive}
                />
                {isExpanded && (
                  <motion.div
                    layoutDependency={isExpanded}
                    layoutId="bottomQuickLinks"
                    transition={{
                      duration: 0.4,
                      ease: [0.175, 0.885, 0.32, 1],
                    }}
                    className="hidden lg:flex flex-row gap-1 mb-0 will-change-transform"
                  >
                    <BottomNavQuickLink text="Home" href="/" inverted />
                    <BottomNavQuickLink text="Directory" href="/" inverted />
                  </motion.div>
                )}
              </div>
              <button
                onClick={() => {
                  setIsExpanded(!isExpanded)
                  if (isExpanded) {
                    setIsSearchActive(false)
                  }
                }}
                className="w-full pr-4 flex items-center justify-end gap-1 focus:outline-hidden p-1.5"
              >
                <span className="ml-3">
                  <span className="size-4 relative flex items-center justify-center">
                    <span
                      className={cn(
                        "absolute w-[2px] h-full bg-white transition-all duration-500 ease-out-expo",
                        isExpanded && "rotate-90"
                      )}
                    ></span>
                    <span className="absolute w-full h-[2px] bg-white"></span>
                  </span>
                </span>
              </button>
            </div>
          </div>
          {!isExpanded && (
            <motion.div
              layoutDependency={isExpanded}
              transition={{
                duration: 0.4,
                ease: [0.175, 0.885, 0.32, 1],
              }}
              layoutId="bottomQuickLinks"
              className="absolute left-[calc(100%+0.25rem)] bottom-0 hidden lg:flex flex-row gap-1 will-change-transform"
            >
              <BottomNavQuickLink text="Home" href="/" inverted={isExpanded} />
              <BottomNavQuickLink
                text="Directory"
                href="/"
                inverted={isExpanded}
              />
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
