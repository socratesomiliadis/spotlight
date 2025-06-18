import Image from "next/image";
import ProjectHeader from "./components/ProjectHeader";
import ProjectNavigation from "./components/ProjectNavigation";
import ProjectElements from "./components/ProjectElements";
import ProjectDetails from "./components/ProjectDetails";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  const testData = {
    bannerUrl: `/static/images/signUp.png`,
    title: "Chrome Hearts",
    createdAt: "2025-02-28 07:43:49.34783+00",
    userAvatarUrl: "/static/images/signUp.png",
    userDisplayName: "John Doe",
    userUsername: "john_doe",
    elementURLs: [
      "/static/images/signUp.png",
      "/static/images/signUp.png",
      "/static/images/signUp.png",
      "/static/images/signUp.png",
    ],
    tools: ["Next.js", "Tailwind CSS", "TypeScript", "Shadcn UI"],
  };

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full pb-8 rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <ProjectHeader
          bannerUrl={testData.bannerUrl}
          title={testData.title}
          createdAt={testData.createdAt}
          userAvatarUrl={testData.userAvatarUrl}
          userDisplayName={testData.userDisplayName}
          userUsername={testData.userUsername}
        />
        <ProjectNavigation />
        <div className="px-8">
          <Image
            src="/static/images/signUp.png"
            alt="Project Image"
            width={2560}
            height={1440}
            className="w-full aspect-video object-cover rounded-2xl"
          />
        </div>
        <ProjectElements elementURLs={testData.elementURLs} />
        <ProjectDetails tools={testData.tools} />
      </div>
    </main>
  );
}
