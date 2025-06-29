import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import PageWrapper from "@/components/page-wrapper"

import NewProjectForm from "./components/NewProjectForm"
import NewProjectHeader from "./components/NewProjectHeader"

export default async function NewProjectPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  return (
    <PageWrapper className="w-full flex flex-col pb-0">
      <NewProjectHeader />
      <NewProjectForm userId={userId} />
    </PageWrapper>
  )
}
