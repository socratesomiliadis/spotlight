import { AuthPopupType } from "@/lib/types";
import { useState } from "react";
import { createContext, useContext } from "react";

interface AuthPopupContextType {
  authPopupType: AuthPopupType;
  setAuthPopupType: (val: AuthPopupType) => void;
}

export const AuthPopupContext = createContext<AuthPopupContextType>({
  authPopupType: "none",
  setAuthPopupType: () => {},
});

export function useAuthPopup() {
  return useContext(AuthPopupContext);
}

export default function AuthPopupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authPopupType, setAuthPopupType] = useState<AuthPopupType>("none");

  return (
    <AuthPopupContext.Provider value={{ authPopupType, setAuthPopupType }}>
      {children}
    </AuthPopupContext.Provider>
  );
}
