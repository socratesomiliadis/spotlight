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

export default function ProfilePopup() {
  const { isProfilePopupOpen, setIsProfilePopupOpen } = useProfilePopup();

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
        <div className="w-[50vw] h-[75vh] rounded-3xl bg-white p-10 overflow-hidden">
          <div className="flex h-full flex-col overflow-y-scroll gap-8">
            <div className="flex flex-col gap-0">
              <h3 className="text-3xl font-medium">Profile Settings</h3>
              <p className="text-[#8F8F8F]">
                Add more information about you here.
              </p>
            </div>
            <Tabs defaultValue="account" className="w-full">
              <TabsList>
                <TabsTrigger value="account">
                  <span className="-mb-1">Account</span>
                </TabsTrigger>
                <TabsTrigger value="social-links">
                  {" "}
                  <span className="-mb-1">Profile</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent className="w-full border-none" value="account">
                <UserProfile
                  appearance={{
                    elements: {
                      rootBox: {
                        width: "100%",
                      },
                      profileSection__profile: {
                        display: "none",
                      },
                      profileSection__username: {
                        display: "none",
                      },
                      pageScrollBox: {
                        paddingTop: "0",
                      },
                      card: {
                        width: "100%",
                        boxShadow: "none",
                        margin: "0",
                        position: "relative",
                      },
                      navbar: {
                        padding: "0 1rem 0 0.25rem",
                      },
                      navbarButtons: {
                        position: "sticky",
                        top: "0",
                      },
                      header: {
                        display: "none",
                      },
                    },
                  }}
                />
              </TabsContent>
              <TabsContent className="w-full border-none" value="social-links">
                <UserProfile
                  appearance={{
                    elements: {
                      rootBox: {
                        width: "100%",
                      },
                      pageScrollBox: {
                        padding: "0 1rem 0 0.5rem",
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
                <div className="pl-[1rem] pr-[0.5rem] text-[1rem]">
                  <h3 className="font-medium">Social Links</h3>
                  <hr />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PopupWrapper>
    );
  else return null;
}
