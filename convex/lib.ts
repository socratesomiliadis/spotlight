import type { Doc, Id } from "./_generated/dataModel"
import { authComponent } from "./betterAuth/auth"

export async function getCurrentAuthUser(ctx: any) {
  return authComponent.safeGetAuthUser(ctx)
}

export async function requireAuthUser(ctx: any) {
  const user = await getCurrentAuthUser(ctx)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export function authUserId(user: any) {
  return String(user.clerkUserId ?? user.id ?? user._id)
}

export async function getProfileByAuthUserId(ctx: any, authUserId: string) {
  return ctx.db
    .query("profiles")
    .withIndex("by_auth_user_id", (q: any) => q.eq("authUserId", authUserId))
    .first()
}

export async function requireProfile(ctx: any) {
  const authUser = await requireAuthUser(ctx)
  const profile = await getProfileByAuthUserId(ctx, authUserId(authUser))
  if (!profile) {
    throw new Error("Profile not found")
  }
  return { authUser, profile }
}

export async function requireStaff(ctx: any) {
  const { authUser, profile } = await requireProfile(ctx)
  const role = profile.role || authUser.role
  if (role !== "staff" && role !== "admin") {
    throw new Error("Only staff can access this resource")
  }
  return { authUser, profile }
}

export function nowIso() {
  return new Date().toISOString()
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50)
}

export async function storageUrl(
  ctx: any,
  storageId?: Id<"_storage">,
  legacyUrl?: string
) {
  if (!storageId) return legacyUrl || null
  return (await ctx.storage.getUrl(storageId)) || legacyUrl || null
}

export async function profileView(ctx: any, profile: Doc<"profiles">) {
  return {
    id: profile._id,
    user_id: profile.authUserId,
    email: profile.email,
    username: profile.username,
    display_name: profile.displayName || null,
    business_type: profile.businessType || "",
    location: profile.location || null,
    website_url: profile.websiteUrl || null,
    avatar_url: await storageUrl(
      ctx,
      profile.avatarStorageId,
      profile.legacyAvatarUrl
    ),
    banner_url: await storageUrl(
      ctx,
      profile.bannerStorageId,
      profile.legacyBannerUrl
    ),
    role: profile.role || "user",
    is_unclaimed: profile.isUnclaimed,
    public_metadata: profile.publicMetadata || null,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
    socials: {
      user_id: profile.authUserId,
      created_at: profile.createdAt,
      instagram: profile.instagram || null,
      linked_in: profile.linkedIn || null,
      twitter: profile.twitter || null,
    },
  }
}

export async function awardView(award: Doc<"awards">) {
  return {
    id: award._id,
    project_id: award.projectId,
    award_type: award.awardType,
    awarded_at: award.awardedAt,
    created_at: award.createdAt,
  }
}

export async function projectView(ctx: any, project: Doc<"projects">) {
  const [profile, awards] = await Promise.all([
    getProfileByAuthUserId(ctx, project.ownerAuthUserId),
    ctx.db
      .query("awards")
      .withIndex("by_project", (q: any) => q.eq("projectId", project._id))
      .collect(),
  ])
  const user = profile ? await profileView(ctx, profile) : null
  const elements = await Promise.all(
    (project.elementStorageIds || []).map((id) => storageUrl(ctx, id))
  )

  return {
    id: project._id,
    _id: project._id,
    user_id: project.ownerAuthUserId,
    title: project.title,
    slug: project.slug,
    category: project.category,
    tags: project.tags,
    live_url: project.liveUrl || null,
    main_img_url:
      (await storageUrl(
        ctx,
        project.mainImageStorageId,
        project.legacyMainImgUrl
      )) || "",
    main_image_storage_id: project.mainImageStorageId || null,
    banner_url:
      (await storageUrl(
        ctx,
        project.bannerStorageId,
        project.legacyBannerUrl
      )) || "",
    banner_storage_id: project.bannerStorageId || null,
    preview_url: await storageUrl(
      ctx,
      project.previewStorageId,
      project.legacyPreviewUrl
    ),
    preview_storage_id: project.previewStorageId || null,
    elements_url: elements.filter(Boolean).length
      ? elements.filter(Boolean)
      : project.legacyElementsUrl || null,
    element_storage_ids: project.elementStorageIds || [],
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    profile: user,
    user,
    award: await Promise.all(awards.map(awardView)),
  }
}
