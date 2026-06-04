"use client"

import { useState } from "react"
import { Form, Spinner } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { Eye, EyeClosed } from "../icons"
import MyInput from "./components/Input"
import SignUpVerify from "./sign-up-verify"

const signUpSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUpForm() {
  const [, setAuth] = useQueryState("auth")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingUser, setPendingUser] = useState<SignUpFormValues | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: "", username: "", email: "", password: "" },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await (authClient as any).signUp.email({
        name: data.displayName,
        username: data.username,
        email: data.email,
        password: data.password,
        callbackURL: "/welcome",
      })
      if (response?.error) throw new Error(response.error.message)
      setPendingUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (pendingUser) {
    return <SignUpVerify pendingUser={pendingUser} />
  }

  return (
    <motion.div
      key="sign-up-form"
      exit={{ opacity: 0, x: -100 }}
      className="w-full flex items-center justify-center px-2 lg:px-0 py-4 lg:py-0"
    >
      <Form className="w-full lg:w-[90%]" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl lg:text-4xl tracking-tight mb-4 lg:mb-8">
          Create your account to
          <br />
          unleash your dreams.
        </h1>
        <MyInput
          label="Display Name"
          {...register("displayName")}
          isInvalid={!!errors.displayName}
          errorMessage={errors.displayName?.message}
          autoComplete="name"
        />
        <MyInput
          label="Username"
          {...register("username")}
          isInvalid={!!errors.username}
          errorMessage={errors.username?.message}
          autoComplete="username"
        />
        <MyInput
          label="Email Address"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          autoComplete="email"
        />
        <MyInput
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
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
        <button
          type="submit"
          className="w-full mt-4 py-3 px-4 bg-black text-white rounded-xl flex items-center justify-center"
        >
          {isLoading && (
            <Spinner className="absolute" color="white" size="sm" />
          )}
          <span className={cn("-mb-1", isLoading && "opacity-0")}>Sign Up</span>
        </button>
        {error && <p className="text-danger">{error}</p>}
        <p className="text-sm text-[#787878] lg:mt-4 tracking-tight">
          Already have an account?{" "}
          <button className="underline" onClick={() => setAuth("sign-in")}>
            Sign in
          </button>
        </p>
      </Form>
    </motion.div>
  )
}
