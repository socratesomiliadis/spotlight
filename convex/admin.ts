import bcrypt from "bcryptjs"
import { v } from "convex/values"

import { components } from "./_generated/api"
import { mutation } from "./_generated/server"
import { authComponent, createAuth } from "./betterAuth/auth"
import {
  authUserId,
  getProfileByAuthUserId,
  hasAdminAccess,
  normalizeRole,
  nowIso,
  requireAdmin,
  requireStaff,
} from "./lib"

const staffAssignableRoleValidator = v.union(
  v.literal("user"),
  v.literal("staff")
)

async function findAuthUserByField(ctx: any, field: string, value: string) {
  return ctx.runQuery(components.betterAuth.adapter.findOne, {
    model: "user",
    where: [{ field, operator: "eq", value }],
  })
}

async function findAuthUserForProfile(ctx: any, profile: any) {
  return (
    (await findAuthUserByField(ctx, "_id", profile.authUserId)) ||
    (await findAuthUserByField(ctx, "clerkUserId", profile.authUserId)) ||
    (await findAuthUserByField(ctx, "email", profile.email))
  )
}

async function createCredentialAuthUser(
  ctx: any,
  args: {
    email: string
    password: string
    name: string
    username: string
    image?: string
  }
) {
  const email = args.email.toLowerCase()
  const existing = await findAuthUserByField(ctx, "email", email)
  if (existing) {
    throw new Error("User already exists")
  }

  const now = Date.now()
  const createdUser = await ctx.runMutation(
    components.betterAuth.adapter.create,
    {
      input: {
        model: "user",
        data: {
          name: args.name,
          email,
          emailVerified: false,
          image: args.image,
          createdAt: now,
          updatedAt: now,
          role: "user",
          username: args.username,
          displayUsername: args.username,
        },
      },
    }
  )
  const userId = betterAuthUserId(createdUser)

  await ctx.runMutation(components.betterAuth.adapter.create, {
    input: {
      model: "account",
      data: {
        accountId: userId,
        providerId: "credential",
        userId,
        password: await bcrypt.hash(args.password, 10),
        createdAt: now,
        updatedAt: now,
      },
    },
  })

  return { ...createdUser, id: userId, email }
}

function betterAuthUserId(user: any) {
  return String(user.id ?? user._id)
}

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
    const user = await createCredentialAuthUser(ctx, {
      email: args.email,
      password: args.password,
      name: `${args.firstName} ${args.lastName}`.trim() || args.username,
      username: args.username,
      image: args.avatarUrl,
    })
    const now = nowIso()
    await ctx.db.insert("profiles", {
      authUserId: user.id,
      email: user.email,
      username: args.username,
      displayName: `${args.firstName} ${args.lastName}`.trim() || args.username,
      businessType: "",
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

export const setUserRole = mutation({
  args: {
    authUserId: v.string(),
    role: staffAssignableRoleValidator,
  },
  handler: async (ctx, args) => {
    const { authUser: actorAuthUser } = await requireAdmin(ctx)
    const targetProfile = await getProfileByAuthUserId(ctx, args.authUserId)

    if (!targetProfile) {
      throw new Error("Target profile not found")
    }

    const targetAuthUser = await findAuthUserForProfile(ctx, targetProfile)
    if (!targetAuthUser) {
      throw new Error("Target auth user not found")
    }

    const actorId = authUserId(actorAuthUser)
    const targetBetterAuthUserId = betterAuthUserId(targetAuthUser)

    if (targetBetterAuthUserId === betterAuthUserId(actorAuthUser)) {
      throw new Error("Admins cannot change their own role here")
    }

    if (hasAdminAccess((targetAuthUser as any).role)) {
      throw new Error("Admin roles must be managed out of band")
    }

    const previousRole = normalizeRole((targetAuthUser as any).role)
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx)

    await (auth.api as any).setRole({
      body: {
        userId: targetBetterAuthUserId,
        role: args.role,
      },
      headers,
    } as any)

    const now = nowIso()
    await ctx.db.patch(targetProfile._id, {
      updatedAt: now,
    })
    await ctx.db.insert("roleAuditEvents", {
      actorAuthUserId: actorId,
      targetAuthUserId: targetProfile.authUserId,
      targetBetterAuthUserId,
      previousRole,
      newRole: args.role,
      createdAt: now,
    })

    return {
      authUserId: targetProfile.authUserId,
      betterAuthUserId: targetBetterAuthUserId,
      previousRole,
      role: args.role,
    }
  },
})
