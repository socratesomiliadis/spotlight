interface ProjectCardProps {
  variant: "team" | "preview";
  className?: string;
}

export default function ProjectCard({
  variant,
  className = "",
}: ProjectCardProps) {
  if (variant === "team") {
    return (
      <div className={`group cursor-pointer ${className}`}>
        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-green-900">
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              </div>
              <h3 className="text-xl font-light mb-1">
                Meet our team of designers,
              </h3>
              <h4 className="text-lg font-light text-gray-300">
                and researchers.
              </h4>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>
    );
  }

  if (variant === "preview") {
    return (
      <div className={`group cursor-pointer ${className}`}>
        <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,white_49%,white_51%,transparent_55%)]"></div>
            </div>
            <div className="absolute top-6 left-6 text-white">
              <div className="text-sm text-gray-300 mb-2">Preview</div>
              <h3 className="text-2xl font-light mb-1">Neue Mtl</h3>
              <h4 className="text-lg font-light">(*Aa→e) v2.0</h4>
              <div className="text-3xl font-bold mt-2">New!</div>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <div className="text-sm">Neue Mtl 2.0!</div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>
    );
  }

  return null;
}
