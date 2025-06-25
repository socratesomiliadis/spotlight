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

  return user
}
