import { usePreloader } from "@/hooks/usePreloader";
import { useLayoutEffect } from "react";

export default function Preloader() {
  const { setIsPreloading, setIsInApp, isPreloading } = usePreloader();

  useLayoutEffect(() => {
    if (isPreloading) {
      const html = document.querySelector("html") as HTMLElement;
      html.classList?.add("loading");
    } else {
      const html = document.querySelector("html") as HTMLElement;
      html.classList?.remove("loading");
    }
  }, [isPreloading]);

  return (
    <video
      onPlay={() => {
        // setIsInApp(true);
        // setIsPreloading(false);
      }}
      onEnded={() => {
        setIsInApp(true);
        setIsPreloading(false);
      }}
      src="/static/videos/SpotlightLoader.mp4"
      className="w-screen h-full fixed z-[9999] object-cover"
      muted
      autoPlay
      playsInline
    />
  );
}
