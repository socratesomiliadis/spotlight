"use server"

import { createClient } from "../server"

export async function getProfile(username: string) {
  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("username", username)
    .single()

  if (error) {
    console.log(error)
    throw error
  }
  return profile
}

export async function getProfileFull(username: string) {
  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*,socials(*),project(*)")
    .eq("username", username)
    .single()

  if (error) {
    console.log(error)
    throw error
  }
  return profile
}

export async function getProfileAndSocials(username: string) {
  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*,socials(*)")
    .eq("username", username)
    .single()

  if (error) {
    console.log(error)
    throw error
  }
  return profile
}

export async function getUnclaimedUsers() {
  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from("profile")
    .select("user_id, username, avatar_url, display_name, is_unclaimed")
    .eq("is_unclaimed", true)

  if (error) {
    console.log(error)
    throw error
  }
  return profile
}

export async function claimAccount(userId: string) {
  const supabase = await createClient()

  try {
    // Update the profile to mark as claimed
    const { error } = await supabase
      .from("profile")
      .update({ is_unclaimed: false })
      .eq("user_id", userId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    throw new Error(error.message || "Failed to update profile claim status")
  }
}
