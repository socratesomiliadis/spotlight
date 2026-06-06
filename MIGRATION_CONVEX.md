# Convex Migration Runbook

This repo now uses Convex, Better Auth, and Convex Storage. Do not run the cutover while writes are enabled.

## 1. Freeze Writes

Disable signups, project/profile edits, staff project creation, awards, follows, and Stripe checkout before the production import.

## 2. Export Source Data

Export these Supabase tables as JSON or CSV:

- `profile`
- `socials`
- `project`
- `award`
- `follows`
- `subscriptions`

Export Clerk users as CSV including password hashes. Keep Clerk user IDs as Better Auth user IDs.

## 3. Migrate Assets

Build a URL manifest from:

- `profile.avatar_url`
- `profile.banner_url`
- `project.main_img_url`
- `project.banner_url`
- `project.preview_url`
- every `project.elements_url[]`

For each URL, run the Convex action:

```bash
pnpm convex run migration:storeRemoteAsset '{"secret":"'$CONVEX_MIGRATION_SECRET'","url":"https://..."}'
```

Record the returned storage ID in an asset manifest:

```json
{
  "https://old-url": "convex_storage_id"
}
```

## 4. Import Auth Users

Use Better Auth’s Clerk migration flow with bcrypt verification enabled. Preserve:

- `id`
- `email`
- `emailVerified`
- `name`
- `username`
- password hash

After import, active sessions are reset, but users with valid imported hashes can keep their passwords.

## 5. Import App Data

Transform source rows and call these Convex mutations:

- `migration:importProfile`
- `migration:importProject`
- `migration:importAward`
- `migration:importFollow`
- `subscriptions:upsert`

Pass `secret: process.env.CONVEX_MIGRATION_SECRET` to each `migration:*` write. Use the asset manifest to replace old URLs with `Id<"_storage">` fields. Preserve Supabase project UUIDs as `legacySupabaseId`.

## 6. Validate

Run:

```bash
pnpm convex run migration:validateCounts
```

Then verify:

- profile/project/award/follow/subscription counts match source exports
- every project owner resolves to a profile
- every award resolves to a project
- every follow resolves to two profiles
- every migrated media storage ID resolves in the UI
- at least five migrated users can sign in with existing passwords

## 7. Cut Over

Deploy the app with Convex env vars, re-enable writes, and monitor auth, Stripe webhooks, storage loads, and Convex function errors.
