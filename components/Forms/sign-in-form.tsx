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

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { Eye, EyeClosed } from "../icons"
import MyInput from "./components/Input"

const signInSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignInForm() {
  const [, setAuth] = useQueryState("auth")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAwaitingConvexAuth, setIsAwaitingConvexAuth] = useState(false)
  const postSignInStarted = useRef(false)
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const ensureCurrent = useMutation(api.profiles.ensureCurrent)
  const claimCurrent = useMutation(api.profiles.claimCurrent)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { emailOrUsername: "", password: "" },
  })

  useEffect(() => {
    if (
      !isAwaitingConvexAuth ||
      isAuthLoading ||
      !isAuthenticated ||
      postSignInStarted.current
    ) {
      return
    }

    postSignInStarted.current = true
    void (async () => {
      try {
        const profile = await ensureCurrent({})
        if (profile.isUnclaimed) {
          await claimCurrent()
        }
        setAuth(null)
        router.refresh()
      } catch (err) {
        postSignInStarted.current = false
        setIsAwaitingConvexAuth(false)
        setError(err instanceof Error ? err.message : "Sign in failed")
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
  ])

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true)
    postSignInStarted.current = false
    setIsAwaitingConvexAuth(false)
    setError(null)
    try {
      const payload = { password: data.password, callbackURL: "/" }
      const response = data.emailOrUsername.includes("@")
        ? await (authClient as any).signIn.email({
            ...payload,
            email: data.emailOrUsername,
          })
        : await (authClient as any).signIn.username({
            ...payload,
            username: data.emailOrUsername,
          })
      if (response?.error) throw new Error(response.error.message)
      await authClient.getSession({ fetchOptions: { throw: false } })
      setIsAwaitingConvexAuth(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key="sign-in-form"
      exit={{ opacity: 0, x: -100 }}
      className="w-full flex items-center justify-center px-2 lg:px-0 py-4 lg:py-0"
    >
      <Form className="w-full lg:w-[90%]" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl lg:text-4xl tracking-tight mb-4 lg:mb-8">
          Sign in to your account
        </h1>
        <MyInput
          label="Email or Username"
          {...register("emailOrUsername")}
          isInvalid={!!errors.emailOrUsername}
          errorMessage={errors.emailOrUsername?.message}
          autoComplete="username"
        />
        <MyInput
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          autoComplete="password"
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
        <p className="text-sm text-[#787878] mt-0 tracking-tight">
          Forgot your password?{" "}
          <button
            type="button"
            className="underline"
            onClick={() => setAuth("reset-password")}
          >
            Reset password
          </button>
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 lg:mt-4 py-3 px-4 bg-black text-white rounded-xl flex items-center justify-center"
        >
          {isLoading && (
            <Spinner className="absolute" color="white" size="sm" />
          )}
          <span className={cn("-mb-1", isLoading && "opacity-0")}>Sign In</span>
        </button>
        {error && <p className="text-danger">{error}</p>}
        <p className="text-sm text-[#787878] lg:mt-4 tracking-tight">
          Don&apos;t have an account?{" "}
          <button className="underline" onClick={() => setAuth("sign-up")}>
            Sign up
          </button>
        </p>
      </Form>
    </motion.div>
  )
}
