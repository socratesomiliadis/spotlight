"use server"

import { revalidatePath } from "next/cache"
import { Tables } from "@/database.types"
import { auth, currentUser } from "@clerk/nextjs/server"

import { createAdminClient, createClient } from "../server"
import { createAward, getAllProjectsWithAwards, removeAward } from "./index"

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
    .select("*, profile(avatar_url, display_name, username), award(*)")
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

export async function updateProject(
  projectId: string,
  updates: Partial<Tables<"project">>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("project")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single()

  if (error) {
    console.log(error)
    throw error
  }

  revalidatePath(`/projects/${data.slug}`)
  return data
}

export async function updateProjectAdmin(
  projectId: string,
  updates: Partial<Tables<"project">>
) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("project")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single()

  if (error) {
    console.log(error)
    throw error
  }

  revalidatePath(`/projects/${data.slug}`)
  return data
}

// Award actions for staff
export async function giveAward(
  projectId: string,
  awardType: "otd" | "otm" | "oty" | "honorable",
  awardedAt?: string
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Get user role from Clerk
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string

  if (userRole !== "staff") {
    throw new Error("Only staff can give awards")
  }

  try {
    const award = await createAward(projectId, awardType, awardedAt)
    revalidatePath("/dashboard")
    return award
  } catch (error) {
    console.error("Award creation error:", error)
    throw new Error("Failed to create award")
  }
}

export async function removeAwardAction(
  projectId: string,
  awardType: "otd" | "otm" | "oty" | "honorable"
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Get user role from Clerk
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string

  if (userRole !== "staff") {
    throw new Error("Only staff can remove awards")
  }

  try {
    const result = await removeAward(projectId, awardType)
    revalidatePath("/dashboard")
    return result
  } catch (error) {
    console.error("Award removal error:", error)
    throw new Error("Failed to remove award")
  }
}

export async function getProjectsWithAwards() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Get user role from Clerk
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string

  if (userRole !== "staff") {
    throw new Error("Only staff can access this data")
  }

  try {
    return await getAllProjectsWithAwards()
  } catch (error) {
    console.error("Get projects with awards error:", error)
    throw new Error("Failed to fetch projects with awards")
  }
}
