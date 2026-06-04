# Spotlight

Spotlight is a Next.js app for showcasing creative projects, profiles, awards, follows, and premium subscriptions.

The app now uses Convex for backend functions, app data, file storage, and Stripe subscription state. Authentication is Better Auth through the Convex integration with email/password, username login, email OTP, password reset, and staff/admin roles.

## Stack

- Next.js 15 and React 19
- TypeScript
- Convex database, functions, HTTP routes, and storage
- Better Auth with `@convex-dev/better-auth`
- Resend for auth emails
- Stripe for billing
- Tailwind CSS, HeroUI, Radix UI, GSAP, and Three.js

## Local Setup

Install dependencies:

```bash
pnpm install
```

Create a root `.env.local` from [.env.example](/Users/socrates/Projects/spotlight/.env.example):

```bash
cp .env.example .env.local
```

Populate the Convex values from your Convex deployment:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site
```

Generate a Better Auth secret and set it in both `.env.local` and Convex:

```bash
SECRET=$(openssl rand -hex 32)
printf '\nBETTER_AUTH_SECRET=%s\n' "$SECRET" >> .env.local
pnpm convex env set BETTER_AUTH_SECRET "$SECRET"
```

For local browser sign-in, keep these localhost values:

```env
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
```

Also sync them to Convex when using the cloud Convex dev deployment:

```bash
pnpm convex env set SITE_URL http://localhost:3000
pnpm convex env set BETTER_AUTH_URL http://localhost:3000
pnpm convex env set BETTER_AUTH_TRUSTED_ORIGINS http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
```

If your local Next.js app runs on another port, add that origin to `BETTER_AUTH_TRUSTED_ORIGINS` locally and in Convex.

Do not start a dev server from automation in this repo. Use the already-running server/process.

## Invalid Origin Fix

Better Auth rejects browser requests whose `Origin` is not trusted. Because the auth routes run through Convex, Convex must know that `http://localhost:3000` is allowed.

The required pieces are:

- `SITE_URL` or `BETTER_AUTH_URL` set to the current app origin
- `BETTER_AUTH_TRUSTED_ORIGINS` containing the browser origin
- the same values set in Convex with `pnpm convex env set`

For production, replace localhost with the real deployed app URL:

```bash
pnpm convex env set SITE_URL https://spotlight.day
pnpm convex env set BETTER_AUTH_URL https://spotlight.day
pnpm convex env set BETTER_AUTH_TRUSTED_ORIGINS https://spotlight.day
```

## Convex

Generate Convex bindings and upload functions:

```bash
pnpm convex codegen --typecheck disable
```

Validate imported app-table counts:

```bash
pnpm convex run migration:validateCounts
```

Core Convex files:

- [convex/schema.ts](/Users/socrates/Projects/spotlight/convex/schema.ts): app tables
- [convex/betterAuth/schema.ts](/Users/socrates/Projects/spotlight/convex/betterAuth/schema.ts): Better Auth tables
- [convex/http.ts](/Users/socrates/Projects/spotlight/convex/http.ts): Better Auth HTTP routes
- [convex/migration.ts](/Users/socrates/Projects/spotlight/convex/migration.ts): migration-only functions

## Auth

Better Auth is configured in [convex/betterAuth/auth.ts](/Users/socrates/Projects/spotlight/convex/betterAuth/auth.ts).

Enabled auth features:

- email/password
- bcrypt verification for migrated Clerk password hashes
- username plugin
- email OTP
- email verification
- password reset
- admin/staff roles
- Convex auth token integration

Auth routes are exposed through:

- Convex HTTP routes at `NEXT_PUBLIC_CONVEX_SITE_URL`
- Next.js route handler at [app/api/auth/[...all]/route.ts](/Users/socrates/Projects/spotlight/app/api/auth/[...all]/route.ts)

## Migration

Migration artifacts are intentionally separate from runtime code:

- [scripts/build-urls-json.mjs](/Users/socrates/Projects/spotlight/scripts/build-urls-json.mjs): collect Supabase and Clerk media URLs
- [scripts/migrate-assets-to-convex.mjs](/Users/socrates/Projects/spotlight/scripts/migrate-assets-to-convex.mjs): upload old media URLs into Convex Storage
- [scripts/import-supabase-to-convex.mjs](/Users/socrates/Projects/spotlight/scripts/import-supabase-to-convex.mjs): import Supabase app rows into Convex app tables
- [scripts/import-clerk-to-better-auth.mjs](/Users/socrates/Projects/spotlight/scripts/import-clerk-to-better-auth.mjs): import Clerk CSV users into Better Auth

Sensitive migration files:

- `exported_users.csv` contains password hashes and is gitignored.
- `CONVEX_MIGRATION_SECRET` should be removed or rotated after migration.
- Supabase service-role keys should be removed after final validation.

Current migration result files:

- `convex-asset-manifest.json`
- `convex-asset-manifest-failures.json`
- `convex-import-results.json`
- `convex-clerk-import-results.json`

See [MIGRATION_CONVEX.md](/Users/socrates/Projects/spotlight/MIGRATION_CONVEX.md) for the longer cutover runbook.

## Convex Environment

Set these runtime values in each Convex deployment with `pnpm convex env set`. For local development against the Convex dev deployment, localhost is valid:

```bash
pnpm convex env set BETTER_AUTH_SECRET "replace_with_64_hex_chars"
pnpm convex env set SITE_URL http://localhost:3000
pnpm convex env set BETTER_AUTH_URL http://localhost:3000
pnpm convex env set BETTER_AUTH_TRUSTED_ORIGINS http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
pnpm convex env set RESEND_API_KEY "re_xxxxxxxxx"
pnpm convex env set AUTH_EMAIL_FROM "Spotlight <auth@example.com>"
pnpm convex env set CONVEX_STRIPE_WEBHOOK_SECRET "whsec_xxxxxxxxx"
```

For production, use your real deployed app origin:

```bash
pnpm convex env set BETTER_AUTH_SECRET "replace_with_64_hex_chars"
pnpm convex env set SITE_URL https://your-production-domain
pnpm convex env set BETTER_AUTH_URL https://your-production-domain
pnpm convex env set BETTER_AUTH_TRUSTED_ORIGINS https://your-production-domain
pnpm convex env set RESEND_API_KEY "re_xxxxxxxxx"
pnpm convex env set AUTH_EMAIL_FROM "Spotlight <auth@example.com>"
pnpm convex env set CONVEX_STRIPE_WEBHOOK_SECRET "whsec_xxxxxxxxx"
```

Convex env var purpose:

- `BETTER_AUTH_SECRET`: signs and encrypts Better Auth state and JWT/JWKS data. Required.
- `SITE_URL`: canonical app origin used by auth emails and callbacks. Required.
- `BETTER_AUTH_URL`: Better Auth base URL. Keep it the same as `SITE_URL`. Required.
- `BETTER_AUTH_TRUSTED_ORIGINS`: browser origins allowed to call auth routes. Required for localhost and production sign-in.
- `RESEND_API_KEY`: sends verification, OTP, claim, and reset emails. Required for email flows.
- `AUTH_EMAIL_FROM`: sender address for auth emails.
- `CONVEX_STRIPE_WEBHOOK_SECRET`: expected Stripe webhook secret checked by Convex subscription mutations.

Migration-only Convex env:

```bash
pnpm convex env set CONVEX_MIGRATION_SECRET "replace_with_64_hex_chars"
```

Remove or rotate `CONVEX_MIGRATION_SECRET` after migration. Supabase keys and Clerk export secrets are local migration inputs; they do not need to be set in Convex.

Do not set these frontend/Next-only values in Convex unless another Convex function explicitly starts using them:

- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_ID`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `STRIPE_SECRET_KEY`

## Production Environment

Set these values in the production hosting provider:

```env
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
BETTER_AUTH_SECRET=
SITE_URL=https://your-production-domain
BETTER_AUTH_URL=https://your-production-domain
BETTER_AUTH_TRUSTED_ORIGINS=https://your-production-domain
RESEND_API_KEY=
AUTH_EMAIL_FROM=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CONVEX_STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRICE_ID=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Set the Convex-side runtime values from the previous section in the production Convex deployment. After production validation, remove Clerk and Supabase migration env vars from production.

## Verification

Run:

```bash
pnpm exec tsc --noEmit
pnpm convex run migration:validateCounts
```

Then manually verify:

- sign in with email/password
- sign in with username/password
- migrated-user password login
- email OTP and password reset
- profile and project reads
- avatar/banner/project media resolve from Convex Storage
- staff-only dashboard actions
- Stripe checkout and webhook subscription updates
