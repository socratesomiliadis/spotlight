import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewProjectForm from "./components/NewProjectForm";
import NewProjectHeader from "./components/NewProjectHeader";

export default async function NewProjectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <NewProjectHeader />
        <NewProjectForm userId={userId} />
      </div>
    </main>
  );
}
