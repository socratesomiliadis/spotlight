import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import ProfileHeader from "@/app/[username]/components/ProfileHeader";
import ProfileNavigation from "@/app/[username]/components/ProfileNavigation";
import ProjectsGrid from "@/app/[username]/components/ProjectsGrid";
import { getFollowStatusAction } from "@/lib/supabase/follow-actions";
import PreviewCursor from "@/components/Home/preview-cursor";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const { userId } = await auth();

  // Get user by username
  let user;
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*,socials(*),project(*)")
      .eq("username", username)
      .eq("project.is_staff_project", false)
      .single();

    if (error) {
      console.log(error);
      notFound();
    }

    user = data;
  } catch (error) {
    notFound();
  }

  if (!user) {
    notFound();
  }

  const isOwnProfile = userId === user.user_id;

  // Get initial follow status
  const { isFollowing } = await getFollowStatusAction(user.user_id);

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full pb-11 rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          initialFollowStatus={isFollowing}
        />

        {/* Content Section */}
        <div
          className={cn(
            "w-full",
            (!!user.website_url || !!user.location) && "mt-5"
          )}
        >
          <ProfileNavigation socialLinks={user.socials || undefined} />
          <ProjectsGrid projects={user.project || undefined} />
        </div>
      </div>
      <PreviewCursor />
    </main>
  );
}
