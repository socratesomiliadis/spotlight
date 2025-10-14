"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

const categories = [
  { key: "", label: "All Categories" },
  { key: "websites", label: "Websites" },
  { key: "design", label: "Design" },
  { key: "crypto", label: "Crypto" },
  { key: "startups", label: "Startups" },
  { key: "films", label: "Films" },
  { key: "ai", label: "AI" },
]

const awards = [
  { key: "", label: "All Awards" },
  { key: "otd", label: "Of the Day" },
  { key: "otm", label: "Of the Month" },
  { key: "oty", label: "Of the Year" },
  { key: "honorable", label: "Honorable Mention" },
]

export default function DashboardFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  )
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  )
  const [selectedAward, setSelectedAward] = useState(
    searchParams.get("award") || ""
  )

  // Debounced search with immediate category/award updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()

      if (searchQuery) params.set("search", searchQuery)
      if (selectedCategory) params.set("category", selectedCategory)
      if (selectedAward) params.set("award", selectedAward)

      const queryString = params.toString()
      const newUrl = queryString ? `?${queryString}` : "/dashboard"

      router.push(newUrl, { scroll: false })
    }, 300) // 300ms debounce for search

    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, selectedAward, router])

  const handleClearAll = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedAward("")
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedAward

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
        <input
          type="text"
          placeholder="Search by project title or creator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-sm"
        >
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>

        {/* Award Filter */}
        <select
          value={selectedAward}
          onChange={(e) => setSelectedAward(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-sm"
        >
          {awards.map((award) => (
            <option key={award.key} value={award.key}>
              {award.label}
            </option>
          ))}
        </select>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="px-3 py-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
