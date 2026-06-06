function nowIso() {
  return new Date().toISOString()
}

function authUserId(user: any) {
  return String(user.clerkUserId ?? user.id ?? user._id)
}

function usernameFromEmail(email: string) {
  return email.split("@")[0].replace(/[^a-zA-Z0-9_.]/g, "")
}

export async function ensureProfileForAuthUser(
  ctx: any,
  authUser: any,
  args: {
    username?: string
    displayName?: string
  } = {}
) {
  const userId = authUserId(authUser)
  const existing = await ctx.db
    .query("profiles")
    .withIndex("by_auth_user_id", (q: any) => q.eq("authUserId", userId))
    .first()
  const now = nowIso()
  const email =
    typeof authUser.email === "string" && authUser.email
      ? authUser.email
      : existing?.email || `${userId}@users.spotlight.local`
  const username =
    args.username ||
    existing?.username ||
    (authUser as any).username ||
    usernameFromEmail(email) ||
    `user-${userId.slice(-8)}`
  const displayName =
    args.displayName || existing?.displayName || authUser.name || username
  const image =
    typeof authUser.image === "string" && authUser.image
      ? authUser.image
      : undefined

  if (existing) {
    await ctx.db.patch(existing._id, {
      email,
      username,
      displayName,
      updatedAt: now,
    })
    return {
      id: existing._id,
      authUserId: userId,
      username,
      isUnclaimed: existing.isUnclaimed,
    }
  }

  const id = await ctx.db.insert("profiles", {
    authUserId: userId,
    email,
    username,
    displayName,
    businessType: "",
    isUnclaimed: false,
    legacyAvatarUrl: image,
    createdAt: now,
    updatedAt: now,
  })

  return {
    id,
    authUserId: userId,
    username,
    isUnclaimed: false,
  }
}
