import { UserProfile } from "@clerk/nextjs"

import PageWrapper from "@/components/page-wrapper"

export default function SettingsPage() {
  return (
    <PageWrapper
      wrapperClassName="h-[100svh] py-20 overflow-hidden lg:py-0 flex items-center justify-center"
      className="w-full h-full flex items-center justify-center pb-0 lg:-mt-16"
    >
      <div data-lenis-prevent className="w-full h-full">
        <UserProfile
          path="/settings"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none border-none",
              navbar: "bg-none",
              scrollBox: "rounded-none",
              profileSection__profile: "hidden",
            },
          }}
        />
      </div>
    </PageWrapper>
  )
}
