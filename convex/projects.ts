import { v } from "convex/values"

import { mutation, query } from "./_generated/server"
import {
  authUserId,
  hasStaffAccess,
  nowIso,
  projectCardView,
  projectView,
  requireAuthUser,
  requireStaff,
  slugify,
  staffProjectRowView,
} from "./lib"
import { awardValidator, categoryValidator } from "./schema"

type Category = "websites" | "design" | "films" | "crypto" | "startups" | "ai"
type Award = "otd" | "otm" | "oty" | "honorable"

const NORMAL_USER_SUBMISSION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000

async function hasActivePremiumSubscription(
  ctx: any,
  userAuthUserId: string,
  now: string
) {
  const activeSubscriptions = await ctx.db
    .query("subscriptions")
    .withIndex("by_user_status", (q: any) =>
      q.eq("userAuthUserId", userAuthUserId).eq("status", "active")
    )
    .collect()

  return activeSubscriptions.some(
    (subscription: any) =>
      !subscription.currentPeriodEnd || subscription.currentPeriodEnd >= now
  )
}

async function assertNormalUserCanSubmitProject(
  ctx: any,
  ownerAuthUserId: string,
  now: string
) {
  const latestProject = await ctx.db
    .query("projects")
    .withIndex("by_owner_created", (q: any) =>
      q.eq("ownerAuthUserId", ownerAuthUserId)
    )
    .order("desc")
    .first()

  if (!latestProject) return

  const latestCreatedAt = new Date(latestProject.createdAt).getTime()
  const nowMs = new Date(now).getTime()
  if (Number.isNaN(latestCreatedAt) || Number.isNaN(nowMs)) return

  const nextAllowedAt = latestCreatedAt + NORMAL_USER_SUBMISSION_WINDOW_MS
  if (nextAllowedAt > nowMs) {
    const nextAllowedDate = new Date(nextAllowedAt).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    )
    throw new Error(
      `Free accounts can submit one project every 30 days. You can submit again on ${nextAllowedDate}.`
    )
  }
}

async function listProjectCardPage(
  ctx: any,
  args: {
    category?: Category
    tags?: string[]
    award?: Award
    limit?: number
    cursor?: string
  }
) {
  const limit = args.limit ?? 24
  const takeLimit = limit + 1
  let projects: any[] = []

  if (args.award) {
    const awards = await ctx.db
      .query("awards")
      .withIndex("by_type_date", (q: any) => q.eq("awardType", args.award!))
      .order("desc")
      .collect()
    const seenProjectIds = new Set()

    for (const award of awards) {
      const project = await ctx.db.get(award.projectId)
      if (!project || seenProjectIds.has(project._id)) continue
      seenProjectIds.add(project._id)
      projects.push(project)
    }
  } else {
    const hasInMemoryFilters = !!args.tags?.length
    const projectsQuery = args.category
      ? ctx.db
          .query("projects")
          .withIndex("by_category_created", (q: any) => {
            const categoryQuery = q.eq("category", args.category!)
            return args.cursor
              ? categoryQuery.lt("createdAt", args.cursor)
              : categoryQuery
          })
          .order("desc")
      : ctx.db
          .query("projects")
          .withIndex("by_created", (q: any) =>
            args.cursor ? q.lt("createdAt", args.cursor) : q
          )
          .order("desc")

    if (!hasInMemoryFilters) {
      const page = await projectsQuery.take(takeLimit)
      const hasMore = page.length > limit
      const items = hasMore ? page.slice(0, limit) : page

      return {
        projects: await Promise.all(
          items.map((project: any) => projectCardView(ctx, project))
        ),
        hasMore,
        nextCursor: hasMore ? items[items.length - 1]?.createdAt : null,
      }
    }

    projects = await projectsQuery.collect()
  }

  if (args.category && args.award) {
    projects = projects.filter((project) => project.category === args.category)
  }

  if (args.cursor) {
    projects = projects.filter((project) => project.createdAt < args.cursor!)
  }

  if (args.tags?.length) {
    const selected = new Set(args.tags)
    projects = projects.filter((project) =>
      project.tags.some((tag: string) => selected.has(tag))
    )
  }

  projects = projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const items = projects.slice(0, takeLimit)
  const hasMore = items.length > limit
  const page = hasMore ? items.slice(0, limit) : items

  return {
    projects: await Promise.all(
      page.map((project: any) => projectCardView(ctx, project))
    ),
    hasMore,
    nextCursor: hasMore ? page[page.length - 1]?.createdAt : null,
  }
}

async function listProjectViews(
  ctx: any,
  args: {
    category?: Category
    tags?: string[]
    award?: Award
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

async function getTodaysOfTheDayByCategoryView(ctx: any, category: Category) {
  async function findForCategory(category: Category) {
    const awards = await ctx.db
      .query("awards")
      .withIndex("by_type_date", (q: any) => q.eq("awardType", "otd"))
      .order("desc")
      .collect()

    for (const award of awards) {
      const project = await ctx.db.get(award.projectId)
      if (project?.category === category) {
        return projectCardView(ctx, project)
      }
    }

    return null
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

export const listCardPage = query({
  args: {
    category: v.optional(categoryValidator),
    tags: v.optional(v.array(v.string())),
    award: v.optional(awardValidator),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return listProjectCardPage(ctx, args)
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
    const [featuredProject, projectsPage] = await Promise.all([
      getTodaysOfTheDayByCategoryView(ctx, categoryForHero),
      listProjectCardPage(ctx, { ...args, limit: 12 }),
    ])

    return { featuredProject, ...projectsPage }
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
    const canEdit =
      viewerAuthUserId === project.ownerAuthUserId ||
      hasStaffAccess((authUser as any)?.role)

    return {
      project: await projectView(ctx, project),
      canEdit,
    }
  },
})

export const listSitemapEntries = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_created")
      .order("desc")
      .collect()

    return projects.map((project) => ({
      slug: project.slug,
      updatedAt: project.updatedAt,
      createdAt: project.createdAt,
    }))
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
    const now = nowIso()

    if (ownerAuthUserId !== userId) {
      await requireStaff(ctx)
    }

    const isStaffOrAdmin = hasStaffAccess((authUser as any).role)
    if (
      !isStaffOrAdmin &&
      !(await hasActivePremiumSubscription(ctx, userId, now))
    ) {
      await assertNormalUserCanSubmitProject(ctx, ownerAuthUserId, now)
    }

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
  args: {
    search: v.optional(v.string()),
    category: v.optional(categoryValidator),
    award: v.optional(awardValidator),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx)
    let projects = await ctx.db
      .query("projects")
      .withIndex("by_created")
      .order("desc")
      .collect()

    if (args.category) {
      projects = projects.filter(
        (project) => project.category === args.category
      )
    }

    if (args.award) {
      const awardedProjectIds = new Set(
        (
          await ctx.db
            .query("awards")
            .withIndex("by_type_date", (q) => q.eq("awardType", args.award!))
            .collect()
        ).map((award) => award.projectId)
      )
      projects = projects.filter((project) =>
        awardedProjectIds.has(project._id)
      )
    }

    if (args.search?.trim()) {
      const search = args.search.trim().toLowerCase()
      const rows = await Promise.all(
        projects.map((project) => staffProjectRowView(ctx, project))
      )
      return rows.filter(
        (project) =>
          project.title.toLowerCase().includes(search) ||
          project.user?.display_name?.toLowerCase().includes(search) ||
          project.user?.username?.toLowerCase().includes(search)
      )
    }

    return Promise.all(
      projects.map((project) => staffProjectRowView(ctx, project))
    )
  },
})
