"use client"

import Image from "next/image"
import Link from "next/link"

import { Project, User } from "./search"

interface SearchResultsProps {
  users: User[]
  projects: Project[]
  isVisible: boolean
  onResultClick: () => void
}

export default function SearchResults({
  users,
  projects,
  isVisible,
  onResultClick,
}: SearchResultsProps) {
  if (!isVisible) return null

  const hasResults = users.length > 0 || projects.length > 0

  return (
    <>
      {!hasResults ? (
        <div className="px-2 text-base text-[#ACACAC]">No results found</div>
      ) : (
        <div className="divide-y divide-white/5">
          {/* Users Section */}
          {users.length > 0 && (
            <div className="py-2">
              <h3 className="text-xs font-semibold text-[#ACACAC] uppercase tracking-wide mb-1 px-2">
                Users
              </h3>
              {users.map((user) => (
                <Link
                  key={user.user_id}
                  href={`/${user.username}`}
                  onClick={onResultClick}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 transition-colors"
                >
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.display_name || user.username}
                      width={64}
                      height={64}
                      className="rounded-full size-11 object-cover"
                    />
                  ) : (
                    <div className="rounded-full size-8 bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-300 text-sm font-medium">
                        {(user.display_name || user.username)
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 -mt-1">
                    <p className="text-base font-medium text-white truncate">
                      {user.display_name || user.username}
                    </p>
                    {user.display_name && (
                      <p className="text-sm text-[#989898] truncate -mt-1">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <div className="pt-4">
              <h3 className="text-xs font-semibold text-[#ACACAC] uppercase tracking-wide mb-1 px-2">
                Projects
              </h3>
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  onClick={onResultClick}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors"
                >
                  {project.main_img_url ? (
                    <Image
                      src={project.main_img_url}
                      alt={project.title}
                      width={256}
                      height={144}
                      className="rounded-lg aspect-video h-14 w-auto object-cover"
                    />
                  ) : (
                    <div className="rounded-full size-8 bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-300 text-sm font-medium">
                        {project.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-white truncate">
                      {project.title}
                    </p>
                    <p className="text-sm text-[#989898] truncate -mt-1">
                      By {project.profile?.display_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
