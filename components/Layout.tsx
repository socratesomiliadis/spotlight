import { inter } from "@/pages/_app";
import Preloader from "./Preloader";
import { usePreloader } from "@/hooks/usePreloader";
import { useEffect } from "react";
import Header from "./Header/Header";
import AuthPopup from "./AuthPopup";
import { useRouter } from "next/router";
import ProfilePopupProvider from "@/hooks/useProfilePopup";
import ProfilePopup from "./ProfilePopup/ProfilePopup";
import { Toaster } from "sonner";
import Footer from "./Footer";
import AuthLayout from "./Auth/AuthLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isPreloading, setIsPreloading, isInApp, setIsInApp } = usePreloader();
  const router = useRouter();

  useEffect(() => {
    if (!isInApp && router.asPath === "/") setIsPreloading(true);
    else {
      const html = document.querySelector("html") as HTMLElement;
      html.classList?.remove("loading");
      setIsPreloading(false);
      setIsInApp(true);
    }
  }, [isInApp, router.asPath]);

  if (!router.asPath.includes("/auth/"))
    return (
      <>
        <ProfilePopupProvider>
          <div className={`layout-wrapper`}>
            {isPreloading && <Preloader />}
            <Header />
            <AuthPopup />
            <ProfilePopup />
            <Toaster
              toastOptions={{
                style: {
                  fontFamily: inter.style.fontFamily,
                },
                className: "toast",
              }}
            />
            {children}
            <Footer />
          </div>
        </ProfilePopupProvider>
      </>
    );
  else return <AuthLayout>{children}</AuthLayout>;
}
