#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"

const [, , inputPath, outputPath = "convex-asset-manifest.json"] = process.argv
const failuresPath = outputPath.replace(/\.json$/i, "-failures.json")

if (!inputPath) {
  console.error(
    "Usage: node scripts/migrate-assets-to-convex.mjs urls.json [manifest.json]"
  )
  process.exit(1)
}

await loadEnvFile(path.join(process.cwd(), ".env.local"))

const urls = JSON.parse(await fs.readFile(inputPath, "utf8"))
const manifest = await readJsonFile(outputPath, {})
const failures = []
const secret = process.env.CONVEX_MIGRATION_SECRET

if (!secret) {
  console.error("CONVEX_MIGRATION_SECRET is required")
  process.exit(1)
}

for (const url of urls) {
  if (!url || manifest[url]) continue
  const result = spawnSync(
    "pnpm",
    [
      "convex",
      "run",
      "migration:storeRemoteAsset",
      JSON.stringify({ secret, url }),
    ],
    { encoding: "utf8" }
  )
  if (result.status !== 0) {
    const error = (result.stderr || result.stdout || "").trim()
    failures.push({ url, error })
    console.error(`Failed: ${url}`)
    if (error) console.error(error)
    await writeJsonFile(failuresPath, failures)
    continue
  }
  manifest[url] = parseConvexString(result.stdout)
  console.log(`${url} -> ${manifest[url]}`)
  await writeJsonFile(outputPath, manifest)
}

await writeJsonFile(outputPath, manifest)
await writeJsonFile(failuresPath, failures)

if (failures.length > 0) {
  console.error(
    `Uploaded ${Object.keys(manifest).length} assets with ${failures.length} failures.`
  )
  process.exit(1)
}

console.log(`Uploaded ${Object.keys(manifest).length} assets.`)

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

function parseConvexString(stdout) {
  const lines = stdout
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const lastLine = lines.at(-1) ?? ""
  try {
    const parsed = JSON.parse(lastLine)
    if (typeof parsed === "string") return parsed
  } catch {}

  return lastLine.replace(/^"|"$/g, "")
}
