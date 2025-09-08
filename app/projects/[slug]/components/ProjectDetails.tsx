export default function ProjectElements({ tags }: { tags: string[] }) {
  return (
    <div className="w-full flex flex-col px-4 lg:px-8 tracking-tight mt-12">
      <span className="text-black text-xl">Details</span>
      <p className="text-[#ACACAC] text-xl">Technologies and tools used</p>
      <div className="w-full h-px bg-[#EAEAEA] my-6"></div>
      <div className="flex flex-row flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-2 bg-[#f6f6f6] text-[#989898] px-8 py-2 rounded-lg"
          >
            <span>{tag}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
