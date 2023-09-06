import { UserProfile } from "@clerk/nextjs";
import ProfileForm from "./ProfileForm";
import { useEffect } from "react";

export default function ProfileTab({ profileData }: { profileData: any }) {
  useEffect(() => {
    console.log(profileData);
  }, [profileData]);
  return (
    <>
      {/* <div className="basis-[15rem] max-w-[15rem] pl-[0.25rem] pr-[1rem] h-full border-r-[1px] border-r-[#d8d8d8]"></div> */}
      <div className="rounded-xl w-full flex flex-col overflow-hidden">
        <div className="w-full h-full overflow-y-scroll py-4">
          <UserProfile
            routing="virtual"
            appearance={{
              variables: {
                colorPrimary: "#000",
              },
              elements: {
                rootBox: {
                  width: "100%",
                },
                pageScrollBox: {
                  padding: "0 0.75rem 0rem 0.75rem",
                },
                card: {
                  width: "100%",
                  boxShadow: "none",
                  margin: "0",
                  position: "relative",
                },
                navbar: {
                  display: "none",
                },
                header: {
                  display: "none",
                },
                profileSection__emailAddresses: {
                  display: "none",
                },
                profileSection__connectedAccounts: {
                  display: "none",
                },
                profileSection__password: {
                  display: "none",
                },
                profileSection__activeDevices: {
                  display: "none",
                },
              },
            }}
          />
          <div className="pl-[0.75rem] pr-[0.75rem] text-[1rem]">
            <ProfileForm profileData={profileData} />
          </div>
        </div>
        <button
          className="text-white self-end mt-4 px-10 py-3 flex bg-black rounded-full"
          type="submit"
          form="profileForm"
        >
          <span className="">Done</span>
        </button>
      </div>
    </>
  );
}
