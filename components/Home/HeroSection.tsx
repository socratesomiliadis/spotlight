import FeaturedAward from './FeaturedAward';
import { useEffect } from 'react';
import { usePreloader } from '@/hooks/usePreloader';
import gsap from 'gsap';

export default function HeroSection() {
  const { isPreloading, setIsPreloading, setIsInApp } = usePreloader();

  useEffect(() => {
    if (!isPreloading) {
      const html = document.querySelector('html') as HTMLElement;
      const heroVid = document.querySelector('.hero-vid') as HTMLVideoElement;
      heroVid.play();
      html.classList?.remove('loading');
      gsap.to('.featured-award', {
        opacity: 1,
        duration: 0.4,
        ease: 'power4.out'
      });
    }
  }, [isPreloading]);

  return (
    <section className="hero-section bg-black w-screen h-screen">
      <FeaturedAward
        profileImg="/static/images/Locomotive.png"
        image="/static/images/lunarImg.png"
        userlink="/locomotive"
        username="Locomotive"
        awardText="Website of the Day"
        projectName="Lunar"
        projectLink="/project/lunar"
        date="March 2023"
      />
      <video
        src="/static/videos/heroLoop.mp4"
        className="hero-vid absolute w-full h-full inset-0 object-cover z-0"
        muted
        playsInline
        loop
      />
    </section>
  );
}
