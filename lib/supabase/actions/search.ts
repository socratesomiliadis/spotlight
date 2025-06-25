"use server"

import { createAdminClient } from "@/lib/supabase/server"

// Search functions
export async function searchUsers(query: string, limit: number = 10) {
  const supabaseServerClient = await createAdminClient()

  const { data, error } = await supabaseServerClient
    .from("profile")
    .select("user_id, username, display_name, avatar_url")
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function searchProjects(query: string, limit: number = 10) {
  const supabaseServerClient = await createAdminClient()

  const { data, error } = await supabaseServerClient
    .from("project")
    .select(
      `
        id,
        title,
        slug,
        created_at,
        main_img_url,
        profile:user_id (
          username,
          display_name,
          avatar_url
        )
      `
    )
    .ilike("title", `%${query}%`)
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function searchAll(query: string) {
  const [users, projects] = await Promise.all([
    searchUsers(query, 5),
    searchProjects(query, 5),
  ])

  return {
    users,
    projects,
  }
}

export async function handleSearch(query: string) {
  if (!query || query.trim().length < 2) {
    return {
      users: [],
      projects: [],
    }
  }

  try {
    const results = await searchAll(query.trim())
    return results
  } catch (error) {
    console.error("Search error:", error)
    return {
      users: [],
      projects: [],
    }
  }
}
