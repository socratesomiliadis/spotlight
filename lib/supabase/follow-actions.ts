"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

import { followUser, getFollowStatus, unfollowUser } from "./actions"

export async function toggleFollowAction(targetUserId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  if (userId === targetUserId) {
    throw new Error("Cannot follow yourself")
  }

  try {
    // Check current follow status
    const { isFollowing } = await getFollowStatus(userId, targetUserId)

    if (isFollowing) {
      await unfollowUser(userId, targetUserId)
    } else {
      await followUser(userId, targetUserId)
    }

    // Revalidate the profile page to reflect changes
    revalidatePath("/[username]", "page")

    return { success: true, isFollowing: !isFollowing }
  } catch (error) {
    console.error("Follow action error:", error)
    throw new Error("Failed to update follow status")
  }
}

export async function getFollowStatusAction(targetUserId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { isFollowing: false }
  }

  if (userId === targetUserId) {
    return { isFollowing: false }
  }

  try {
    const { isFollowing } = await getFollowStatus(userId, targetUserId)
    return { isFollowing }
  } catch (error) {
    console.error("Get follow status error:", error)
    return { isFollowing: false }
  }
}
