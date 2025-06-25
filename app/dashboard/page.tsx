import Image from "next/image"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string

  if (!user || userRole !== "staff") {
    redirect("/")
  }

  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("project")
    .select("*, user:user_id(username, avatar_url, display_name), sotdtemp(*)")
    .order("created_at", { ascending: false })

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full p-6 rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-col divide-y divide-[#EAEAEA] w-full mt-12">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="flex flex-row items-center justify-between gap-4 py-6"
            >
              <div className="flex flex-row gap-4 items-center">
                <Image
                  src={project.main_img_url}
                  alt={project.title}
                  width={720}
                  height={405}
                  className="rounded-xl w-44 aspect-video"
                />
                <h2 className="text-2xl font-medium tracking-tight">
                  {project.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
