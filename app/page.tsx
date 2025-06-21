import HomeHero from "@/components/Home/home-hero";
import HomeNavigation from "@/components/Home/home-navigation";
import ProjectsGrid from "@/components/Home/projects-grid";
import PreviewCursor from "@/components/Home/preview-cursor";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("project")
    .select("*, user:user_id(username, avatar_url, display_name)")
    .order("created_at", { ascending: false });

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full pb-8 rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        {/* @ts-ignore */}
        <HomeHero project={projects?.[projects.length - 1]} />
        <HomeNavigation />
        <ProjectsGrid projects={projects} />
      </div>
      <PreviewCursor />
    </main>
  );
}
