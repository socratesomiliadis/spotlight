import { mutation } from "./_generated/server"
import { v } from "convex/values"

import { createAuth, authComponent } from "./betterAuth/auth"
import { nowIso, requireStaff } from "./lib"

export const createUnclaimedUser = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    password: v.string(),
    username: v.string(),
    avatarUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx)
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
    const result = await (auth.api as any).createUser({
      body: {
        email: args.email,
        password: args.password,
        name: `${args.firstName} ${args.lastName}`.trim() || args.username,
        role: "user",
        data: {
          username: args.username,
          displayUsername: args.username,
        },
      },
      headers,
    } as any)
    const user = (result as any).user || result
    const now = nowIso()
    await ctx.db.insert("profiles", {
      authUserId: user.id,
      email: args.email,
      username: args.username,
      displayName: `${args.firstName} ${args.lastName}`.trim() || args.username,
      businessType: "",
      role: "user",
      isUnclaimed: true,
      publicMetadata: { is_unclaimed: true, avatar_url: args.avatarUrl },
      legacyAvatarUrl: args.avatarUrl,
      avatarStorageId: args.avatarStorageId,
      createdAt: now,
      updatedAt: now,
    })
    return {
      id: user.id,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      username: args.username,
      imageUrl: args.avatarUrl,
      publicMetadata: { is_unclaimed: true, avatar_url: args.avatarUrl },
    }
  },
})
