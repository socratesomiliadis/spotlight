"use client"

import { useState } from "react"
import { Button } from "@heroui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react"
import { CalendarDays } from "lucide-react"

import { giveAward, removeAwardAction } from "@/lib/supabase/actions/projects"

type AwardType = "otd" | "otm" | "oty" | "honorable"

interface AwardButtonsProps {
  projectId: string
  currentAwards: Array<{
    award_type: AwardType
    awarded_at: string
    created_at: string
  }>
}

const awardLabels = {
  otd: "Of the Day",
  otm: "Of the Month",
  oty: "Of the Year",
  honorable: "Honorable",
}

const awardColors = {
  otd: "bg-yellow-500 text-white",
  otm: "bg-blue-500 text-white",
  oty: "bg-purple-500 text-white",
  honorable: "bg-green-500 text-white",
}

interface DatePickerPopoverProps {
  awardType: AwardType
  isOpen: boolean
  isEditing: boolean
  selectedDate: string
  isLoading: boolean
  onDateChange: (date: string) => void
  onCancel: () => void
  onSubmit: () => void
}

function DatePickerPopover({
  awardType,
  isOpen,
  isEditing,
  selectedDate,
  isLoading,
  onDateChange,
  onCancel,
  onSubmit,
}: DatePickerPopoverProps) {
  // Determine input type and label based on award type
  const getInputTypeAndLabel = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}`
    const currentDate = now.toISOString().split("T")[0]

    if (awardType === "oty") {
      return {
        type: "number",
        label: "Select Year:",
        placeholder: "YYYY",
        min: currentYear.toString(),
      }
    } else if (awardType === "otm") {
      return {
        type: "month",
        label: "Select Month:",
        placeholder: "",
        min: currentMonth,
      }
    } else {
      return {
        type: "date",
        label: "Select Date:",
        placeholder: "",
        min: currentDate,
      }
    }
  }

  const { type, label, placeholder, min } = getInputTypeAndLabel()

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      placement="bottom"
    >
      <PopoverTrigger>
        <div></div>
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <div className="flex flex-col gap-3 min-w-[280px]">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-sm">
              {isEditing ? "Edit" : "Give"} {awardLabels[awardType]} Award
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-600">{label}</label>
            <input
              type={type}
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              placeholder={placeholder}
              min={min}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">
              Awards can only be given for current or future dates
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="light"
              onPress={onCancel}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              color="primary"
              onPress={onSubmit}
              isDisabled={!selectedDate || isLoading}
              isLoading={isLoading}
            >
              {isEditing ? "Update" : "Give Award"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function AwardButtons({
  projectId,
  currentAwards,
}: AwardButtonsProps) {
  const [isLoading, setIsLoading] = useState<AwardType | null>(null)
  const [showDatePicker, setShowDatePicker] = useState<AwardType | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")

  const hasAward = (awardType: AwardType) => {
    return currentAwards.some((award) => award.award_type === awardType)
  }

  const getAwardDate = (awardType: AwardType) => {
    const award = currentAwards.find((award) => award.award_type === awardType)
    if (!award) return null

    const date = new Date(award.awarded_at)

    if (awardType === "oty") {
      return date.getFullYear().toString()
    } else if (awardType === "otm") {
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleAwardClick = async (awardType: AwardType) => {
    if (hasAward(awardType)) {
      // Remove award directly
      setIsLoading(awardType)
      try {
        await removeAwardAction(projectId, awardType)
      } catch (error) {
        console.error("Award removal failed:", error)
        alert("Failed to remove award. Please try again.")
      } finally {
        setIsLoading(null)
      }
    } else {
      // Show date picker for giving award
      const now = new Date()
      let defaultDate = ""

      if (awardType === "oty") {
        defaultDate = now.getFullYear().toString()
      } else if (awardType === "otm") {
        defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
      } else {
        defaultDate = now.toISOString().split("T")[0]
      }

      setSelectedDate(defaultDate)
      setShowDatePicker(awardType)
    }
  }

  const handleDateSubmit = async (awardType: AwardType) => {
    if (!selectedDate) return

    // Validate that the date is not in the past
    const now = new Date()
    let isValid = false

    if (awardType === "oty") {
      const selectedYear = parseInt(selectedDate)
      isValid = selectedYear >= now.getFullYear()
      if (!isValid) {
        alert("Cannot award for a past year.")
        return
      }
    } else if (awardType === "otm") {
      const selectedMonthDate = new Date(`${selectedDate}-01`)
      const currentMonthDate = new Date(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
      )
      isValid = selectedMonthDate >= currentMonthDate
      if (!isValid) {
        alert("Cannot award for a past month.")
        return
      }
    } else {
      const selectedDayDate = new Date(selectedDate)
      const currentDayDate = new Date(now.toISOString().split("T")[0])
      isValid = selectedDayDate >= currentDayDate
      if (!isValid) {
        alert("Cannot award for a past date.")
        return
      }
    }

    setIsLoading(awardType)
    try {
      let awardedAt = ""

      if (awardType === "oty") {
        // For year awards, use January 1st of that year
        awardedAt = new Date(`${selectedDate}-01-01`).toISOString()
      } else if (awardType === "otm") {
        // For month awards, use the 1st of that month
        awardedAt = new Date(`${selectedDate}-01`).toISOString()
      } else {
        // For day awards, use the selected date
        awardedAt = new Date(selectedDate).toISOString()
      }

      await giveAward(projectId, awardType, awardedAt)
      setShowDatePicker(null)
      setSelectedDate("")
    } catch (error) {
      console.error("Award creation failed:", error)
      alert("Failed to give award. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  const handleEditDate = (awardType: AwardType) => {
    const award = currentAwards.find((award) => award.award_type === awardType)
    if (award) {
      const date = new Date(award.awarded_at)
      let formattedDate = ""

      if (awardType === "oty") {
        formattedDate = date.getFullYear().toString()
      } else if (awardType === "otm") {
        formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      } else {
        formattedDate = date.toISOString().split("T")[0]
      }

      setSelectedDate(formattedDate)
      setShowDatePicker(awardType)
    }
  }

  const cancelDatePicker = () => {
    setShowDatePicker(null)
    setSelectedDate("")
  }

  const handleDateUpdate = async (awardType: AwardType) => {
    if (!selectedDate) return

    // Validate that the date is not in the past
    const now = new Date()
    let isValid = false

    if (awardType === "oty") {
      const selectedYear = parseInt(selectedDate)
      isValid = selectedYear >= now.getFullYear()
      if (!isValid) {
        alert("Cannot award for a past year.")
        return
      }
    } else if (awardType === "otm") {
      const selectedMonthDate = new Date(`${selectedDate}-01`)
      const currentMonthDate = new Date(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
      )
      isValid = selectedMonthDate >= currentMonthDate
      if (!isValid) {
        alert("Cannot award for a past month.")
        return
      }
    } else {
      const selectedDayDate = new Date(selectedDate)
      const currentDayDate = new Date(now.toISOString().split("T")[0])
      isValid = selectedDayDate >= currentDayDate
      if (!isValid) {
        alert("Cannot award for a past date.")
        return
      }
    }

    setIsLoading(awardType)
    try {
      // Remove old award and create new one with updated date
      await removeAwardAction(projectId, awardType)

      let awardedAt = ""

      if (awardType === "oty") {
        // For year awards, use January 1st of that year
        awardedAt = new Date(`${selectedDate}-01-01`).toISOString()
      } else if (awardType === "otm") {
        // For month awards, use the 1st of that month
        awardedAt = new Date(`${selectedDate}-01`).toISOString()
      } else {
        // For day awards, use the selected date
        awardedAt = new Date(selectedDate).toISOString()
      }

      await giveAward(projectId, awardType, awardedAt)
      setShowDatePicker(null)
      setSelectedDate("")
    } catch (error) {
      console.error("Award date update failed:", error)
      alert("Failed to update award date. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-sm font-medium text-gray-600 mb-2">Awards:</div>
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(awardLabels) as AwardType[]).map((awardType) => {
          const awarded = hasAward(awardType)
          const loading = isLoading === awardType
          const awardDate = getAwardDate(awardType)

          return (
            <div key={awardType} className="flex flex-col gap-1 relative">
              <button
                onClick={() => handleAwardClick(awardType)}
                disabled={loading}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium transition-all
                  ${
                    awarded
                      ? awardColors[awardType]
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                  ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {loading
                  ? "..."
                  : awarded
                    ? `✓ ${awardLabels[awardType]}`
                    : awardLabels[awardType]}
              </button>

              {awarded && awardDate && (
                <button
                  onClick={() => handleEditDate(awardType)}
                  className="text-xs text-gray-500 text-center hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                  title="Click to edit date"
                >
                  {awardDate}
                </button>
              )}

              <DatePickerPopover
                awardType={awardType}
                isOpen={showDatePicker === awardType}
                isEditing={awarded}
                selectedDate={selectedDate}
                isLoading={isLoading === awardType}
                onDateChange={setSelectedDate}
                onCancel={cancelDatePicker}
                onSubmit={() =>
                  awarded
                    ? handleDateUpdate(awardType)
                    : handleDateSubmit(awardType)
                }
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
