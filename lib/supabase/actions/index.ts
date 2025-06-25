import "server-only"

import { createAdminClient } from "../server"

export async function upsertUser(data: any, isUpdate: boolean = false) {
  const supabaseServerClient = await createAdminClient()
  const fullName = `${data.first_name} ${data.last_name}`
  const emails = data.email_addresses
  const primaryEmailId = data.primary_email_address_id
  const primaryEmail = emails.find((email: any) => email.id === primaryEmailId)
  const publicMetadata = data.public_metadata
  const isUnclaimed = publicMetadata.is_unclaimed

  const userData = isUpdate
    ? {
        user_id: data.id,
        username: data.username,
        email: primaryEmail.email_address,
        public_metadata: publicMetadata,
        is_unclaimed: isUnclaimed,
      }
    : {
        user_id: data.id,
        username: data.username,
        display_name: fullName,
        avatar_url: isUnclaimed ? publicMetadata.avatar_url : data.image_url,
        email: primaryEmail.email_address,
        public_metadata: publicMetadata,
        is_unclaimed: isUnclaimed,
      }

  const { error } = await supabaseServerClient
    .from("profile")
    .upsert(userData, {
      onConflict: "user_id",
    })
  if (error) throw error
  console.log(`User inserted/updated: ${data.id}`)
}

export async function deleteUser(id: string) {
  const supabaseServerClient = await createAdminClient()
  const { error } = await supabaseServerClient
    .from("profile")
    .delete()
    .eq("user_id", id)
  if (error) throw error
  console.log(`User deleted: ${id}`)
}

// Follow functions
export async function followUser(userId: string, followingId: string) {
  const supabaseServerClient = await createAdminClient()

  const { error } = await supabaseServerClient.from("follows").insert({
    user_id: userId,
    following_id: followingId,
  })

  if (error) throw error
  return { success: true }
}

export async function unfollowUser(userId: string, followingId: string) {
  const supabaseServerClient = await createAdminClient()

  const { error } = await supabaseServerClient
    .from("follows")
    .delete()
    .eq("user_id", userId)
    .eq("following_id", followingId)

  if (error) throw error
  return { success: true }
}

export async function getFollowStatus(userId: string, targetUserId: string) {
  const supabaseServerClient = await createAdminClient()

  const { data, error } = await supabaseServerClient
    .from("follows")
    .select("*")
    .eq("user_id", userId)
    .eq("following_id", targetUserId)
    .single()

  if (error && error.code !== "PGRST116") {
    throw error
  }

  return { isFollowing: !!data }
}

export async function getFollowCounts(userId: string) {
  const supabaseServerClient = await createAdminClient()

  // Get followers count
  const { count: followersCount, error: followersError } =
    await supabaseServerClient
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId)

  if (followersError) throw followersError

  // Get following count
  const { count: followingCount, error: followingError } =
    await supabaseServerClient
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

  if (followingError) throw followingError

  return {
    followers: followersCount || 0,
    following: followingCount || 0,
  }
}

// Award functions
export async function createAward(
  projectId: string,
  awardType: "otd" | "otm" | "oty" | "honorable",
  awardedAt?: string
) {
  const supabaseServerClient = await createAdminClient()

  const { data, error } = await supabaseServerClient
    .from("award")
    .insert({
      project_id: projectId,
      award_type: awardType,
      awarded_at: awardedAt || new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeAward(
  projectId: string,
  awardType: "otd" | "otm" | "oty" | "honorable"
) {
  const supabaseServerClient = await createAdminClient()

  const { error } = await supabaseServerClient
    .from("award")
    .delete()
    .eq("project_id", projectId)
    .eq("award_type", awardType)

  if (error) throw error
  return { success: true }
}

export async function getProjectAwards(projectId: string) {
  const supabaseServerClient = await createAdminClient()

  const { data, error } = await supabaseServerClient
    .from("award")
    .select("*")
    .eq("project_id", projectId)

  if (error) throw error
  return data || []
}

export async function getAllProjectsWithAwards() {
  const supabaseServerClient = await createAdminClient()

  const { data, error } = await supabaseServerClient
    .from("project")
    .select(
      `
      *,
      user:user_id(username, avatar_url, display_name),
      award(award_type, awarded_at, created_at)
    `
    )
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getTodaysSiteOfTheDay() {
  const supabaseServerClient = await createAdminClient()

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]
  const startOfDay = `${today}T00:00:00.000Z`
  const endOfDay = `${today}T23:59:59.999Z`

  const { data, error } = await supabaseServerClient
    .from("project")
    .select(
      `
      *,
      user:user_id(username, avatar_url, display_name),
      award!inner(award_type, awarded_at, created_at)
    `
    )
    .eq("award.award_type", "otd")
    .gte("award.awarded_at", startOfDay)
    .lte("award.awarded_at", endOfDay)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No site of the day for today
      return null
    }
    throw error
  }

  return data
}
