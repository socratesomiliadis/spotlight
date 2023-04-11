import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfilePopup } from "@/hooks/useProfilePopup";
import { UserProfile } from "@clerk/nextjs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/primitives/Tabs";
import ProfileForm from "./ProfileForm";
import { supabaseClientWithAuth } from "@/utils/helpers";
import { useAuth, useUser } from "@clerk/nextjs";
import AccountTab from "./AccountTab";
import ProfileTab from "./ProfileTab";

export default function ProfilePopup() {
  const { isProfilePopupOpen, setIsProfilePopupOpen } = useProfilePopup();
  const [profileData, setProfileData] = useState<any>();
  const { user } = useUser();
  const { getToken, userId } = useAuth();

  const getProfileData = async () => {
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(
      supabaseAccessToken as string
    );

    const { data, error } = await supabase
      .from("profile")
      .select(
        `*, socials (*
        )`
      )
      .eq("username", user?.username)
      .single();

    if (error) {
      console.log(error);
    }
    if (data) {
      setProfileData(data);
    }
  };

  useEffect(() => {
    if (!!user) getProfileData().catch((err) => console.log(err));
  }, [user, isProfilePopupOpen]);

  function PopupWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div className="fixed w-full h-full inset-0 z-[100] flex items-center justify-center ">
        <div className="form-wrapper relative z-10">{children}</div>
        <div
          onClick={() => setIsProfilePopupOpen(false)}
          className="cursor-pointer popup-bg z-[1] absolute inset-0 w-full h-full bg-black/10 backdrop-blur-lg"
        ></div>
      </div>
    );
  }

  useEffect(() => {
    const html = document.querySelector("html") as HTMLElement;
    if (!isProfilePopupOpen) html.classList?.remove("overflow-hidden");
    else {
      html.classList?.add("overflow-hidden");
    }
  }, [isProfilePopupOpen]);

  if (isProfilePopupOpen)
    return (
      <PopupWrapper>
        <div className="w-[40vw] h-[75vh] rounded-3xl bg-white p-10 overflow-hidden">
          <div className="flex h-full flex-col gap-8">
            <div className="flex flex-col gap-0">
              <h3 className="text-4xl font-medium">User Settings</h3>
              <p className="text-[#8F8F8F]">
                Add more information about you here.
              </p>
            </div>
            <Tabs defaultValue="account" className="w-full h-[80%] relative">
              <TabsList className="">
                <TabsTrigger value="account">
                  <span className="-mb-1">Account</span>
                </TabsTrigger>
                <TabsTrigger value="profile">
                  {" "}
                  <span className="-mb-1">Profile</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent
                className="w-full border-none overflow-y-scroll data-[state=active]:h-full pb-0"
                value="account"
              >
                <AccountTab />
              </TabsContent>
              <TabsContent
                className="w-full border-none data-[state=active]:h-full flex flex-row"
                value="profile"
              >
                <ProfileTab profileData={profileData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PopupWrapper>
    );
  else return null;
}
