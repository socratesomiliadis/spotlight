import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { api } from "@/convex/_generated/api"

import { signInUrl } from "@/lib/auth-flow"
import { fetchAuthQuery } from "@/lib/auth-server"
import { hasStaffAccess } from "@/lib/roles"
import { privateRobots } from "@/lib/seo"
import PageWrapper from "@/components/page-wrapper"

export const metadata: Metadata = {
  title: "Staff Guide - Spotlight",
  description: "Internal Spotlight staff guide for submissions and awards.",
  robots: privateRobots,
}

const emailSources = [
  "The creator's personal website, portfolio, or agency website",
  "Contact, About, Press, or Team pages",
  "The footer of the project website",
  "GitHub profile, README, or repository commit/contact info",
  "LinkedIn, X/Twitter, Instagram, Behance, Dribbble, Product Hunt, or other public profile links",
  "Public WHOIS/business records only when the email is intentionally listed for contact",
  "Newsletter, press kit, media kit, or launch announcement",
]

const helpfulLinks = [
  {
    label: "Google",
    href: "https://www.google.com",
    note: 'Search the project name, creator name, company name, and "contact".',
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    note: "Check creator and company profiles.",
  },
  {
    label: "X/Twitter",
    href: "https://x.com",
    note: "Check bios, pinned posts, and linked websites.",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    note: "Check profiles, repositories, and README files.",
  },
  {
    label: "Product Hunt",
    href: "https://www.producthunt.com",
    note: "Useful for launched products and maker profiles.",
  },
  {
    label: "Behance",
    href: "https://www.behance.net",
    note: "Useful for design work.",
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com",
    note: "Useful for design work.",
  },
  {
    label: "WHOIS",
    href: "https://lookup.icann.org",
    note: "Use only if the email is publicly listed.",
  },
]

const unclaimedChecks = [
  "The email looks like it belongs to the creator or their team",
  "The name, username, avatar, and project all match the same person/company",
  "The creator does not already have a claimed Spotlight account",
  "The same project has not already been submitted",
]

const submissionSteps = [
  "Sign in with a staff/admin account.",
  "Open /projects/new/staff.",
  "Under Project Owner, search for an existing unclaimed user first.",
  "If no match exists, choose Create New.",
  "Add the creator's display name, username, email, and profile picture.",
  "Submit the unclaimed account.",
  "Fill in the project title, category, URL, banner image, main image, preview video, tags, and element images.",
  "Create the project and review the public project page.",
]

const captureItems = [
  "Banner image: a wide, clean image that gives a strong first impression",
  "Main project image: the best representative screenshot or visual",
  "Preview video: a short recording that shows the project in motion",
  "Element images: up to 4 extra screenshots showing important pages, details, features, or visual moments",
  "Tags: choose only relevant tags based on what the project actually uses or represents",
]

const websiteGuidelines = [
  "Open the live project in a clean browser window.",
  "Use desktop screenshots unless the project is mainly mobile.",
  "Capture the homepage or most visually representative screen for the main image.",
  "Capture useful secondary screens for element images.",
  "Avoid screenshots with browser UI, cursor, popups, cookie banners, broken layouts, or loading states.",
  "If the site has animation or interaction, record a short preview video.",
]

const previewGuidelines = [
  "Keep it short and focused, ideally 5-10 seconds.",
  "Show the strongest interaction, transition, scroll, or product moment.",
  "Avoid shaky mouse movement and unnecessary waiting.",
  "Do not include private user data, admin areas, or anything that is not public.",
]

const otherProjectGuidelines = [
  "Use official public images, launch materials, screenshots, trailers, demo clips, or press assets when available.",
  "Prefer visuals from the creator's own website or public profiles.",
  "Do not use copyrighted images from unrelated articles unless they are clearly official/public project assets.",
  "If the work is visual, pick images that show the craft clearly.",
  "If the work is technical, pick images that help visitors understand what it does.",
]

const qualityChecks = [
  "Images are sharp and not distorted",
  "Cropping looks intentional",
  "The project title matches the original project",
  "The URL works",
  "Nothing sensitive or private is visible",
  "The submission feels like a fair representation of the creator's work",
]

const finalChecks = [
  "Project page loads correctly",
  "Creator name, username, avatar, and email are correct",
  "Images and preview video look good",
  "Category and tags are accurate",
  "Award type and date are correct",
  "Claim/profile link works",
  "The message includes the same email used to create the unclaimed account",
]

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-[#EAEAEA] px-6 py-8 lg:px-10">
      <h2 className="text-2xl font-semibold tracking-tight text-black">
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-base leading-7 text-[#555]">
        {children}
      </div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  )
}

export default async function StaffGuidePage() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)
  const userRole = user?.role

  if (!user) {
    redirect(signInUrl("/staff-guide"))
  }

  if (!hasStaffAccess(userRole)) {
    redirect("/")
  }

  return (
    <PageWrapper className="w-full bg-white pb-0" wrapperClassName="px-4">
      <header className="px-6 py-8 lg:px-10 lg:py-10">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#777]">
          Internal guide
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black">
          Spotlight Staff Guide
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#555]">
          Use this guide when finding creator contact details, submitting staff
          projects, curating project media, giving awards, and messaging
          creators.
        </p>
      </header>

      <Section title="1. Finding a Creator Email">
        <p>
          When you find a project worth submitting, first confirm the project is
          real, public, and belongs to the creator you are adding.
        </p>

        <div>
          <h3 className="font-semibold text-black">Good places to look</h3>
          <div className="mt-3">
            <BulletList items={emailSources} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-black">Helpful links</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {helpfulLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[#EAEAEA] p-4 transition-colors hover:border-black"
              >
                <span className="font-semibold text-black">{link.label}</span>
                <span className="mt-1 block text-sm leading-6 text-[#666]">
                  {link.note}
                </span>
              </a>
            ))}
          </div>
        </div>

        <p>
          Only use public, professional contact information. Do not guess
          private emails, use leaked data, buy contact lists, or contact
          unrelated personal addresses.
        </p>

        <div>
          <h3 className="font-semibold text-black">
            Before creating an unclaimed account
          </h3>
          <div className="mt-3">
            <BulletList items={unclaimedChecks} />
          </div>
        </div>
      </Section>

      <Section title="2. Creating an Unclaimed Account">
        <p>
          Use the staff submission page:{" "}
          <Link href="/projects/new/staff" className="underline">
            /projects/new/staff
          </Link>
          .
        </p>
        <NumberedList items={submissionSteps} />
        <p>
          Keep submissions clean: use high-quality images, accurate titles,
          relevant tags, and the creator's real public identity.
        </p>
        <p>
          Do not send the creator any temporary password. They should claim the
          account through their profile's Claim Account button or{" "}
          <span className="font-mono text-sm text-black">/claim/[username]</span>
          , using the same email you added.
        </p>
      </Section>

      <Section title="3. Curating Project Content">
        <p>
          Before submitting, collect the best public materials for the project.
          The goal is to make the project look accurate, polished, and exciting
          without misrepresenting it.
        </p>

        <div>
          <h3 className="font-semibold text-black">What to capture</h3>
          <div className="mt-3">
            <BulletList items={captureItems} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-black">For websites and apps</h3>
          <div className="mt-3">
            <BulletList items={websiteGuidelines} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-black">For preview videos</h3>
          <div className="mt-3">
            <BulletList items={previewGuidelines} />
          </div>
          <p className="mt-3">
            Use the{" "}
            <a
              href="https://video-tool.spotlight.day"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Spotlight Video Tool
            </a>{" "}
            to prepare the preview video.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-black">
            For films, design, crypto, startups, and AI projects
          </h3>
          <div className="mt-3">
            <BulletList items={otherProjectGuidelines} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-black">Quality checklist</h3>
          <div className="mt-3">
            <BulletList items={qualityChecks} />
          </div>
        </div>
      </Section>

      <Section title="4. Giving Awards">
        <p>
          Use the staff dashboard:{" "}
          <Link href="/dashboard" className="underline">
            /dashboard
          </Link>
          .
        </p>
        <NumberedList
          items={[
            "Open /dashboard.",
            "Search by project title or creator.",
            "Filter by category or award if needed.",
            "Click Of the Day, Of the Month, Of the Year, or Honorable.",
            "Choose the award date, month, or year.",
            "Save the award.",
          ]}
        />
        <p>
          Active awards are highlighted. Clicking an active award removes it.
          Clicking the award date lets you update the date.
        </p>
      </Section>

      <Section title="5. Messaging the Creator">
        <p>
          Keep the message short, warm, and clear. Tell them what won, where to
          view it, how to claim the account, and the exact email address staff
          used when creating the unclaimed account.
        </p>

        <div className="rounded-lg border border-[#EAEAEA] bg-[#FAFAFA] p-5 text-[#333]">
          <p className="font-semibold text-black">
            Subject: Your project won a Spotlight award
          </p>
          <div className="mt-4 space-y-4">
            <p>Hi [Name],</p>
            <p>
              We loved [Project Name] and selected it for [Award Name] on
              Spotlight.
            </p>
            <p>You can view it here: [Project Link]</p>
            <p>
              We created an unclaimed creator profile for you so the award is
              connected to the right person/team.
            </p>
            <p>
              Claim link: [Claim Link]
              <br />
              Email to use in the claim form: [Email Used For Unclaimed
              Account]
            </p>
            <p>
              Once claimed, you can update your profile, manage the project,
              and keep the award attached to your account.
            </p>
            <p>
              Congrats,
              <br />
              The Spotlight Team
            </p>
          </div>
        </div>
      </Section>

      <Section title="6. Final Checklist">
        <BulletList items={finalChecks} />
        <p>
          After the creator claims the account, avoid editing their profile
          unless they ask for help.
        </p>
      </Section>
    </PageWrapper>
  )
}
