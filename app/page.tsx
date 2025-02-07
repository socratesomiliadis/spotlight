import HomeHero from "@/components/Home/home-hero";

export default function Home() {
  return (
    <main className="w-screen px-[15vw] py-20">
      <div className="w-full min-h-screen rounded-3xl border-[1px] border-[##EAEAEA] flex flex-col">
        <HomeHero />
      </div>
    </main>
  );
}
