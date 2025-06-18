import Image from "next/image";

export default function ProjectElements({ tools }: { tools: string[] }) {
  return (
    <div className="w-full flex flex-col px-8 tracking-tight mt-12">
      <span className="text-black text-xl">Details</span>
      <p className="text-[#ACACAC] text-xl">Technologies and tools used</p>
      <div className="w-full h-[1px] bg-[#EAEAEA] my-6"></div>
      <div className="flex flex-row gap-2">
        {tools.map((tool, index) => (
          <span
            key={index}
            className="flex items-center gap-2 bg-[#f6f6f6] text-[#989898] px-8 py-2 rounded-lg"
          >
            <span>{tool}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
