import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import SplitType from 'split-type';
gsap.registerPlugin(ScrollTrigger);

export default function ExploreTextSection() {
  useEffect(() => {
    const splitChars = SplitType.create('.explore-text', {
      types: 'chars'
    }) as { chars: HTMLElement[] };

    let animTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.explore-text-section',
        start: 'center center',
        end: 'bottom center',
        pin: '.explore-text',
        scrub: true,
        markers: true
      }
    });
    animTl.fromTo(
      splitChars.chars,
      {
        y: '100%',
        opacity: 0
      },
      {
        duration: 0.35,
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
  }, []);
  return (
    <>
      <section className="explore-text-section h-screen">
        <span className="z-50 whitespace-nowrap text-[10vw] overflow-hidden explore-text text-black font-medium">
          Explore More Categories
        </span>
      </section>
      <div className="h-screen"></div>
    </>
  );
}
