"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MultiSelectComboboxProps {
  label: string
  placeholder?: string
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  isInvalid?: boolean
  errorMessage?: string
  className?: string
}

export default function MultiSelectCombobox({
  label,
  placeholder = "Search and select tools...",
  value = [],
  onChange,
  options,
  isInvalid = false,
  errorMessage,
  className,
}: MultiSelectComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !value.includes(option)
  )

  const handleSelect = (option: string) => {
    if (!value.includes(option)) {
      onChange([...value, option])
    }
    setSearchQuery("")
    inputRef.current?.focus()
  }

  const handleRemove = (optionToRemove: string) => {
    onChange(value.filter((item) => item !== optionToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      searchQuery.trim() &&
      !filteredOptions.includes(searchQuery.trim())
    ) {
      e.preventDefault()
      const newTool = searchQuery.trim()
      if (!value.includes(newTool)) {
        onChange([...value, newTool])
      }
      setSearchQuery("")
    } else if (e.key === "Backspace" && !searchQuery && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#989898]">{label}</label>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "min-h-[56px] bg-white z-10 relative w-full flex items-center rounded-2xl border-[1px] border-[#EAEAEA] px-4 py-3 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-black/20",
                isInvalid && "border-red-500/50",
                "cursor-text"
              )}
              onClick={() => {
                setIsOpen(true)
                inputRef.current?.focus()
              }}
            >
              <div className="flex flex-wrap gap-2">
                {/* Selected tools as tags */}
                <AnimatePresence mode="popLayout">
                  {value.map((tool) => (
                    <motion.div
                      key={tool}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm"
                    >
                      <span>{tool}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(tool)
                        }}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6L6 18M6 6L18 18" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Search input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    value.length === 0 ? placeholder : "Add more tools..."
                  }
                  className="flex-1 min-w-[200px] bg-transparent outline-none text-black placeholder:text-[#BFBFBF]"
                />
              </div>
            </div>
          </PopoverTrigger>
        </div>

        <PopoverContent
          data-lenis-prevent
          className="w-[--radix-popover-trigger-width] px-0 pb-0 pt-3 border border-gray-200 z-0"
          align="start"
          sideOffset={-13}
        >
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-500 px-2 py-1 mb-1">
                  Suggested tools
                </div>
                {filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {searchQuery.trim() &&
              !filteredOptions.includes(searchQuery.trim()) &&
              !value.includes(searchQuery.trim()) && (
                <div className="p-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleSelect(searchQuery.trim())}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <span className="text-gray-500">Add custom tool: </span>
                    <span className="font-medium">
                      &quot;{searchQuery.trim()}&quot;
                    </span>
                  </button>
                </div>
              )}

            {filteredOptions.length === 0 && !searchQuery.trim() && (
              <div className="p-4 text-center text-gray-500 text-sm">
                Start typing to search or add custom tools
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {isInvalid && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
