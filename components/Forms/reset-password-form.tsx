"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Form, Spinner } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useConvexAuth, useMutation } from "convex/react"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  OTP_COOLDOWN_SECONDS,
  authErrorMessage,
  safeReturnTo,
} from "@/lib/auth-flow"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { useCooldown } from "@/hooks/useCooldown"

import { Eye, EyeClosed } from "../icons"
import MyInput from "./components/Input"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    code: z.string().min(6, "Reset code must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type EmailFormValues = z.infer<typeof emailSchema>
type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordForm() {
  const [, setAuth] = useQueryState("auth")
  const [returnTo, setReturnTo] = useQueryState("returnTo")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAwaitingConvexAuth, setIsAwaitingConvexAuth] = useState(false)
  const [step, setStep] = useState<"email" | "reset">("email")
  const [email, setEmail] = useState("")
  const postResetStarted = useRef(false)
  const resetCooldown = useCooldown(OTP_COOLDOWN_SECONDS)
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const ensureCurrent = useMutation(api.profiles.ensureCurrent)
  const claimCurrent = useMutation(api.profiles.claimCurrent)
  const router = useRouter()

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  })
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "", code: "" },
  })

  useEffect(() => {
    if (
      !isAwaitingConvexAuth ||
      isAuthLoading ||
      !isAuthenticated ||
      postResetStarted.current
    ) {
      return
    }

    postResetStarted.current = true
    void (async () => {
      try {
        const profile = await ensureCurrent({})
        if (profile.isUnclaimed) {
          await claimCurrent()
        }
        setAuth(null)
        setReturnTo(null)
        router.refresh()
        router.push(safeReturnTo(returnTo))
      } catch (err) {
        postResetStarted.current = false
        setIsAwaitingConvexAuth(false)
        setError(authErrorMessage(err, "Failed to reset password"))
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
    setAuth,
    setReturnTo,
    returnTo,
  ])

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await (authClient as any).emailOtp.requestPasswordReset({
        email: data.email,
      })
      if (response?.error) throw new Error(response.error.message)
      setEmail(data.email)
      setStep("reset")
      setSuccessMessage(`Reset code sent to ${data.email}`)
      resetCooldown.start()
    } catch (err) {
      setError(authErrorMessage(err, "Failed to send reset email"))
    } finally {
      setIsLoading(false)
    }
  }

  const resendResetCode = async () => {
    if (!email || resetCooldown.isCoolingDown) return
    setError(null)
    try {
      const response = await (authClient as any).emailOtp.requestPasswordReset({
        email,
      })
      if (response?.error) throw new Error(response.error.message)
      setSuccessMessage(`Reset code sent to ${email}`)
      resetCooldown.start()
    } catch (err) {
      setError(authErrorMessage(err, "Failed to resend reset code"))
    }
  }

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true)
    postResetStarted.current = false
    setIsAwaitingConvexAuth(false)
    setError(null)
    try {
      const response = await (authClient as any).emailOtp.resetPassword({
        email,
        otp: data.code,
        password: data.password,
      })
      if (response?.error) throw new Error(response.error.message)
      const signInResponse = await (authClient as any).signIn.email({
        email,
        password: data.password,
        callbackURL: "/",
      })
      if (signInResponse?.error) throw new Error(signInResponse.error.message)
      await authClient.getSession({ fetchOptions: { throw: false } })
      setIsAwaitingConvexAuth(true)
    } catch (err) {
      setError(authErrorMessage(err, "Failed to reset password"))
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key="reset-password-form"
      exit={{ opacity: 0, x: -100 }}
      className="w-full flex items-center justify-center px-2 lg:px-0 py-4 lg:py-0"
    >
      {step === "email" ? (
        <Form
          className="w-full lg:w-[90%]"
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        >
          <h1 className="text-3xl lg:text-4xl tracking-tight">
            Reset your password
          </h1>
          <p className="text-[#acacac] mb-4 lg:mb-8">
            Enter your email address and we&apos;ll send you a reset code.
          </p>
          <MyInput
            label="Email Address"
            {...emailForm.register("email")}
            isInvalid={!!emailForm.formState.errors.email}
            errorMessage={emailForm.formState.errors.email?.message}
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-3 px-4 bg-black text-white rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            {isLoading && (
              <Spinner className="absolute" color="white" size="sm" />
            )}
            <span className={cn("", isLoading && "opacity-0")}>
              Send Reset Code
            </span>
          </button>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
          <p className="text-sm text-[#787878] lg:mt-4 tracking-tight">
            Remember your password?{" "}
            <button
              type="button"
              className="underline"
              onClick={() => setAuth("sign-in")}
            >
              Sign in
            </button>
          </p>
        </Form>
      ) : (
        <Form
          className="w-full lg:w-[90%] relative"
          onSubmit={resetForm.handleSubmit(onResetSubmit)}
        >
          <h1 className="text-3xl lg:text-4xl tracking-tight lg:mb-4">
            Enter new password
          </h1>
          <p className="text-gray-600 mb-4 lg:mb-8">
            Enter the code sent to {email} and your new password.
          </p>
          {successMessage && (
            <div className="mb-4 p-3 absolute -bottom-[20%] bg-green-100 border border-green-400 text-green-700 rounded-xl">
              {successMessage}
            </div>
          )}
          <MyInput
            label="Reset Code"
            {...resetForm.register("code")}
            isInvalid={!!resetForm.formState.errors.code}
            errorMessage={resetForm.formState.errors.code?.message}
            autoComplete="one-time-code"
            inputMode="numeric"
          />
          <MyInput
            label="New Password"
            type={showPassword ? "text" : "password"}
            {...resetForm.register("password")}
            isInvalid={!!resetForm.formState.errors.password}
            errorMessage={resetForm.formState.errors.password?.message}
            autoComplete="new-password"
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-hidden w-6 pt-1 h-full flex items-center justify-center overflow-hidden text-[#BFBFBF]"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            }
          />
          <MyInput
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            {...resetForm.register("confirmPassword")}
            isInvalid={!!resetForm.formState.errors.confirmPassword}
            errorMessage={resetForm.formState.errors.confirmPassword?.message}
            autoComplete="new-password"
            endContent={
              <button
                aria-label="toggle confirm password visibility"
                className="focus:outline-hidden w-6 pt-1 h-full flex items-center justify-center overflow-hidden text-[#BFBFBF]"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeClosed /> : <Eye />}
              </button>
            }
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 px-4 bg-black text-white rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            {isLoading && (
              <Spinner className="absolute" color="white" size="sm" />
            )}
            <span className={cn("-mb-1", isLoading && "opacity-0")}>
              Reset Password
            </span>
          </button>
          <button
            type="button"
            disabled={isLoading || resetCooldown.isCoolingDown}
            onClick={resendResetCode}
            className="w-full text-sm text-[#787878] underline disabled:no-underline disabled:opacity-60"
          >
            {resetCooldown.isCoolingDown
              ? `Resend code in ${resetCooldown.remaining}s`
              : "Resend code"}
          </button>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </Form>
      )}
    </motion.div>
  )
}
