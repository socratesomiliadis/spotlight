import "server-only";
import { createAdminClient } from "./server";

export async function upsertUser(data: any, isUpdate: boolean = false) {
  const supabaseServerClient = await createAdminClient();
  const fullName = `${data.first_name} ${data.last_name}`;
  const emails = data.email_addresses;
  const primaryEmailId = data.primary_email_address_id;
  const primaryEmail = emails.find((email: any) => email.id === primaryEmailId);

  const userData = isUpdate
    ? {
        user_id: data.id,
        username: data.username,
        email: primaryEmail.email_address,
      }
    : {
        user_id: data.id,
        username: data.username,
        display_name: fullName,
        avatar_url: data.image_url,
        email: primaryEmail.email_address,
      };

  const { error } = await supabaseServerClient
    .from("profile")
    .upsert(userData, {
      onConflict: "user_id",
    });
  if (error) throw error;
  console.log(`User inserted/updated: ${data.id}`);
}

export async function deleteUser(id: string) {
  const supabaseServerClient = await createAdminClient();
  const { error } = await supabaseServerClient
    .from("profile")
    .delete()
    .eq("user_id", id);
  if (error) throw error;
  console.log(`User deleted: ${id}`);
}

// Follow functions
export async function followUser(userId: string, followingId: string) {
  const supabaseServerClient = await createAdminClient();

  const { error } = await supabaseServerClient.from("follows").insert({
    user_id: userId,
    following_id: followingId,
  });

  if (error) throw error;
  return { success: true };
}

export async function unfollowUser(userId: string, followingId: string) {
  const supabaseServerClient = await createAdminClient();

  const { error } = await supabaseServerClient
    .from("follows")
    .delete()
    .eq("user_id", userId)
    .eq("following_id", followingId);

  if (error) throw error;
  return { success: true };
}

export async function getFollowStatus(userId: string, targetUserId: string) {
  const supabaseServerClient = await createAdminClient();

  const { data, error } = await supabaseServerClient
    .from("follows")
    .select("*")
    .eq("user_id", userId)
    .eq("following_id", targetUserId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return { isFollowing: !!data };
}

export async function getFollowCounts(userId: string) {
  const supabaseServerClient = await createAdminClient();

  // Get followers count
  const { count: followersCount, error: followersError } =
    await supabaseServerClient
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId);

  if (followersError) throw followersError;

  // Get following count
  const { count: followingCount, error: followingError } =
    await supabaseServerClient
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

  if (followingError) throw followingError;

  return {
    followers: followersCount || 0,
    following: followingCount || 0,
  };
}

// Search functions
export async function searchUsers(query: string, limit: number = 10) {
  const supabaseServerClient = await createAdminClient();

  const { data, error } = await supabaseServerClient
    .from("profile")
    .select("user_id, username, display_name, avatar_url")
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function searchProjects(query: string, limit: number = 10) {
  const supabaseServerClient = await createAdminClient();

  const { data, error } = await supabaseServerClient
    .from("project")
    .select(
      `
      id,
      title,
      slug,
      thumbnail_url,
      created_at,
      is_staff_project,
      user_fake,
      profile:user_id (
        username,
        display_name,
        avatar_url
      )
    `
    )
    .ilike("title", `%${query}%`)
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function searchAll(query: string) {
  const [users, projects] = await Promise.all([
    searchUsers(query, 5),
    searchProjects(query, 5),
  ]);

  return {
    users,
    projects,
  };
}

// Project creation function
export async function createProject(projectData: {
  title: string;
  slug: string;
  tools_used: string[];
  main_img_url: string;
  thumbnail_url: string;
  banner_url?: string | null;
  elements_url?: string[] | null;
  user_id: string;
}) {
  const supabaseServerClient = await createAdminClient();

  const { data, error } = await supabaseServerClient
    .from("project")
    .insert(projectData)
    .select()
    .single();

  if (error) throw error;
  return data;
}
