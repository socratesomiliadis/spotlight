import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { isUserPremium } from "@/lib/supabase/actions/subscriptions"
import CustomButton from "@/components/custom-button"
import PageWrapper from "@/components/page-wrapper"

async function SuccessContent() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const isPremium = await isUserPremium(userId)

  if (!isPremium) {
    redirect("/premium")
  }

  return (
    <PageWrapper
      wrapperClassName="h-svh py-20 overflow-hidden lg:py-0 flex items-center justify-center"
      className="w-full h-fit lg:h-auto flex flex-col items-center justify-center p-7"
    >
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
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

          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome to Premium!
          </h1>

          <p className="text-[#ACACAC] leading-relaxed">
            Your subscription is now active. You now have access to all premium
            features and can enjoy the full Spotlight experience.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/dashboard">
            <CustomButton
              text="Go to Dashboard"
              className="w-full text-white bg-black"
            />
          </Link>

          <Link href="/">
            <CustomButton
              text="Explore Spotlight"
              className="w-full text-black bg-[#FF98FB]"
            />
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <PageWrapper
          wrapperClassName="h-svh py-20 overflow-hidden lg:py-0 flex items-center justify-center"
          className="w-full h-fit lg:h-auto flex flex-col items-center justify-center p-7"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-[#ACACAC]">Processing your subscription...</p>
          </div>
        </PageWrapper>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
