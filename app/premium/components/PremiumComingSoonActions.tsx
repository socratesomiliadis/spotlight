"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import CustomButton from "@/components/custom-button"

function ComingSoonButton({
  text,
  className,
}: {
  text: string
  className: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-disabled="true"
          className="inline-flex cursor-not-allowed"
          tabIndex={0}
        >
          <CustomButton text={text} className={className} disabled />
        </span>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white">
        Coming soon
      </TooltipContent>
    </Tooltip>
  )
}

export function PremiumComingSoonActions() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="lg:absolute bottom-10 flex flex-row items-center gap-2 mt-8 lg:mt-0">
        <ComingSoonButton text="Benefits" className="text-[#1e1e1e] bg-white" />
        <ComingSoonButton
          text="Subscribe"
          className="text-[#1e1e1e] bg-[#FF98FB]"
        />
      </div>
    </TooltipProvider>
  )
}
