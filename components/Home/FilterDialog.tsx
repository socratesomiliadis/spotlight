"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLenis } from "lenis/react"
import { X } from "lucide-react"

import tagsData from "@/lib/tags.json"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FilterDialogProps {
  children: React.ReactNode
}

const categories = [
  { key: "websites", label: "Websites" },
  { key: "design", label: "Design" },
  { key: "crypto", label: "Crypto" },
  { key: "startups", label: "Startups" },
  { key: "films", label: "Films" },
  { key: "ai", label: "AI" },
]

const awards = [
  { key: "otd", label: "Of the Day" },
  { key: "otm", label: "Of the Month" },
  { key: "oty", label: "Of the Year" },
  { key: "honorable", label: "Honorable Mention" },
]

// Hook to get current filter state
export function useFilters() {
  const searchParams = useSearchParams()

  const category = searchParams.get("category") || ""
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) || []
  const award = searchParams.get("award") || ""

  const activeFilterCount = (category ? 1 : 0) + tags.length + (award ? 1 : 0)
  const hasActiveFilters = activeFilterCount > 0

  return {
    category,
    tags,
    activeFilterCount,
    hasActiveFilters,
  }
}

export default function FilterDialog({ children }: FilterDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedAward, setSelectedAward] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const lenis = useLenis()

  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize state from URL params
  useEffect(() => {
    const category = searchParams.get("category") || ""
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || []
    const award = searchParams.get("award") || ""

    setSelectedCategory(category)
    setSelectedAward(award)
    setSelectedTags(tags)
  }, [searchParams])

  useEffect(() => {
    if (open) {
      lenis?.stop()
    } else {
      lenis?.start()
    }
  }, [open, lenis])

  // Get available tags for selected category
  const availableTags = selectedCategory
    ? tagsData.categories[
        selectedCategory as keyof typeof tagsData.categories
      ] || []
    : []

  // Filter tags based on search query
  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCategoryChange = (categoryKey: string) => {
    setSelectedCategory(categoryKey === selectedCategory ? "" : categoryKey)
    // Clear tags when category changes
    if (categoryKey !== selectedCategory) {
      setSelectedTags([])
    }
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleAwardChange = (awardKey: string) => {
    setSelectedAward(awardKey === selectedAward ? "" : awardKey)
  }

  const handleApply = () => {
    const params = new URLSearchParams()

    if (selectedCategory) {
      params.set("category", selectedCategory)
    }

    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","))
    }

    if (selectedAward) {
      params.set("award", selectedAward)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname

    router.push(newUrl)
    setOpen(false)
  }

  const handleClear = () => {
    setSelectedCategory("")
    setSelectedAward("")
    setSelectedTags([])
    setSearchQuery("")
    router.push(window.location.pathname)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className=" bg-[#1E1E1E]/70 backdrop-blur-xl rounded-2xl border-0 p-0 gap-0 text-white w-[25vw] max-w-none">
        <DialogTitle className="sr-only">Filter</DialogTitle>
        <div className="flex flex-col ">
          {/* Search Input */}
          <div className="py-2 border-b-[1px] border-b-white/5">
            <div className="relative flex items-center">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 placeholder:text-white/60 text-white focus:outline-none bg-transparent"
              />
            </div>
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="px-3 pt-2">
                <div className="flex flex-wrap gap-2">
                  {/* {selectedCategory && (
                  <div className="flex items-center gap-1 bg-white/10 text-white px-2 py-1 rounded-md text-xs">
                    <span>
                      {
                        categories.find((c) => c.key === selectedCategory)
                          ?.label
                      }
                    </span>
                    <button
                      onClick={() => handleCategoryChange(selectedCategory)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )} */}
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-white/10 text-white px-2 py-1 rounded-lg text-xs"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleTagToggle(tag)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full">
              {/* Left Side - Categories */}
              <div className="pr-10">
                <div className="px-2 py-3">
                  <h3 className="ml-2 text-sm font-medium text-white mb-2 flex items-center gap-1">
                    Categories
                  </h3>
                  <div className="text-lg">
                    {categories.map((category) => (
                      <label
                        key={category.key}
                        className={cn(
                          "flex items-center cursor-pointer w-fit group rounded-lg px-2.5 py-0.5 text-white/60 group-hover:text-white transition-colors duration-300",
                          selectedCategory === category.key &&
                            "text-black bg-white"
                        )}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.key}
                          checked={selectedCategory === category.key}
                          onChange={() => handleCategoryChange(category.key)}
                          className="hidden"
                        />
                        <span className="">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="px-2 py-3">
                  <h3 className="ml-2 text-sm font-medium text-white mb-2 flex items-center gap-1">
                    Awards
                  </h3>
                  <div className="text-lg">
                    {awards.map((award) => (
                      <button
                        key={award.key}
                        onClick={() => handleAwardChange(award.key)}
                        className={cn(
                          "flex items-center cursor-pointer w-fit group rounded-lg px-2.5 py-0.5 text-white/60 hover:text-white transition-colors duration-300",
                          selectedAward === award.key && "text-black bg-white"
                        )}
                      >
                        <span className="">{award.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Tags */}
              <div className="flex-1">
                <div className="p-3 h-full">
                  <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-1">
                    Tags
                  </h3>

                  {!selectedCategory ? (
                    <p className="text-xs text-white/60">
                      Select a category to see available tags
                    </p>
                  ) : (
                    <div
                      data-lenis-prevent
                      className="space-y-1 max-h-80 overflow-y-auto bottom-nav-scroller"
                    >
                      {filteredTags.map((tag) => (
                        <label
                          key={tag}
                          className={cn(
                            "flex items-center cursor-pointer text-white/30 group-hover:text-white",
                            selectedTags.includes(tag) && "text-white"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                            className="hidden"
                          />
                          <span>{tag}</span>
                        </label>
                      ))}
                      {filteredTags.length === 0 && searchQuery && (
                        <p className="text-xs text-white/60">
                          No tags found matching &quot;{searchQuery}&quot;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 flex gap-2 justify-end">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-white/60 hover:text-white font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-white text-black text-sm rounded-lg hover:bg-white/70 font-medium transition-colors duration-300"
            >
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
