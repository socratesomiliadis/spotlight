import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import bcrypt from "bcryptjs"
import { betterAuth } from "better-auth"
import { admin, emailOTP, username } from "better-auth/plugins"
import { adminAc, defaultAc, userAc } from "better-auth/plugins/admin/access"
import { Resend } from "resend"

import { components } from "../_generated/api"
import type { DataModel } from "../_generated/dataModel"
import {
  otpEmail,
  resetPasswordLinkEmail,
  securityNotificationEmail,
} from "../../lib/email-templates"
import authConfig from "../auth.config"
import { ensureProfileForAuthUser } from "../profileHelpers"
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
    throw new Error("Auth email delivery is not configured")
  }

  const resend = new Resend(apiKey)
  await resend.emails.send({
    from,
    to,
    subject,
    html,
  })
}

async function sendSecurityNotification({
  to,
  title,
  message,
}: {
  to: string
  title: string
  message: string
}) {
  try {
    const email = securityNotificationEmail({ title, message })
    await sendEmail({
      to,
      subject: email.subject,
      html: email.html,
    })
  } catch (error) {
    console.warn(
      error instanceof Error
        ? `Skipping security notification: ${error.message}`
        : "Skipping security notification"
    )
  }
}

async function findAuthUserById(ctx: GenericCtx<DataModel>, userId: string) {
  return ctx.runQuery(components.betterAuth.adapter.findOne, {
    model: "user",
    where: [{ field: "_id", operator: "eq", value: userId }],
  })
}

function requestPath(request?: Request) {
  if (!request) return ""
  try {
    return new URL(request.url).pathname
  } catch {
    return ""
  }
}

export const createAuthOptions = (_ctx: GenericCtx<DataModel>) =>
  ({
    appName: "Spotlight",
    baseURL: siteUrl,
    trustedOrigins,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(_ctx),
    rateLimit: {
      enabled: true,
      window: 60,
      max: 30,
    },
    session: {
      freshAge: 60 * 15,
    },
    databaseHooks: {
      session: {
        create: {
          after: async (session: any) => {
            const user = await findAuthUserById(_ctx, session.userId)
            if (!user?.email) return
            await sendSecurityNotification({
              to: user.email,
              title: "New sign-in to Spotlight",
              message:
                "A new session was created for your Spotlight account. If this was not you, reset your password and sign out other sessions.",
            })
          },
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }: any) => {
        const email = resetPasswordLinkEmail({ url })
        await sendEmail({
          to: user.email,
          subject: email.subject,
          html: email.html,
        })
      },
      onPasswordReset: async ({ user }: any) => {
        await sendSecurityNotification({
          to: user.email,
          title: "Your Spotlight password was changed",
          message:
            "The password for your Spotlight account was changed successfully.",
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
      sendOnSignUp: false,
      autoSignInAfterVerification: true,
      afterEmailVerification: async (user: any, request?: Request) => {
        await ensureProfileForAuthUser(_ctx, user)
        if (requestPath(request).endsWith("/email-otp/change-email")) {
          await sendSecurityNotification({
            to: user.email,
            title: "Your Spotlight email was changed",
            message:
              "The email address for your Spotlight account was changed successfully.",
          })
        }
      },
    },
    plugins: [
      username({
        minUsernameLength: 3,
        maxUsernameLength: 30,
      }),
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        changeEmail: {
          enabled: true,
          verifyCurrentEmail: true,
        },
        sendVerificationOTP: async ({ email, otp, type }: any) => {
          const template = otpEmail({ otp, type })
          await sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
          })
        },
        sendVerificationOnSignUp: true,
        overrideDefaultEmailVerification: true,
        rateLimit: {
          window: 60,
          max: 3,
        },
      }),
      admin({
        adminRoles: ["staff", "admin"],
        defaultRole: "user",
        roles: {
          user: userAc,
          staff: defaultAc.newRole({
            user: [],
            session: [],
          }),
          admin: adminAc,
        },
      }),
      convex({ authConfig }),
    ],
  }) as any

export const options = createAuthOptions({} as GenericCtx<DataModel>)

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx))
