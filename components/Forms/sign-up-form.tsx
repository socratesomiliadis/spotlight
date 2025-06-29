"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { Form, Spinner } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"

import { Eye, EyeClosed } from "../icons"
import MyInput from "./components/Input"
import SignUpVerify from "./sign-up-verify"

// Define validation schema with Zod
const signUpSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUpForm() {
  const [auth, setAuth] = useQueryState("auth")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isLoaded, signUp, setActive } = useSignUp()
  const [isLoading, setIsLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    if (!isLoaded) return
    setIsLoading(true)
    const firstName = data.displayName.split(" ")[0]
    const lastName = data.displayName.split(" ")[1] || ""
    try {
      await signUp.create({
        firstName,
        lastName,
        username: data.username,
        emailAddress: data.email,
        password: data.password,
      })

      // Handle successful sign-up (e.g., redirect)
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      })

      setVerifying(true)
    } catch (error) {
      console.log("Error signing up:", error)
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  if (verifying) {
    return <SignUpVerify />
  }

  return (
    <motion.div
      key="sign-up-form"
      exit={{ opacity: 0, x: -100 }}
      className="w-full flex items-center justify-center"
    >
      <Form
        className="w-full lg:w-[90%] py-6 lg:py-0"
        onSubmit={handleSubmit(onSubmit)}
      >
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
              className="focus:outline-none w-6 pt-1 h-full flex items-center justify-center overflow-hidden text-[#BFBFBF]"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeClosed /> : <Eye />}
            </button>
          }
        />

        <div id="clerk-captcha" />
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
        <p className="text-sm text-black lg:mt-4 tracking-tight">
          Already have an account?{" "}
          <button className="underline" onClick={() => setAuth("sign-in")}>
            Sign in
          </button>
        </p>
      </Form>
    </motion.div>
  )
}
