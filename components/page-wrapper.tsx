import { cn } from "@/lib/utils"

export default function PageWrapper({
  children,
  className,
  wrapperClassName,
}: {
  children: React.ReactNode
  className?: string
  wrapperClassName?: string
}) {
  return (
    <div className={cn("py-20 lg:py-28 w-fulll", wrapperClassName)}>
      <div
        className={cn(
          "w-full pb-8 rounded-3xl border-[1px] border-[#EAEAEA] overflow-hidden",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
