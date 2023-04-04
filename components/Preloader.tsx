import { usePreloader } from '@/hooks/usePreloader';

export default function Preloader() {
  const { setIsPreloading, setIsInApp } = usePreloader();
  return (
    <video
      onPlay={() => {
        const html = document.querySelector('html') as HTMLElement;
        html.classList?.add('loading');
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
