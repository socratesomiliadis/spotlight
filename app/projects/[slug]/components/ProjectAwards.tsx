import { Database, Tables } from "@/database.types"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProjectAwardsProps {
  awards?: Tables<"award">[]
  category?: Database["public"]["Enums"]["category"]
}

// Helper function to get category display name
function getCategoryDisplayName(
  category?: Database["public"]["Enums"]["category"]
): string {
  const categoryMap: Record<Database["public"]["Enums"]["category"], string> = {
    websites: "Site",
    design: "Design",
    films: "Film",
    crypto: "Crypto",
    startups: "Startup",
    ai: "AI",
  }
  return category ? categoryMap[category] : "Site"
}

// Helper function to get award label based on category
function getAwardLabel(
  awardType: Database["public"]["Enums"]["awards"],
  category?: Database["public"]["Enums"]["category"]
): string {
  const categoryName = getCategoryDisplayName(category)

  switch (awardType) {
    case "otd":
      return `${categoryName} of the Day`
    case "otm":
      return `${categoryName} of the Month`
    case "oty":
      return `${categoryName} of the Year`
    case "honorable":
      return "Honorable Mention"
  }
}

// Helper function to format the awarded date for tooltip
function formatAwardedDate(
  awardedAt: string,
  awardType: Database["public"]["Enums"]["awards"]
): string {
  const date = new Date(awardedAt)

  switch (awardType) {
    case "oty":
      return `Awarded in ${date.getFullYear()}`
    case "otm":
      return `Awarded ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
    case "otd":
    case "honorable":
      return `Awarded ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
  }
}

const AWARD_STYLES = {
  otm: {
    bgColor: "bg-[#A4810E]",
    textColor: "text-white",
  },
  otd: {
    bgColor: "bg-black",
    textColor: "text-white",
  },
  honorable: {
    bgColor: "bg-[#f6f6f6]",
    textColor: "text-[#989898]",
  },
  oty: {
    bgColor: "bg-[#FF98FB]",
    textColor: "text-black",
  },
}

const TrophyIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 800 800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M750 50H600C600 22.3125 577.637 0 550 0H250C222.363 0 200 22.3125 200 50H50C22.3625 50 0 72.3125 0 100V200C0 310.45 89.55 400 200 400C202.35 400 204.538 399.362 206.838 399.262C224.8 469.625 279.738 524.663 350 542.875V700H250C222.363 700 200 722.313 200 750V800H600V750C600 722.313 577.637 700 550 700H450V542.875C520.262 524.663 575.2 469.637 593.162 399.275C595.462 399.362 597.65 400 600 400C710.45 400 800 310.45 800 200V100C800 72.3125 777.637 50 750 50ZM100 200V150H200V300C144.775 300 100 255.175 100 200ZM700 200C700 255.175 655.225 300 600 300V150H700V200Z"
      fill="currentColor"
    />
  </svg>
)

const BookmarkIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 16 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 10.5264 14.8289 12.7793 13 14.2454V20.0353C13 21.3362 11.631 22.1823 10.4674 21.6006L8 20.3669L5.53262 21.6006C4.36905 22.1823 3 21.3362 3 20.0353V14.2454C1.17108 12.7793 0 10.5264 0 8ZM5 15.4185V19.6308L7.21738 18.5221C7.71005 18.2758 8.28995 18.2758 8.78262 18.5221L11 19.6308V15.4185C10.0736 15.7935 9.0609 16 8 16C6.9391 16 5.92643 15.7935 5 15.4185Z"
      fill="currentColor"
    />
  </svg>
)

export default function ProjectAwards({
  awards = [],
  category,
}: ProjectAwardsProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-between mb-8 border-y border-[#EAEAEA] px-4 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2 font-medium tracking-tight text-sm lg:text-base">
          {awards.length > 0
            ? awards.map((award) => {
                const styles = AWARD_STYLES[award.award_type]
                const label = getAwardLabel(award.award_type, category)
                const tooltipText = formatAwardedDate(
                  award.awarded_at,
                  award.award_type
                )
                const Icon =
                  award.award_type === "honorable" ? BookmarkIcon : TrophyIcon

                return (
                  <Tooltip key={award.award_type}>
                    <TooltipTrigger asChild>
                      <button
                        className={`flex items-center gap-2 ${styles.bgColor} ${styles.textColor} px-4 py-2 rounded-lg cursor-default`}
                      >
                        <span
                          className={`${award.award_type === "honorable" ? "size-[1.1rem]" : "size-4"} flex`}
                        >
                          <Icon />
                        </span>
                        <span>{label}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })
            : null}
        </div>
      </div>
    </TooltipProvider>
  )
}
