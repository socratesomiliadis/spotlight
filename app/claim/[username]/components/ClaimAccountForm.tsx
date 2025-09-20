"use client"

import { useState } from "react"
import Image from "next/image"
import { Tables } from "@/database.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { sendClaimEmail } from "@/lib/supabase/actions/claim"
import CustomButton from "@/components/custom-button"
import MyInput from "@/components/Forms/components/Input"

const claimSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ClaimFormValues = z.infer<typeof claimSchema>

interface ClaimAccountFormProps {
  user: Tables<"profile">
}

export default function ClaimAccountForm({ user }: ClaimAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      email: "",
    },
  })

  const emailValue = watch("email")

  const onSubmit = async (data: ClaimFormValues) => {
    if (data.email !== user.email) {
      setError("Email address does not match the account email")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await sendClaimEmail(data.email, user.username)

      if (result.success) {
        setEmailSent(true)
        toast.success("Claim initiated! Follow the instructions below.")
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send claim email"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Ready to Claim Your Account
          </h1>
          <p className="text-gray-600">
            We&apos;ve verified your email address:{" "}
            <span className="font-medium">{emailValue}</span>
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
          <h3 className="font-medium text-blue-900 mb-2">
            Complete Your Claim:
          </h3>
          <ol className="text-blue-800 text-sm space-y-2 list-decimal list-inside">
            <li>
              Go to the <strong>Sign In</strong> page
            </li>
            <li>
              Click <strong>&quot;Forgot Password&quot;</strong>
            </li>
            <li>
              Enter your email: <strong>{emailValue}</strong>
            </li>
            <li>Check your email for the password reset link</li>
            <li>Set a new password to complete the claim</li>
            <li>
              You&apos;ll be automatically signed in to your claimed account!
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <CustomButton
            text="Go to Sign In"
            href="/sign-in"
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            <CustomButton
              text="Open Email"
              onClick={() => window.open("mailto:", "_blank")}
              inverted
              className="text-sm"
            />
            <CustomButton
              text="Back to Profile"
              href={`/${user.username}`}
              inverted
              className="text-sm"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Didn&apos;t receive the email?{" "}
          <button
            onClick={() => {
              setEmailSent(false)
              setError(null)
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex  justify-center">
          <div className="relative">
            <Image
              src={user.avatar_url || ""}
              alt={user.display_name || user.username}
              width={80}
              height={80}
              className="rounded-xl aspect-square object-cover"
            />
            <div className="absolute -top-4 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
              Unclaimed
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Claim @{user.username}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.display_name && user.display_name !== user.username
              ? user.display_name
              : "This account appears to be unclaimed"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <MyInput
            {...register("email")}
            label="Email Address"
            type="email"
            isInvalid={!!errors.email || !!error}
            errorMessage={errors.email?.message || error || undefined}
            description="Enter the email address associated with this account"
            placeholder="your.email@example.com"
          />
        </div>

        <CustomButton
          text="Send Claim Email"
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        />
      </form>

      {/* Info */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">How claiming works:</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>
            • We&apos;ll verify you have access to the account&apos;s email
          </li>
          <li>• You&apos;ll receive a secure password reset link</li>
          <li>• Set a new password to complete the claim</li>
          <li>• The account will then be fully yours!</li>
        </ul>
      </div>

      {/* Back link */}
      <div className="text-center">
        <CustomButton
          text="← Back to Profile"
          href={`/${user.username}`}
          inverted
          className="text-sm"
        />
      </div>
    </div>
  )
}
