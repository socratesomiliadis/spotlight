"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Form, Spinner } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import {
  CheckCircle2,
  Crown,
  ExternalLink,
  KeyRound,
  Laptop,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { authClient } from "@/lib/auth-client"
import type { ProfileView } from "@/lib/spotlight-types"
import { cn } from "@/lib/utils"
import MyInput from "@/components/Forms/components/Input"

const identitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
})

const emailOtpSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type IdentityValues = z.infer<typeof identitySchema>
type EmailValues = z.infer<typeof emailSchema>
type EmailOtpValues = z.infer<typeof emailOtpSchema>
type PasswordValues = z.infer<typeof passwordSchema>

type AuthSession = {
  id: string
  token?: string
  createdAt?: Date | string
  expiresAt?: Date | string
  ipAddress?: string | null
  userAgent?: string | null
}

type ActionState = {
  error: string | null
  success: string | null
  loading: boolean
}

const initialActionState: ActionState = {
  error: null,
  success: null,
  loading: false,
}

function responseError(response: unknown) {
  return response &&
    typeof response === "object" &&
    "error" in response &&
    response.error
    ? String(
        (response.error as { message?: string }).message || "Request failed"
      )
    : null
}

function responseData<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") return null
  if ("data" in response) return response.data as T
  return response as T
}

function formatDate(value?: Date | string) {
  if (!value) return "Unknown"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function deviceName(userAgent?: string | null) {
  if (!userAgent) return "Unknown device"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Edg")) return "Microsoft Edge"
  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Safari")) return "Safari"
  return "Browser session"
}

function SettingsSection({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <section className="border-b border-[#EAEAEA] py-8 last:border-b-0">
      <div className="grid gap-5 lg:grid-cols-[240px_1fr] lg:gap-10">
        <div>
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[#F5F5F5] text-black">
            {icon}
          </div>
          <h2 className="text-xl leading-none tracking-tight">{title}</h2>
          <p className="mt-2 max-w-[26rem] text-sm leading-snug text-[#787878]">
            {description}
          </p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  )
}

function SubmitButton({
  children,
  loading,
  variant = "primary",
}: {
  children: ReactNode
  loading?: boolean
  variant?: "primary" | "danger"
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "relative flex h-11 items-center justify-center rounded-lg px-5 text-sm transition disabled:opacity-60",
        variant === "primary" && "bg-black text-white hover:bg-[#1E1E1E]",
        variant === "danger" && "bg-[#FA5A59] text-white hover:bg-[#e94f4e]"
      )}
    >
      {loading && <Spinner className="absolute" color="white" size="sm" />}
      <span className={cn(loading && "opacity-0")}>{children}</span>
    </button>
  )
}

function StatusMessage({ state }: { state: ActionState }) {
  if (!state.error && !state.success) return null
  return (
    <p
      className={cn(
        "mt-3 text-sm",
        state.error ? "text-[#FA5A59]" : "text-green-600"
      )}
    >
      {state.error || state.success}
    </p>
  )
}

export default function AccountSettingsClient({
  user,
  isPremium,
}: {
  user: ProfileView
  isPremium: boolean
}) {
  const router = useRouter()
  const ensureCurrent = useMutation(api.profiles.ensureCurrent)
  const { data: session, refetch } = authClient.useSession()
  const [profile, setProfile] = useState(user)
  const [identityState, setIdentityState] =
    useState<ActionState>(initialActionState)
  const [emailState, setEmailState] = useState<ActionState>(initialActionState)
  const [passwordState, setPasswordState] =
    useState<ActionState>(initialActionState)
  const [sessionsState, setSessionsState] =
    useState<ActionState>(initialActionState)
  const [authSessions, setAuthSessions] = useState<AuthSession[]>([])
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const authUser = session?.user
  const currentSessionId = session?.session?.id
  const displayName = profile.display_name || profile.username
  const accountEmail = authUser?.email || profile.email

  const identityForm = useForm<IdentityValues>({
    resolver: zodResolver(identitySchema),
    defaultValues: { name: displayName },
  })
  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: accountEmail },
  })
  const emailOtpForm = useForm<EmailOtpValues>({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: { code: "" },
  })
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (authUser?.email) {
      emailForm.reset({ email: authUser.email })
    }
  }, [authUser?.email, emailForm])

  const loadSessions = useCallback(async () => {
    setSessionsState({ ...initialActionState, loading: true })
    try {
      const response = await (authClient as any).listSessions()
      const error = responseError(response)
      if (error) throw new Error(error)
      setAuthSessions(responseData<AuthSession[]>(response) || [])
      setSessionsState(initialActionState)
    } catch (err) {
      setSessionsState({
        error: err instanceof Error ? err.message : "Failed to load sessions",
        success: null,
        loading: false,
      })
    }
  }, [])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  async function onIdentitySubmit(data: IdentityValues) {
    setIdentityState({ ...initialActionState, loading: true })
    try {
      const response = await (authClient as any).updateUser({ name: data.name })
      const error = responseError(response)
      if (error) throw new Error(error)
      await ensureCurrent({
        username: profile.username,
        displayName: data.name,
      })
      setProfile((current) => ({ ...current, display_name: data.name }))
      await refetch()
      router.refresh()
      setIdentityState({
        error: null,
        success: "Account name updated.",
        loading: false,
      })
    } catch (err) {
      setIdentityState({
        error: err instanceof Error ? err.message : "Failed to update account",
        success: null,
        loading: false,
      })
    }
  }

  async function onEmailSubmit(data: EmailValues) {
    setEmailState({ ...initialActionState, loading: true })
    try {
      const response = await (authClient as any).emailOtp.requestEmailChange({
        newEmail: data.email,
      })
      const error = responseError(response)
      if (error) throw new Error(error)
      setPendingEmail(data.email)
      setEmailState({
        error: null,
        success: `Verification code sent to ${data.email}.`,
        loading: false,
      })
    } catch (err) {
      setEmailState({
        error: err instanceof Error ? err.message : "Failed to send code",
        success: null,
        loading: false,
      })
    }
  }

  async function onEmailOtpSubmit(data: EmailOtpValues) {
    if (!pendingEmail) return
    setEmailState({ ...initialActionState, loading: true })
    try {
      const response = await (authClient as any).emailOtp.changeEmail({
        newEmail: pendingEmail,
        otp: data.code,
      })
      const error = responseError(response)
      if (error) throw new Error(error)
      await ensureCurrent({
        username: profile.username,
        displayName: profile.display_name || profile.username,
      })
      setProfile((current) => ({ ...current, email: pendingEmail }))
      emailOtpForm.reset()
      setPendingEmail(null)
      await refetch()
      router.refresh()
      setEmailState({
        error: null,
        success: "Email address updated.",
        loading: false,
      })
    } catch (err) {
      setEmailState({
        error: err instanceof Error ? err.message : "Failed to verify code",
        success: null,
        loading: false,
      })
    }
  }

  async function onPasswordSubmit(data: PasswordValues) {
    setPasswordState({ ...initialActionState, loading: true })
    try {
      const response = await (authClient as any).changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      })
      const error = responseError(response)
      if (error) throw new Error(error)
      passwordForm.reset()
      await loadSessions()
      setPasswordState({
        error: null,
        success: "Password updated. Other sessions were signed out.",
        loading: false,
      })
    } catch (err) {
      setPasswordState({
        error: err instanceof Error ? err.message : "Failed to update password",
        success: null,
        loading: false,
      })
    }
  }

  async function revokeSession(token?: string) {
    if (!token) return
    setSessionsState({ ...initialActionState, loading: true })
    try {
      const response = await (authClient as any).revokeSession({ token })
      const error = responseError(response)
      if (error) throw new Error(error)
      await loadSessions()
      setSessionsState({
        error: null,
        success: "Session signed out.",
        loading: false,
      })
    } catch (err) {
      setSessionsState({
        error:
          err instanceof Error ? err.message : "Failed to sign out session",
        success: null,
        loading: false,
      })
    }
  }

  async function revokeOtherSessions() {
    setSessionsState({ ...initialActionState, loading: true })
    try {
      const response = await (authClient as any).revokeOtherSessions()
      const error = responseError(response)
      if (error) throw new Error(error)
      await loadSessions()
      setSessionsState({
        error: null,
        success: "Other sessions signed out.",
        loading: false,
      })
    } catch (err) {
      setSessionsState({
        error:
          err instanceof Error ? err.message : "Failed to sign out sessions",
        success: null,
        loading: false,
      })
    }
  }

  return (
    <main className="min-h-svh bg-white px-4 pb-28 pt-24 lg:px-8 lg:pb-16 lg:pt-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-[#EAEAEA] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-[#787878]">@{profile.username}</p>
            <h1 className="mt-2 text-4xl leading-none tracking-tight lg:text-6xl">
              Settings
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${profile.username}/edit`}
              className="flex h-10 items-center gap-2 rounded-lg border border-[#EAEAEA] px-4 text-sm hover:bg-[#F7F7F7]"
            >
              <ExternalLink size={16} />
              Edit profile
            </Link>
            <Link
              href="/premium"
              className={cn(
                "flex h-10 items-center gap-2 rounded-lg px-4 text-sm",
                isPremium
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "bg-[#FF98FB] text-black hover:bg-[#ff83fa]"
              )}
            >
              <Crown size={16} />
              {isPremium ? "Premium active" : "Upgrade"}
            </Link>
          </div>
        </div>

        <SettingsSection
          title="Account"
          description="The basic identity used by your Spotlight login."
          icon={<UserRound size={20} />}
        >
          <Form
            className="grid w-full gap-4 lg:grid-cols-[1fr_auto]"
            onSubmit={identityForm.handleSubmit(onIdentitySubmit)}
          >
            <MyInput
              label="Account name"
              {...identityForm.register("name")}
              isInvalid={!!identityForm.formState.errors.name}
              errorMessage={identityForm.formState.errors.name?.message}
              autoComplete="name"
            />
            <div className="lg:self-end">
              <SubmitButton loading={identityState.loading}>
                Save name
              </SubmitButton>
            </div>
          </Form>
          <StatusMessage state={identityState} />
        </SettingsSection>

        <SettingsSection
          title="Email"
          description="Change the email address you use to sign in."
          icon={<Mail size={20} />}
        >
          <Form
            className="grid w-full gap-4 lg:grid-cols-[1fr_auto]"
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          >
            <MyInput
              label="Email address"
              {...emailForm.register("email")}
              isInvalid={!!emailForm.formState.errors.email}
              errorMessage={emailForm.formState.errors.email?.message}
              autoComplete="email"
            />
            <div className="lg:self-end">
              <SubmitButton loading={emailState.loading}>
                Send code
              </SubmitButton>
            </div>
          </Form>
          {pendingEmail && (
            <Form
              className="mt-4 grid w-full gap-4 lg:grid-cols-[1fr_auto]"
              onSubmit={emailOtpForm.handleSubmit(onEmailOtpSubmit)}
            >
              <MyInput
                label="Verification code"
                {...emailOtpForm.register("code")}
                isInvalid={!!emailOtpForm.formState.errors.code}
                errorMessage={emailOtpForm.formState.errors.code?.message}
                autoComplete="one-time-code"
                inputMode="numeric"
              />
              <div className="lg:self-end">
                <SubmitButton loading={emailState.loading}>
                  Verify email
                </SubmitButton>
              </div>
            </Form>
          )}
          <StatusMessage state={emailState} />
        </SettingsSection>

        <SettingsSection
          title="Password"
          description="Update your password and clear other active sessions."
          icon={<KeyRound size={20} />}
        >
          <Form
            className="grid w-full gap-4"
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <MyInput
                label="Current password"
                type="password"
                {...passwordForm.register("currentPassword")}
                isInvalid={!!passwordForm.formState.errors.currentPassword}
                errorMessage={
                  passwordForm.formState.errors.currentPassword?.message
                }
                autoComplete="current-password"
              />
              <MyInput
                label="New password"
                type="password"
                {...passwordForm.register("newPassword")}
                isInvalid={!!passwordForm.formState.errors.newPassword}
                errorMessage={
                  passwordForm.formState.errors.newPassword?.message
                }
                autoComplete="new-password"
              />
              <MyInput
                label="Confirm password"
                type="password"
                {...passwordForm.register("confirmPassword")}
                isInvalid={!!passwordForm.formState.errors.confirmPassword}
                errorMessage={
                  passwordForm.formState.errors.confirmPassword?.message
                }
                autoComplete="new-password"
              />
            </div>
            <div>
              <SubmitButton loading={passwordState.loading}>
                Change password
              </SubmitButton>
            </div>
          </Form>
          <StatusMessage state={passwordState} />
        </SettingsSection>

        <SettingsSection
          title="Security"
          description="Review where this account is currently signed in."
          icon={<ShieldCheck size={20} />}
        >
          <div className="space-y-3">
            {sessionsState.loading && authSessions.length === 0 ? (
              <div className="flex h-16 items-center text-sm text-[#787878]">
                <Spinner size="sm" />
                <span className="ml-3">Loading sessions...</span>
              </div>
            ) : authSessions.length > 0 ? (
              authSessions.map((authSession) => {
                const isCurrent = authSession.id === currentSessionId
                return (
                  <div
                    key={authSession.id}
                    className="flex flex-col gap-3 rounded-lg border border-[#EAEAEA] p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-[#F5F5F5]">
                        <Laptop size={18} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">
                            {deviceName(authSession.userAgent)}
                          </p>
                          {isCurrent && (
                            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
                              <CheckCircle2 size={12} />
                              Current
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-[#787878]">
                          {authSession.ipAddress || "Unknown location"} -
                          Created {formatDate(authSession.createdAt)}
                        </p>
                      </div>
                    </div>
                    {!isCurrent && (
                      <button
                        type="button"
                        disabled={sessionsState.loading}
                        onClick={() => revokeSession(authSession.token)}
                        className="h-10 rounded-lg border border-[#EAEAEA] px-4 text-sm text-[#FA5A59] hover:bg-[#FFF4F4] disabled:opacity-60"
                      >
                        Sign out
                      </button>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-[#787878]">
                No active sessions found.
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={sessionsState.loading}
              onClick={revokeOtherSessions}
              className="h-10 rounded-lg border border-[#EAEAEA] px-4 text-sm hover:bg-[#F7F7F7] disabled:opacity-60"
            >
              Sign out other sessions
            </button>
            <button
              type="button"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/"
                    },
                  },
                })
              }
              className="flex h-10 items-center gap-2 rounded-lg bg-black px-4 text-sm text-white hover:bg-[#1E1E1E]"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
          <StatusMessage state={sessionsState} />
        </SettingsSection>
      </div>
    </main>
  )
}
