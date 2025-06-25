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
