"use client";
import { extendVariants, Input } from "@heroui/react";

const MyInput = extendVariants(Input, {
  variants: {
    // <- modify/add variants
    color: {
      stone: {
        // <- add a new color variant
        inputWrapper: [
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
        input: [
          // <- Input element slot
          "focus:outline-none",
          "text-black",
          "placeholder:text-[#BFBFBF]",
          "-mb-1",
        ],
        label: ["-mb-1"],
      },
    },
    size: {
      xs: {
        inputWrapper: "h-6 min-h-6 px-1",
        input: "text-tiny",
      },
      md: {
        inputWrapper: "h-10 min-h-10",
        input: "text-small",
      },
      xl: {
        inputWrapper: "h-14 min-h-14",
        input: "text-medium",
      },
    },
    radius: {
      xs: {
        inputWrapper: "rounded",
      },
      sm: {
        inputWrapper: "rounded-[4px]",
      },
    },
    textSize: {
      base: {
        input: "text-base",
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
});

export default MyInput;
