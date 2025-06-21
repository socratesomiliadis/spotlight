import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <main className="w-screen px-[22vw] h-[100svh] flex items-center justify-center">
      <div
        data-lenis-prevent
        className="w-full rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col overflow-hidden -mt-8"
      >
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
    </main>
  );
}
