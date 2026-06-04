import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import bcrypt from "bcryptjs"
import { betterAuth } from "better-auth"
import { admin, emailOTP, username } from "better-auth/plugins"
import { adminAc, userAc } from "better-auth/plugins/admin/access"
import { Resend } from "resend"

import { components } from "../_generated/api"
import type { DataModel } from "../_generated/dataModel"
import {
  otpEmail,
  resetPasswordLinkEmail,
  verificationLinkEmail,
} from "../../lib/email-templates"
import authConfig from "../auth.config"
import schema from "./schema"

const siteUrl =
  process.env.SITE_URL ||
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"

const trustedOrigins = [
  siteUrl,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
].filter(
  (origin, index, origins) => origin && origins.indexOf(origin) === index
)

export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: false,
  }
)

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.AUTH_EMAIL_FROM || "Spotlight <auth@spotlight.day>"

  if (!apiKey) {
    console.warn(`Skipping auth email to ${to}: RESEND_API_KEY is not set`)
    return
  }

  const resend = new Resend(apiKey)
  await resend.emails.send({
    from,
    to,
    subject,
    html,
  })
}

export const createAuthOptions = (_ctx: GenericCtx<DataModel>) =>
  ({
    appName: "Spotlight",
    baseURL: siteUrl,
    trustedOrigins,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(_ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }: any) => {
        const email = resetPasswordLinkEmail({ url })
        await sendEmail({
          to: user.email,
          subject: email.subject,
          html: email.html,
        })
      },
      password: {
        hash: async (password: string) => bcrypt.hash(password, 10),
        verify: async ({
          hash,
          password,
        }: {
          hash: string
          password: string
        }) => bcrypt.compare(password, hash),
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }: any) => {
        const email = verificationLinkEmail({ url })
        await sendEmail({
          to: user.email,
          subject: email.subject,
          html: email.html,
        })
      },
      sendOnSignUp: true,
    },
    plugins: [
      username({
        minUsernameLength: 3,
        maxUsernameLength: 30,
      }),
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        sendVerificationOTP: async ({ email, otp, type }: any) => {
          const template = otpEmail({ otp, type })
          await sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
          })
        },
        sendVerificationOnSignUp: true,
      }),
      admin({
        adminRoles: ["staff", "admin"],
        defaultRole: "user",
        roles: {
          user: userAc,
          staff: adminAc,
          admin: adminAc,
        },
      }),
      convex({ authConfig }),
    ],
  }) as any

export const options = createAuthOptions({} as GenericCtx<DataModel>)

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx))
