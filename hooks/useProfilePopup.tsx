import { useState } from "react";
import { createContext, useContext } from "react";

interface ProfilePopupContextType {
  isProfilePopupOpen: boolean;
  setIsProfilePopupOpen: (val: boolean) => void;
}

export const ProfilePopupContext = createContext<ProfilePopupContextType>({
  isProfilePopupOpen: false,
  setIsProfilePopupOpen: () => {},
});

export function useProfilePopup() {
  return useContext(ProfilePopupContext);
}

export default function ProfilePopupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState<boolean>(false);

  return (
    <ProfilePopupContext.Provider
      value={{ isProfilePopupOpen, setIsProfilePopupOpen }}
    >
      {children}
    </ProfilePopupContext.Provider>
  );
}
