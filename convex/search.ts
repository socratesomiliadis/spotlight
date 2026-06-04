import { query } from "./_generated/server"
import { v } from "convex/values"

import { profileView, projectView } from "./lib"

export const all = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const needle = args.query.trim().toLowerCase()
    if (needle.length < 2) return { users: [], projects: [] }

    const [profiles, projects] = await Promise.all([
      ctx.db.query("profiles").collect(),
      ctx.db.query("projects").collect(),
    ])

    const users = profiles.filter(
      (profile) =>
        profile.username.toLowerCase().includes(needle) ||
        profile.displayName?.toLowerCase().includes(needle)
    )
    const matchedProjects = projects.filter((project) =>
      project.title.toLowerCase().includes(needle)
    )

    return {
      users: await Promise.all(users.slice(0, 5).map((profile) => profileView(ctx, profile))),
      projects: await Promise.all(
        matchedProjects.slice(0, 5).map((project) => projectView(ctx, project))
      ),
    }
  },
})
