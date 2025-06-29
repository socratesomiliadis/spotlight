"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  allowCustom?: boolean
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
  allowCustom = true,
}: MultiSelectComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [inputValue, setInputValue] = useState("")

  const handleSelect = (option: string) => {
    if (!value.includes(option)) {
      onChange([...value, option])
    }
    setInputValue("")
    setIsOpen(false)
  }

  const handleRemove = (optionToRemove: string) => {
    onChange(value.filter((item) => item !== optionToRemove))
  }

  const handleCustomAdd = () => {
    const customValue = inputValue.trim()
    if (
      customValue &&
      !value.includes(customValue) &&
      !options.includes(customValue)
    ) {
      onChange([...value, customValue])
      setInputValue("")
      setIsOpen(false)
    }
  }

  const filteredOptions = options.filter((option) => !value.includes(option))

  const hasCustomValue =
    allowCustom &&
    inputValue.trim() &&
    !value.includes(inputValue.trim()) &&
    !options.includes(inputValue.trim())

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#989898]">{label}</label>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "min-h-[56px] bg-white relative w-full flex items-center rounded-2xl border-[1px] border-[#EAEAEA] px-4 py-3 transition-colors hover:border-gray-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-black/20",
                isInvalid && "border-red-500/50"
              )}
              onClick={() => setIsOpen(true)}
            >
              <div className="flex flex-wrap gap-2 flex-1">
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
                        className="ml-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Placeholder text when no items selected */}
                {value.length === 0 && (
                  <span className="text-[#BFBFBF] text-sm">{placeholder}</span>
                )}
              </div>

              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </PopoverTrigger>
        </div>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 rounded-2xl"
          align="start"
          sideOffset={4}
        >
          <Command shouldFilter={false} className="rounded-2xl">
            <CommandInput
              placeholder="Search tools..."
              value={inputValue}
              onValueChange={setInputValue}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                {allowCustom && inputValue.trim() ? (
                  <div className="py-2">
                    <button
                      onClick={handleCustomAdd}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
                    >
                      Add &quot;{inputValue.trim()}&quot;
                    </button>
                  </div>
                ) : (
                  "No tools found."
                )}
              </CommandEmpty>

              {filteredOptions.length > 0 && (
                <CommandGroup heading="Available Tools">
                  {filteredOptions
                    .filter((option) =>
                      option.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => handleSelect(option)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.includes(option) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {hasCustomValue && (
                <CommandGroup heading="Custom">
                  <CommandItem
                    value={inputValue.trim()}
                    onSelect={handleCustomAdd}
                    className="cursor-pointer"
                  >
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    Add &quot;{inputValue.trim()}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {isInvalid && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
