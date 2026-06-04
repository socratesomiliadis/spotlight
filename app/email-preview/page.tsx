import { notFound } from "next/navigation"

import { emailPreviewSamples } from "@/lib/email-templates"

export const metadata = {
  title: "Email previews - Spotlight",
  robots: "noindex, nofollow",
}

function canPreviewEmails() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.EMAIL_PREVIEW_ENABLED === "true"
  )
}

export default function EmailPreviewPage() {
  if (!canPreviewEmails()) {
    notFound()
  }

  return (
    <main className="fixed inset-0 z-[1000] min-h-screen overflow-y-auto bg-[#f6f6f6] px-4 py-8 text-black lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Email previews
          </h1>
          <p className="max-w-2xl text-sm text-[#6b6b6b]">
            These are static previews of every email template currently wired to
            the backend auth email sender.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {emailPreviewSamples.map((email) => (
            <section
              key={email.id}
              className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white"
            >
              <div className="border-b border-[#eaeaea] px-4 py-3">
                <h2 className="text-base font-semibold">{email.label}</h2>
                <p className="mt-1 text-sm text-[#6b6b6b]">{email.subject}</p>
              </div>
              <iframe
                title={email.label}
                srcDoc={email.html}
                className="h-[680px] w-full bg-white"
                sandbox=""
              />
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
