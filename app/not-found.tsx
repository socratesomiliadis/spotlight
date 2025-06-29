import PageWrapper from "@/components/page-wrapper"

export default function NotFound() {
  return (
    <div className="h-[100svh] w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold flex flex-col items-center">
          <span className="tracking-tight font-semibold">
            This page does not exist
          </span>
          <span className="text-[20vw] leading-none tracking-tight">404</span>
        </h1>
      </div>
    </div>
  )
}
