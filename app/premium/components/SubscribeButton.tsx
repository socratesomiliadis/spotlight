"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import CustomButton from "@/components/custom-button"

export function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = authClient.useSession()
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!session) {
      router.push("/?auth=sign-in")
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
