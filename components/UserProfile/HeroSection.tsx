export default function HeroSection({ bannerUrl }: { bannerUrl: string }) {
  return (
    <section className="hero-section-profile w-full flex flex-col items-start">
      <div
        style={{
          backgroundImage: `url(${
            bannerUrl ? bannerUrl : "/static/images/defaultBanner.png"
          })`,
        }}
        className="banner w-full aspect-[1920/300] h-auto bg-cover bg-center bg-no-repeat"
      ></div>
    </section>
  );
}
