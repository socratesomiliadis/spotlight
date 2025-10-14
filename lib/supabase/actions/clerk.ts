"use server"

import { createClerkClient } from "@clerk/backend"

export async function createUser(userData: {
  email: string
  first_name: string
  last_name: string
  password: string
  username: string
  avatar_url: string
}) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  })

  const user = await clerkClient.users.createUser({
    emailAddress: [userData.email],
    firstName: userData.first_name,
    lastName: userData.last_name,
    password: userData.password,
    username: userData.username,
    publicMetadata: {
      is_unclaimed: true,
      avatar_url: userData.avatar_url,
    },
  })

  // Return a plain object instead of the Clerk User instance
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    imageUrl: user.imageUrl,
    publicMetadata: user.publicMetadata,
  }
}

export async function initiateAccountClaim(email: string, username: string) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  })

  try {
    // Find the user by email
    const users = await clerkClient.users.getUserList({
      emailAddress: [email],
    })

    if (users.data.length === 0) {
      throw new Error("No account found with this email address")
    }

    const user = users.data[0]

    // Check if the account is unclaimed
    if (!user.publicMetadata?.is_unclaimed) {
      throw new Error("This account has already been claimed")
    }

    // Update metadata to track the claim attempt and add redirect info
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        claim_initiated: true,
        claim_initiated_at: new Date().toISOString(),
        claim_redirect_url: `/claim/${username}/success`,
      },
    })

    return {
      success: true,
      userId: user.id,
      username: user.username,
      email: email,
      message:
        "Please check your email and use the 'Forgot Password' link to complete claiming your account.",
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to initiate account claim")
  }
}

export async function completeAccountClaim(userId: string) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  })

  try {
    // Update the user's metadata to mark as claimed
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        is_unclaimed: false,
      },
    })

    return { success: true }
  } catch (error: any) {
    throw new Error(error.message || "Failed to complete account claim")
  }
}
