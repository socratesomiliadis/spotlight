#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"

const [, , manifestPath = "convex-asset-manifest.json", outputPath = "convex-import-results.json"] =
  process.argv

await loadEnvFile(path.join(process.cwd(), ".env.local"))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const migrationSecret = process.env.CONVEX_MIGRATION_SECRET
const stripeWebhookSecret =
  process.env.CONVEX_STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL and Supabase key")
}
if (!migrationSecret) {
  throw new Error("Missing CONVEX_MIGRATION_SECRET")
}

const assetManifest = await readJsonFile(manifestPath, {})
const results = await readJsonFile(outputPath, {
  profiles: {},
  projects: {},
  awards: {},
  follows: {},
  subscriptions: {},
  counts: {},
})

const [profiles, socials, projects, awards, follows, subscriptions] =
  await Promise.all([
    fetchRows("profile"),
    fetchRows("socials"),
    fetchRows("project"),
    fetchRows("award"),
    fetchRows("follows"),
    fetchRows("subscriptions"),
  ])

results.counts.source = {
  profiles: profiles.length,
  socials: socials.length,
  projects: projects.length,
  awards: awards.length,
  follows: follows.length,
  subscriptions: subscriptions.length,
}
await writeJsonFile(outputPath, results)

const socialsByUserId = new Map(socials.map((social) => [social.user_id, social]))

for (const profile of profiles) {
  const social = socialsByUserId.get(profile.user_id) || {}
  const publicMetadata = parseJsonish(profile.public_metadata) || {}
  const id = runConvex("migration:importProfile", {
    secret: migrationSecret,
    authUserId: required(profile.user_id, "profile.user_id"),
    email: required(profile.email, `profile.email for ${profile.user_id}`),
    username: required(profile.username, `profile.username for ${profile.user_id}`),
    displayName: optionalString(profile.display_name),
    businessType: optionalString(profile.business_type),
    location: optionalString(profile.location),
    websiteUrl: optionalString(profile.website_url),
    avatarStorageId: storageIdFor(profile.avatar_url),
    bannerStorageId: storageIdFor(profile.banner_url),
    legacyAvatarUrl: optionalString(profile.avatar_url),
    legacyBannerUrl: optionalString(profile.banner_url),
    role: optionalString(publicMetadata.role),
    isUnclaimed: Boolean(profile.is_unclaimed),
    publicMetadata,
    instagram: optionalString(social.instagram),
    linkedIn: optionalString(social.linked_in),
    twitter: optionalString(social.twitter),
    createdAt: optionalString(profile.created_at),
    updatedAt: optionalString(profile.updated_at),
  })
  results.profiles[profile.user_id] = id
  await writeJsonFile(outputPath, results)
  console.log(`profile ${profile.user_id} -> ${id}`)
}

for (const project of projects) {
  const legacyProjectId = required(project.id, "project.id")
  const elementUrls = asArray(project.elements_url)
  const id = runConvex("migration:importProject", {
    secret: migrationSecret,
    ownerAuthUserId: required(project.user_id, `project.user_id for ${legacyProjectId}`),
    title: required(project.title, `project.title for ${legacyProjectId}`),
    slug: required(project.slug, `project.slug for ${legacyProjectId}`),
    category: parseCategory(project.category, legacyProjectId),
    tags: asStringArray(project.tags),
    liveUrl: optionalString(project.live_url),
    mainImageStorageId: storageIdFor(project.main_img_url),
    bannerStorageId: storageIdFor(project.banner_url),
    previewStorageId: storageIdFor(project.preview_url),
    elementStorageIds: elementUrls.map(storageIdFor).filter(Boolean),
    legacySupabaseId: legacyProjectId,
    legacyMainImgUrl: optionalString(project.main_img_url),
    legacyBannerUrl: optionalString(project.banner_url),
    legacyPreviewUrl: optionalString(project.preview_url),
    legacyElementsUrl: elementUrls,
    createdAt: optionalString(project.created_at),
    updatedAt: optionalString(project.updated_at || project.created_at),
  })
  results.projects[legacyProjectId] = id
  await writeJsonFile(outputPath, results)
  console.log(`project ${legacyProjectId} -> ${id}`)
}

for (const award of awards) {
  const legacyProjectId = required(award.project_id, `award.project_id for ${award.id}`)
  const projectId = results.projects[legacyProjectId]
  if (!projectId) {
    throw new Error(`Missing migrated project ID for award project ${legacyProjectId}`)
  }
  const id = runConvex("migration:importAward", {
    secret: migrationSecret,
    projectId,
    awardType: parseAwardType(award.award_type, award.id),
    awardedAt: required(award.awarded_at, `award.awarded_at for ${award.id}`),
    createdAt: optionalString(award.created_at),
  })
  results.awards[award.id || `${legacyProjectId}:${award.award_type}:${award.awarded_at}`] = id
  await writeJsonFile(outputPath, results)
  console.log(`award ${award.id || legacyProjectId} -> ${id}`)
}

for (const follow of follows) {
  const followerAuthUserId = required(follow.user_id, "follows.user_id")
  const followingAuthUserId = required(follow.following_id, "follows.following_id")
  const key = `${followerAuthUserId}:${followingAuthUserId}`
  const id = runConvex("migration:importFollow", {
    secret: migrationSecret,
    followerAuthUserId,
    followingAuthUserId,
    createdAt: optionalString(follow.created_at),
  })
  results.follows[key] = id
  await writeJsonFile(outputPath, results)
  console.log(`follow ${key} -> ${id}`)
}

if (subscriptions.length > 0 && !stripeWebhookSecret) {
  throw new Error("Subscriptions exist, but CONVEX_STRIPE_WEBHOOK_SECRET/STRIPE_WEBHOOK_SECRET is missing")
}

for (const subscription of subscriptions) {
  const stripeSubscriptionId = optionalString(subscription.stripe_subscription_id)
  const key = stripeSubscriptionId || required(subscription.stripe_customer_id, "subscription.stripe_customer_id")
  const id = runConvex("subscriptions:upsert", {
    webhookSecret: stripeWebhookSecret,
    userAuthUserId: required(subscription.user_id, `subscription.user_id for ${key}`),
    stripeCustomerId: required(subscription.stripe_customer_id, `subscription.stripe_customer_id for ${key}`),
    stripeSubscriptionId,
    stripePriceId: required(subscription.stripe_price_id, `subscription.stripe_price_id for ${key}`),
    status: required(subscription.status, `subscription.status for ${key}`),
    currentPeriodStart: optionalString(subscription.current_period_start),
    currentPeriodEnd: optionalString(subscription.current_period_end),
    cancelAtPeriodEnd:
      subscription.cancel_at_period_end === null ||
      subscription.cancel_at_period_end === undefined
        ? undefined
        : Boolean(subscription.cancel_at_period_end),
  })
  results.subscriptions[key] = id
  await writeJsonFile(outputPath, results)
  console.log(`subscription ${key} -> ${id}`)
}

results.counts.imported = {
  profiles: Object.keys(results.profiles).length,
  projects: Object.keys(results.projects).length,
  awards: Object.keys(results.awards).length,
  follows: Object.keys(results.follows).length,
  subscriptions: Object.keys(results.subscriptions).length,
}
await writeJsonFile(outputPath, results)

console.log(
  `Imported ${results.counts.imported.profiles} profiles, ${results.counts.imported.projects} projects, ` +
    `${results.counts.imported.awards} awards, ${results.counts.imported.follows} follows, ` +
    `${results.counts.imported.subscriptions} subscriptions.`
)

async function fetchRows(table) {
  const pageSize = 1000
  const rows = []

  for (let from = 0; ; from += pageSize) {
    const url = new URL(`/rest/v1/${table}`, supabaseUrl)
    url.searchParams.set("select", "*")

    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Range: `${from}-${from + pageSize - 1}`,
      },
    })

    if (!response.ok) {
      throw new Error(`${table} fetch failed: ${response.status} ${await response.text()}`)
    }

    const page = await response.json()
    rows.push(...page)
    if (page.length < pageSize) return rows
  }
}

function runConvex(functionName, args) {
  const result = spawnSync("pnpm", ["convex", "run", functionName, JSON.stringify(args)], {
    encoding: "utf8",
  })

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `convex run ${functionName} failed`)
  }

  return parseConvexValue(result.stdout)
}

function parseConvexValue(stdout) {
  const lines = stdout
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const lastLine = lines.at(-1) || ""

  try {
    return JSON.parse(lastLine)
  } catch {
    return lastLine.replace(/^"|"$/g, "")
  }
}

function storageIdFor(url) {
  const normalized = optionalString(url)
  if (!normalized) return undefined
  const storageId = assetManifest[normalized]
  if (!storageId) {
    console.warn(`No storage ID for ${normalized}; keeping legacy URL only.`)
  }
  return storageId
}

function required(value, label) {
  const normalized = optionalString(value)
  if (!normalized) throw new Error(`Missing ${label}`)
  return normalized
}

function optionalString(value) {
  if (value === null || value === undefined) return undefined
  const stringValue = String(value).trim()
  return stringValue || undefined
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  const parsed = parseJsonish(value)
  if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String)
  return []
}

function asStringArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  const parsed = parseJsonish(value)
  if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String)
  const stringValue = optionalString(value)
  return stringValue ? stringValue.split(",").map((item) => item.trim()).filter(Boolean) : []
}

function parseJsonish(value) {
  if (!value || typeof value === "object") return value
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}

function parseCategory(value, label) {
  const category = required(value, `project.category for ${label}`)
  const valid = new Set(["websites", "design", "films", "crypto", "startups", "ai"])
  if (!valid.has(category)) throw new Error(`Invalid category ${category} for project ${label}`)
  return category
}

function parseAwardType(value, label) {
  const awardType = required(value, `award.award_type for ${label}`)
  const valid = new Set(["otd", "otm", "oty", "honorable"])
  if (!valid.has(awardType)) throw new Error(`Invalid award type ${awardType} for award ${label}`)
  return awardType
}

async function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"))
  } catch (error) {
    if (error?.code === "ENOENT") return fallback
    throw error
  }
}

async function writeJsonFile(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

async function loadEnvFile(filePath) {
  let contents
  try {
    contents = await fs.readFile(filePath, "utf8")
  } catch (error) {
    if (error?.code === "ENOENT") return
    throw error
  }

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue

    const [, key, rawValue] = match
    if (process.env[key] !== undefined) continue

    process.env[key] = rawValue
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2")
  }
}
