import { useState } from "react";
import { createContext, useContext } from "react";

interface HeaderThemeContextType {
  headerTheme: "light" | "dark";
  setHeaderTheme: (value: "light" | "dark") => void;
}

export const HeaderThemeContext = createContext<HeaderThemeContextType>({
  headerTheme: "dark",
  setHeaderTheme: () => {},
});

export function useHeaderTheme() {
  return useContext(HeaderThemeContext);
}

export default function HeaderThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerTheme, setHeaderTheme] = useState<"light" | "dark">("dark");

  return (
    <HeaderThemeContext.Provider value={{ headerTheme, setHeaderTheme }}>
      {children}
    </HeaderThemeContext.Provider>
  );
}
