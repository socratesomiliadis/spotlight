"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { code, Form, InputOtp, Spinner } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"

import { Eye, EyeClosed } from "../icons"
import MyInput from "./components/Input"

// Define validation schemas
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
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
  const [auth, setAuth] = useQueryState("auth")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { isLoaded, signIn, setActive } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"email" | "reset">("email")
  const [email, setEmail] = useState("")
  const router = useRouter()

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  })

  const onEmailSubmit = async (data: EmailFormValues) => {
    if (!isLoaded) return
    setIsLoading(true)
    setError(null)

    try {
      // Start the password reset process
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      })

      setEmail(data.email)
      setStep("reset")
      setSuccessMessage(`Reset code sent to ${data.email}`)
    } catch (err: any) {
      console.error(
        "Error sending reset email:",
        err.errors?.[0]?.longMessage || err
      )
      setError(err.errors?.[0]?.longMessage || "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  const onResetSubmit = async (data: ResetFormValues) => {
    if (!isLoaded) return
    setIsLoading(true)
    setError(null)

    try {
      // Attempt to reset the password
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      })

      // Check if 2FA is required
      if (result?.status === "needs_second_factor") {
        setError("2FA is required, but this UI does not handle that")
        setIsLoading(false)
        return
      }

      // If the reset is complete, set the session as active
      if (result?.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/")
      } else {
        setError("Password reset failed. Please try again.")
      }
    } catch (err: any) {
      console.error(
        "Error resetting password:",
        err.errors?.[0]?.longMessage || err
      )
      setError(err.errors?.[0]?.longMessage || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setError(null)
    setSuccessMessage(null)
    resetForm.reset()
  }

  return (
    <motion.div
      key="reset-password-form"
      exit={{ opacity: 0, x: -100 }}
      className="w-full flex items-center justify-center"
    >
      {step === "email" ? (
        <Form
          className="w-full lg:w-[90%] py-6 lg:py-0"
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

          <p className="text-sm text-black lg:mt-4 tracking-tight">
            Remember your password?{" "}
            <button className="underline" onClick={() => setAuth("sign-in")}>
              Sign in
            </button>
          </p>
        </Form>
      ) : (
        <Form
          className="w-full lg:w-[90%] relative py-6 lg:py-0"
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
                className="focus:outline-none w-6 pt-1 h-full flex items-center justify-center overflow-hidden text-[#BFBFBF]"
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
                className="focus:outline-none w-6 pt-1 h-full flex items-center justify-center overflow-hidden text-[#BFBFBF]"
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

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

          <div className="flex flex-col gap-2 lg:mt-4">
            <p className="text-sm text-black tracking-tight">
              Remember your password?{" "}
              <button className="underline" onClick={() => setAuth("sign-in")}>
                Sign in
              </button>
            </p>
          </div>
        </Form>
      )}
    </motion.div>
  )
}
