import { v } from "convex/values"

import { mutation, query } from "./_generated/server"
import {
  authUserId,
  nowIso,
  projectView,
  requireAuthUser,
  requireStaff,
  slugify,
} from "./lib"
import { awardValidator, categoryValidator } from "./schema"

async function listProjectViews(
  ctx: any,
  args: {
    category?: "websites" | "design" | "films" | "crypto" | "startups" | "ai"
    tags?: string[]
    award?: "otd" | "otm" | "oty" | "honorable"
    limit?: number
  }
) {
  const limit = args.limit ?? 100
  const hasInMemoryFilters = !!args.tags?.length || !!args.award
  const projectsQuery = args.category
    ? ctx.db
        .query("projects")
        .withIndex("by_category_created", (q: any) =>
          q.eq("category", args.category!)
        )
        .order("desc")
    : ctx.db.query("projects").withIndex("by_created").order("desc")

  if (!hasInMemoryFilters) {
    const projects = await projectsQuery.take(limit)
    return Promise.all(
      projects.map((project: any) => projectView(ctx, project))
    )
  }

  let projects = await projectsQuery.collect()

  if (args.tags?.length) {
    const selected = new Set(args.tags)
    projects = projects.filter((project: any) =>
      project.tags.some((tag: string) => selected.has(tag))
    )
  }

  if (args.award) {
    const awardedProjectIds = new Set(
      (
        await ctx.db
          .query("awards")
          .withIndex("by_type_date", (q: any) => q.eq("awardType", args.award!))
          .collect()
      ).map((award: any) => award.projectId)
    )
    projects = projects.filter((project: any) =>
      awardedProjectIds.has(project._id)
    )
  }

  return Promise.all(
    projects.slice(0, limit).map((project: any) => projectView(ctx, project))
  )
}

async function getTodaysOfTheDayByCategoryView(
  ctx: any,
  category: "websites" | "design" | "films" | "crypto" | "startups" | "ai"
) {
  async function findForCategory(
    category: "websites" | "design" | "films" | "crypto" | "startups" | "ai"
  ) {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_category_created", (q: any) => q.eq("category", category))
      .collect()
    const projectIds = new Set(projects.map((project: any) => project._id))
    const awards = (
      await ctx.db
        .query("awards")
        .withIndex("by_type_date", (q: any) => q.eq("awardType", "otd"))
        .collect()
    )
      .filter((award: any) => projectIds.has(award.projectId))
      .sort((a: any, b: any) => b.awardedAt.localeCompare(a.awardedAt))
    const award = awards[0]
    if (!award) return null
    const project = await ctx.db.get(award.projectId)
    return project ? projectView(ctx, project) : null
  }

  return (
    (await findForCategory(category)) ||
    (category !== "websites" ? await findForCategory("websites") : null)
  )
}

export const list = query({
  args: {
    category: v.optional(categoryValidator),
    tags: v.optional(v.array(v.string())),
    award: v.optional(awardValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return listProjectViews(ctx, args)
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
    return project ? projectView(ctx, project) : null
  },
})

export const getTodaysOfTheDayByCategory = query({
  args: { category: categoryValidator },
  handler: async (ctx, args) => {
    return getTodaysOfTheDayByCategoryView(ctx, args.category)
  },
})

export const getHomePage = query({
  args: {
    category: v.optional(categoryValidator),
    tags: v.optional(v.array(v.string())),
    award: v.optional(awardValidator),
  },
  handler: async (ctx, args) => {
    const categoryForHero = args.category || "websites"
    const [featuredProject, projects] = await Promise.all([
      getTodaysOfTheDayByCategoryView(ctx, categoryForHero),
      listProjectViews(ctx, args),
    ])

    return { featuredProject, projects }
  },
})

export const getPageBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
    if (!project) return null

    const authUser = await requireAuthUser(ctx).catch(() => null)
    const viewerAuthUserId = authUser ? authUserId(authUser) : null
    const viewerProfile = viewerAuthUserId
      ? await ctx.db
          .query("profiles")
          .withIndex("by_auth_user_id", (q) =>
            q.eq("authUserId", viewerAuthUserId)
          )
          .first()
      : null
    const canEdit =
      viewerAuthUserId === project.ownerAuthUserId ||
      viewerProfile?.role === "staff" ||
      viewerProfile?.role === "admin"

    return {
      project: await projectView(ctx, project),
      canEdit,
    }
  },
})

export const create = mutation({
  args: {
    ownerAuthUserId: v.optional(v.string()),
    title: v.string(),
    category: categoryValidator,
    tags: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    mainImageStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    previewStorageId: v.optional(v.id("_storage")),
    elementStorageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAuthUser(ctx)
    const userId = authUserId(authUser)
    const ownerAuthUserId = args.ownerAuthUserId || userId

    if (ownerAuthUserId !== userId) {
      await requireStaff(ctx)
    }

    const now = nowIso()
    const baseSlug = slugify(args.title)
    let slug = baseSlug
    let suffix = 1
    while (
      await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first()
    ) {
      suffix += 1
      slug = `${baseSlug}-${suffix}`
    }

    const id = await ctx.db.insert("projects", {
      ownerAuthUserId,
      title: args.title,
      category: args.category,
      tags: args.tags,
      liveUrl: args.liveUrl,
      slug,
      mainImageStorageId: args.mainImageStorageId,
      bannerStorageId: args.bannerStorageId,
      previewStorageId: args.previewStorageId,
      elementStorageIds: args.elementStorageIds || [],
      createdAt: now,
      updatedAt: now,
    })

    const project = await ctx.db.get(id)
    return projectView(ctx, project!)
  },
})

export const update = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    category: categoryValidator,
    tags: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    mainImageStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    bannerStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    previewStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    elementStorageIds: v.optional(v.union(v.array(v.id("_storage")), v.null())),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAuthUser(ctx)
    const userId = authUserId(authUser)
    const project = await ctx.db.get(args.projectId)
    if (!project) throw new Error("Project not found")

    if (project.ownerAuthUserId !== userId) {
      await requireStaff(ctx)
    }

    const updates: any = {
      title: args.title,
      category: args.category,
      tags: args.tags,
      liveUrl: args.liveUrl,
      slug: slugify(args.title),
      updatedAt: nowIso(),
    }

    if ("mainImageStorageId" in args) {
      updates.mainImageStorageId =
        args.mainImageStorageId === null ? undefined : args.mainImageStorageId
      if (args.mainImageStorageId === null) updates.legacyMainImgUrl = undefined
    }

    if ("bannerStorageId" in args) {
      updates.bannerStorageId =
        args.bannerStorageId === null ? undefined : args.bannerStorageId
      if (args.bannerStorageId === null) updates.legacyBannerUrl = undefined
    }

    if ("previewStorageId" in args) {
      updates.previewStorageId =
        args.previewStorageId === null ? undefined : args.previewStorageId
      if (args.previewStorageId === null) updates.legacyPreviewUrl = undefined
    }

    if ("elementStorageIds" in args) {
      updates.elementStorageIds =
        args.elementStorageIds === null ? [] : args.elementStorageIds
      if (args.elementStorageIds === null) updates.legacyElementsUrl = undefined
    }

    await ctx.db.patch(project._id, updates)

    return projectView(ctx, (await ctx.db.get(project._id))!)
  },
})

export const listWithAwardsForStaff = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx)
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_created")
      .collect()
    return Promise.all(
      projects
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((project) => projectView(ctx, project))
    )
  },
})
