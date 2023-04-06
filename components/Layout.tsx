import { acidGrotesk } from "@/pages/_app";
import Preloader from "./Preloader";
import { usePreloader } from "@/hooks/usePreloader";
import { useEffect } from "react";
import Header from "./Header/Header";
import AuthPopup from "./AuthPopup";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isPreloading, setIsPreloading, isInApp } = usePreloader();

  useEffect(() => {
    if (!isInApp) setIsPreloading(true);
  }, [isInApp]);

  return (
    <>
      <div className={`${acidGrotesk.className} layout-wrapper`}>
        {isPreloading && <Preloader />}
        <Header />
        <AuthPopup />
        {children}
      </div>
    </>
  );
}
