import ErrorBallpit from "@/components/error-ballpit"
import PageWrapper from "@/components/page-wrapper"

export default function NotFound() {
  return (
    <PageWrapper
      wrapperClassName="h-svh py-20 overflow-hidden lg:py-0 flex items-center justify-center"
      className="w-full h-full lg:h-fit flex items-center justify-center pb-0 lg:-mt-16 relative aspect-video"
    >
      <div className="absolute max-w-full text-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
        <p className="text-base lg:text-2xl tracking-tighter">
          Oops! The page you&apos;re looking for has vanished.
        </p>
        <h1 className="text-[10rem] lg:text-[28rem] font-[800] tracking-tight mix-blend-difference text-black leading-[0.9]">
          404
        </h1>
      </div>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100%",
          maxHeight: "100%",
          width: "100%",
        }}
        className="z-20"
      >
        <ErrorBallpit />
      </div>
    </PageWrapper>
  )
}
