import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewProjectHeader from "../components/NewProjectHeader";
import NewProjectStaffForm from "../components/NewProjectStaffForm";

export default async function StaffPage() {
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as string;

  if (!user || userRole !== "staff") {
    redirect("/");
  }

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <NewProjectHeader />
        <NewProjectStaffForm userId={user.id} />
      </div>
    </main>
  );
}
