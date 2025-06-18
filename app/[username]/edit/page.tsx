import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditProfileForm from "./components/EditProfileForm";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function EditPage({ params }: PageProps) {
  const { username } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Get user by username with socials
  let user;
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*,socials(*)")
      .eq("username", username)
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

  // Only allow users to edit their own profile
  if (userId !== user.user_id) {
    redirect(`/${username}`);
  }

  return (
    <main className="w-screen px-[25vw] py-28">
      <div className="w-full rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <EditProfileForm userAndSocials={user} />
      </div>
    </main>
  );
}
