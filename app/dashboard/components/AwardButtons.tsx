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
    return award ? new Date(award.awarded_at).toLocaleDateString() : null
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
      setSelectedDate(new Date().toISOString().split("T")[0]) // Default to today
      setShowDatePicker(awardType)
    }
  }

  const handleDateSubmit = async (awardType: AwardType) => {
    if (!selectedDate) return

    setIsLoading(awardType)
    try {
      const awardedAt = new Date(selectedDate).toISOString()
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
      setSelectedDate(new Date(award.awarded_at).toISOString().split("T")[0])
      setShowDatePicker(awardType)
    }
  }

  const cancelDatePicker = () => {
    setShowDatePicker(null)
    setSelectedDate("")
  }

  const handleDateUpdate = async (awardType: AwardType) => {
    if (!selectedDate) return

    setIsLoading(awardType)
    try {
      // Remove old award and create new one with updated date
      await removeAwardAction(projectId, awardType)
      const awardedAt = new Date(selectedDate).toISOString()
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

  const DatePickerPopover = ({ awardType }: { awardType: AwardType }) => {
    const isEditing = hasAward(awardType)

    return (
      <Popover
        isOpen={showDatePicker === awardType}
        onOpenChange={(open) => !open && cancelDatePicker()}
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
              <label className="text-xs text-gray-600">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="light"
                onPress={cancelDatePicker}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                color="primary"
                onPress={() =>
                  isEditing
                    ? handleDateUpdate(awardType)
                    : handleDateSubmit(awardType)
                }
                isDisabled={!selectedDate || isLoading === awardType}
                isLoading={isLoading === awardType}
              >
                {isEditing ? "Update" : "Give Award"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="flex flex-col gap-2">
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

              <DatePickerPopover awardType={awardType} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
