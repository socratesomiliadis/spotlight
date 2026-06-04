#!/usr/bin/env node

import fs from "node:fs/promises"

const envText = await fs.readFile(".env.local", "utf8")
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=")
      const key = line.slice(0, index)
      const value = line.slice(index + 1).replace(/^['"]|['"]$/g, "")
      return [key, value]
    })
)

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL and Supabase key in .env.local")
}

async function fetchRows(table, select) {
  const url = new URL(`/rest/v1/${table}`, supabaseUrl)
  url.searchParams.set("select", select)

  const response = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    throw new Error(`${table} fetch failed: ${response.status} ${await response.text()}`)
  }

  return response.json()
}

const [profiles, projects] = await Promise.all([
  fetchRows("profile", "avatar_url,banner_url"),
  fetchRows("project", "main_img_url,banner_url,preview_url,elements_url"),
])

const urls = new Set()

for (const profile of profiles) {
  for (const key of ["avatar_url", "banner_url"]) {
    if (profile[key]) urls.add(profile[key])
  }
}

for (const project of projects) {
  for (const key of ["main_img_url", "banner_url", "preview_url"]) {
    if (project[key]) urls.add(project[key])
  }
  for (const url of project.elements_url || []) {
    if (url) urls.add(url)
  }
}

const output = [...urls].sort()
await fs.writeFile("urls.json", `${JSON.stringify(output, null, 2)}\n`)

console.log(`Wrote ${output.length} URLs to urls.json`)
