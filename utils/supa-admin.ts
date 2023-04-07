import { createClient } from "@supabase/supabase-js";

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const upsertUserRecord = async (user: any) => {
  const userData = {
    id: user.id,
    username: user.username,
    avatar_url: user.profileImageUrl,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  const { error } = await supabaseAdmin.from("profile").upsert([userData]);
  if (error) throw error;
  console.log(`User inserted/updated: ${user.id}`);
};

export const deleteUserRecord = async (userId: any) => {
  const { error } = await supabaseAdmin
    .from("profile")
    .delete()
    .eq("id", userId);
  if (error) throw error;
  console.log(`User deleted: ${userId}`);
};
