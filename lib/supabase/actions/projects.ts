"use server"

import { Tables } from "@/database.types"

import { createClient } from "../server"

export async function getProjects(username: string) {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .eq("username", username)

  if (error) {
    console.log(error)
    throw error
  }
  return projects
}

export async function getProject(id: string) {
  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from("project")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.log(error)
    throw error
  }
  return project
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from("project")
    .select("*, profile(avatar_url, display_name, username)")
    .eq("slug", slug)
    .single()

  if (error) {
    console.log(error)
    throw error
  }
  return project
}

export async function createProject(project: Tables<"project">) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("project")
    .insert(project)
    .select()
    .single()

  if (error) {
    console.log(error)
    throw error
  }
  return data
}
