"use client"

import { extendVariants, Select } from "@heroui/react"

const MySelect = extendVariants(Select, {
  variants: {
    // <- modify/add variants
    color: {
      stone: {
        // <- add a new color variant
        trigger: [
          // <- Input wrapper slot
          "bg-transparent",
          "border-[1px] border-[#EAEAEA]",
          "shadow-none",
          "transition-colors",
          "focus-within:bg-transparent",
          "data-[hover=true]:bg-transparent",
          "group-data-[focus=true]:bg-transparent",
          "group-data-[invalid=true]:!bg-transparent",
          "group-data-[invalid=true]:border-[#FF0000]/20",
          "rounded-2xl",
          "px-4",
          "h-14",
        ],
        value: [
          // <- Input element slot
          "text-black",
          "placeholder:text-[#BFBFBF]",
          "-mb-1",
        ],
        label: ["-mb-1"],
      },
    },
    size: {
      xs: {
        trigger: "h-6 min-h-6 px-1",
        value: "text-tiny",
      },
      md: {
        trigger: "h-10 min-h-10",
        value: "text-small",
      },
      xl: {
        trigger: "h-14 min-h-14",
        value: "text-medium",
      },
    },
    radius: {
      xs: {
        trigger: "rounded",
      },
      sm: {
        trigger: "rounded-[4px]",
      },
    },
    textSize: {
      base: {
        value: "text-base",
      },
    },
    removeLabel: {
      true: {
        label: "hidden",
      },
      false: {},
    },
  },
  defaultVariants: {
    color: "stone",
    textSize: "base",
  },
})

export default MySelect
