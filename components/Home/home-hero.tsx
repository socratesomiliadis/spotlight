import Image from "next/image";

export default function HomeHero() {
  return (
    <div className="w-full p-4">
      <Image
        src="/static/images/hero.png"
        width={1800}
        height={1100}
        quality={100}
        alt=""
        className="w-full h-auto object-cover rounded-2xl"
      />
    </div>
  );
}
