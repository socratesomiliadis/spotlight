"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useConvexAuth, useMutation } from "convex/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { OTP_COOLDOWN_SECONDS, authErrorMessage } from "@/lib/auth-flow"
import { authClient } from "@/lib/auth-client"
import type { ProfileView } from "@/lib/spotlight-types"
import { useCooldown } from "@/hooks/useCooldown"
import CustomButton from "@/components/custom-button"
import MyInput from "@/components/Forms/components/Input"

const claimEmailSchema = z.object({
  email: z.email("Please enter a valid email address"),
})

const claimResetSchema = z
  .object({
    code: z.string().min(6, "Reset code must be at least 6 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ClaimEmailValues = z.infer<typeof claimEmailSchema>
type ClaimResetValues = z.infer<typeof claimResetSchema>

interface ClaimAccountFormProps {
  user: ProfileView
}

export default function ClaimAccountForm({ user }: ClaimAccountFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "reset">("email")
  const [claimEmail, setClaimEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAwaitingConvexAuth, setIsAwaitingConvexAuth] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const postClaimStarted = useRef(false)
  const claimCooldown = useCooldown(OTP_COOLDOWN_SECONDS)
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const ensureCurrent = useMutation(api.profiles.ensureCurrent)
  const claimCurrent = useMutation(api.profiles.claimCurrent)

  const emailForm = useForm<ClaimEmailValues>({
    resolver: zodResolver(claimEmailSchema),
    defaultValues: {
      email: "",
    },
  })
  const resetForm = useForm<ClaimResetValues>({
    resolver: zodResolver(claimResetSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (
      !isAwaitingConvexAuth ||
      isAuthLoading ||
      !isAuthenticated ||
      postClaimStarted.current
    ) {
      return
    }

    postClaimStarted.current = true
    void (async () => {
      try {
        await ensureCurrent({})
        await claimCurrent()
        toast.success("Account claimed successfully.")
        router.refresh()
        router.push(`/${user.username}`)
      } catch (err) {
        postClaimStarted.current = false
        setIsAwaitingConvexAuth(false)
        setError(authErrorMessage(err, "Failed to claim account"))
      } finally {
        setIsLoading(false)
      }
    })()
  }, [
    claimCurrent,
    ensureCurrent,
    isAuthenticated,
    isAuthLoading,
    isAwaitingConvexAuth,
    router,
    user.username,
  ])

  const onEmailSubmit = async (data: ClaimEmailValues) => {
    const normalizedEmail = data.email.trim().toLowerCase()
    if (normalizedEmail !== user.email.trim().toLowerCase()) {
      setError("Email address does not match the account email")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const result = await (authClient as any).emailOtp.requestPasswordReset({
        email: normalizedEmail,
      })
      if (result?.error) throw new Error(result.error.message)
      setClaimEmail(normalizedEmail)
      setStep("reset")
      setSuccessMessage(`Reset code sent to ${normalizedEmail}.`)
      claimCooldown.start()
      toast.success("Claim code sent.")
    } catch (err) {
      const message = authErrorMessage(err, "Failed to send claim code")
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const resendClaimCode = async () => {
    if (!claimEmail || claimCooldown.isCoolingDown) return
    setError(null)
    try {
      const result = await (authClient as any).emailOtp.requestPasswordReset({
        email: claimEmail,
      })
      if (result?.error) throw new Error(result.error.message)
      setSuccessMessage(`Reset code sent to ${claimEmail}.`)
      claimCooldown.start()
      toast.success("Claim code resent.")
    } catch (err) {
      const message = authErrorMessage(err, "Failed to resend claim code")
      setError(message)
      toast.error(message)
    }
  }

  const onResetSubmit = async (data: ClaimResetValues) => {
    setIsLoading(true)
    postClaimStarted.current = false
    setIsAwaitingConvexAuth(false)
    setError(null)

    try {
      const resetResponse = await (authClient as any).emailOtp.resetPassword({
        email: claimEmail,
        otp: data.code,
        password: data.password,
      })
      if (resetResponse?.error) throw new Error(resetResponse.error.message)

      const signInResponse = await (authClient as any).signIn.email({
        email: claimEmail,
        password: data.password,
        callbackURL: `/${user.username}`,
      })
      if (signInResponse?.error) throw new Error(signInResponse.error.message)

      await authClient.getSession({ fetchOptions: { throw: false } })
      setIsAwaitingConvexAuth(true)
    } catch (err) {
      const message = authErrorMessage(err, "Failed to complete claim")
      setError(message)
      toast.error(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <Image
              src={user.avatar_url || "/logo.png"}
              alt={user.display_name || user.username}
              width={80}
              height={80}
              className="aspect-square rounded-xl object-cover"
            />
            <div className="absolute -top-4 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
              Unclaimed
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Claim @{user.username}
          </h1>
          <p className="mt-1 text-gray-600">
            {user.display_name && user.display_name !== user.username
              ? user.display_name
              : "This account appears to be unclaimed"}
          </p>
        </div>
      </div>

      {step === "email" ? (
        <form
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          className="space-y-4"
        >
          <MyInput
            {...emailForm.register("email")}
            label="Email Address"
            type="email"
            isInvalid={!!emailForm.formState.errors.email || !!error}
            errorMessage={
              emailForm.formState.errors.email?.message || error || undefined
            }
            description="Enter the email address associated with this account"
            placeholder="your.email@example.com"
          />

          <CustomButton
            text="Send Claim Code"
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          />
        </form>
      ) : (
        <form
          onSubmit={resetForm.handleSubmit(onResetSubmit)}
          className="space-y-4"
        >
          {successMessage && (
            <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </p>
          )}
          <MyInput
            {...resetForm.register("code")}
            label="Claim Code"
            isInvalid={!!resetForm.formState.errors.code}
            errorMessage={resetForm.formState.errors.code?.message}
            autoComplete="one-time-code"
            inputMode="numeric"
          />
          <MyInput
            {...resetForm.register("password")}
            label="New Password"
            type="password"
            isInvalid={!!resetForm.formState.errors.password}
            errorMessage={resetForm.formState.errors.password?.message}
            autoComplete="new-password"
          />
          <MyInput
            {...resetForm.register("confirmPassword")}
            label="Confirm New Password"
            type="password"
            isInvalid={!!resetForm.formState.errors.confirmPassword}
            errorMessage={resetForm.formState.errors.confirmPassword?.message}
            autoComplete="new-password"
          />
          <CustomButton
            text="Complete Claim"
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          />
          <button
            type="button"
            disabled={isLoading || claimCooldown.isCoolingDown}
            onClick={resendClaimCode}
            className="w-full text-sm font-medium text-gray-600 underline disabled:no-underline disabled:opacity-60"
          >
            {claimCooldown.isCoolingDown
              ? `Resend code in ${claimCooldown.remaining}s`
              : "Resend code"}
          </button>
          <button
            type="button"
            className="w-full text-sm font-medium text-gray-600 underline"
            onClick={() => {
              setStep("email")
              setError(null)
              setSuccessMessage(null)
            }}
          >
            Use a different email
          </button>
        </form>
      )}

      {error && step === "reset" && (
        <p className="text-sm text-[#FA5A59]">{error}</p>
      )}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 font-medium text-gray-900">How claiming works:</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>Enter the email attached to this account.</li>
          <li>Use the claim code to set your password.</li>
          <li>We will sign you in and mark the account as claimed.</li>
        </ul>
      </div>

      <div className="text-center">
        <CustomButton
          text="Back to Profile"
          href={`/${user.username}`}
          inverted
          className="text-sm"
        />
      </div>
    </div>
  )
}
