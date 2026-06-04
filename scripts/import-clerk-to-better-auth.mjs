#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const [, , inputPath = "exported_users.csv", outputPath = "convex-clerk-import-results.json"] =
  process.argv

await loadEnvFile(path.join(process.cwd(), ".env.local"))

const migrationSecret = process.env.CONVEX_MIGRATION_SECRET
if (!migrationSecret) {
  throw new Error("Missing CONVEX_MIGRATION_SECRET")
}

const csv = await fs.readFile(inputPath, "utf8")
const rows = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  trim: true,
})
const results = await readJsonFile(outputPath, {
  users: {},
  skippedPasswordUsers: [],
  counts: {},
})

results.counts.source = rows.length
await writeJsonFile(outputPath, results)

for (const row of rows) {
  const clerkUserId = required(row.id, "id")
  const email = required(row.primary_email_address, `primary_email_address for ${clerkUserId}`)
  const passwordDigest = optionalString(row.password_digest)
  const passwordHasher = optionalString(row.password_hasher)

  if (passwordDigest && passwordHasher !== "bcrypt") {
    throw new Error(
      `Unsupported password_hasher for ${clerkUserId}: ${passwordHasher || "(empty)"}`
    )
  }

  const imported = runConvex("migration:importClerkUser", {
    secret: migrationSecret,
    clerkUserId,
    email,
    emailVerified: isVerifiedEmail(row, email),
    name: displayName(row, email),
    username: optionalString(row.username),
    passwordDigest,
    passwordHasher,
    createdAt: parseClerkTimestamp(row.created_at),
    updatedAt: Date.now(),
  })

  results.users[clerkUserId] = imported
  if (!passwordDigest && !results.skippedPasswordUsers.includes(clerkUserId)) {
    results.skippedPasswordUsers.push(clerkUserId)
  }
  results.counts.imported = Object.keys(results.users).length
  results.counts.withoutPassword = results.skippedPasswordUsers.length
  await writeJsonFile(outputPath, results)
  console.log(`imported Clerk user ${clerkUserId}`)
}

console.log(
  `Imported ${Object.keys(results.users).length} Clerk users; ` +
    `${results.skippedPasswordUsers.length} had no password digest.`
)

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

function isVerifiedEmail(row, email) {
  const verified = optionalString(row.verified_email_addresses)
  return Boolean(verified && verified.includes(email))
}

function displayName(row, email) {
  const name = [row.first_name, row.last_name]
    .map(optionalString)
    .filter(Boolean)
    .join(" ")
  return name || optionalString(row.username) || email.split("@")[0] || email
}

function parseClerkTimestamp(value) {
  const normalized = optionalString(value)
  if (!normalized) return Date.now()

  const numeric = Number(normalized)
  if (Number.isFinite(numeric)) {
    return numeric < 10_000_000_000 ? numeric * 1000 : numeric
  }

  const parsed = Date.parse(normalized)
  return Number.isFinite(parsed) ? parsed : Date.now()
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
