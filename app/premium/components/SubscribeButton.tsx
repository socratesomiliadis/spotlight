"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

import CustomButton from "@/components/custom-button"

export function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CustomButton
      text={isLoading ? "Loading..." : "Subscribe"}
      className="text-[#1e1e1e] bg-[#FF98FB] disabled:opacity-50"
      onClick={handleSubscribe}
      disabled={isLoading}
    />
  )
}
