import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { getProfile } from "@/lib/supabase/actions/profile"
import CustomButton from "@/components/custom-button"
import PageWrapper from "@/components/page-wrapper"

interface ClaimSuccessPageProps {
  params: Promise<{ username: string }>
}

export default async function ClaimSuccessPage({
  params,
}: ClaimSuccessPageProps) {
  const { username } = await params
  const { userId } = await auth()

  // Get the user profile
  let user
  try {
    user = await getProfile(username)
  } catch (error) {
    notFound()
  }

  if (!user) {
    notFound()
  }

  // If the account is still unclaimed, redirect to claim page
  if (user.is_unclaimed) {
    redirect(`/claim/${username}`)
  }

  // If user is signed in and it's their profile, redirect to profile
  if (userId === user.user_id) {
    redirect(`/${username}`)
  }

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-green-600"
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

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            Account Claimed Successfully!
          </h1>
          <p className="text-gray-600">
            @{username} has been successfully claimed and is no longer available
            for claiming.
          </p>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-left">
          <h3 className="font-medium text-green-900 mb-2">What happened:</h3>
          <ul className="text-green-800 text-sm space-y-1">
            <li>• The account password was successfully set</li>
            <li>• The account is now marked as claimed</li>
            <li>• The owner can now sign in and manage their profile</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <CustomButton
            text="View Profile"
            href={`/${username}`}
            className="w-full"
          />
          <CustomButton
            text="Go to Homepage"
            href="/"
            inverted
            className="w-full"
          />
        </div>
      </div>
    </PageWrapper>
  )
}

export async function generateMetadata({ params }: ClaimSuccessPageProps) {
  const { username } = await params

  return {
    title: `@${username} Claimed | Spotlight`,
    description: `The account @${username} has been successfully claimed on Spotlight`,
  }
}
