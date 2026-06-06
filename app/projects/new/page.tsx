import { redirect } from "next/navigation"

import { api } from "@/convex/_generated/api"
import { signInUrl } from "@/lib/auth-flow"
import { fetchAuthQuery } from "@/lib/auth-server"
import PageWrapper from "@/components/page-wrapper"

import NewProjectForm from "./components/NewProjectForm"
import NewProjectHeader from "./components/NewProjectHeader"

export default async function NewProjectPage() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)

  if (!user) {
    redirect(signInUrl("/projects/new"))
  }

  return (
    <PageWrapper className="w-full flex flex-col pb-0">
      <NewProjectHeader />
      <NewProjectForm userId={user.user_id} />
    </PageWrapper>
  )
}
