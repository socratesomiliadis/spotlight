import Image from 'next/image';
import FeaturedAward from './FeaturedAward';

export default function HeroSection() {
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
      <Image
        src="/static/images/heroBg.png"
        width={1920}
        height={1080}
        className="absolute w-full h-full inset-0 object-cover"
        alt="Spotlight Hero background"
      />
    </section>
  );
}
