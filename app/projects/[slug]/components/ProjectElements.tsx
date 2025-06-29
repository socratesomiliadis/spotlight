import Image from "next/image"

export default function ProjectElements({
  elementURLs,
}: {
  elementURLs: string[]
}) {
  return (
    <div className="w-full flex flex-col px-4 lg:px-8 tracking-tight mt-8 lg:mt-12">
      <span className="text-black text-xl">Elements</span>
      <p className="text-[#ACACAC] text-xl">
        See the highlights of this website
      </p>
      <div className="w-full h-[1px] bg-[#EAEAEA] my-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {elementURLs.map((url, index) => (
          <Image
            src={url}
            key={index}
            alt="Element"
            width={1920}
            height={1080}
            className="w-full h-auto aspect-video object-cover rounded-2xl lg:rounded-3xl"
          />
        ))}
      </div>
    </div>
  )
}
