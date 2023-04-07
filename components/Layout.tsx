import { acidGrotesk } from "@/pages/_app";
import Preloader from "./Preloader";
import { usePreloader } from "@/hooks/usePreloader";
import { useEffect } from "react";
import Header from "./Header/Header";
import AuthPopup from "./AuthPopup";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isPreloading, setIsPreloading, isInApp, setIsInApp } = usePreloader();
  const router = useRouter();

  useEffect(() => {
    if (!isInApp && router.asPath === "/") setIsPreloading(true);
    else {
      setIsPreloading(false);
      setIsInApp(true);
    }
  }, [isInApp, router.asPath]);

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
