"use client"

import { useSearchParams } from "next/navigation"

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
    award,
    activeFilterCount,
    hasActiveFilters,
  }
}
