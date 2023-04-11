import { useAuthPopup } from "@/hooks/useAuthPopup";
import { SignIn, SignUp, UserProfile } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function AuthPopup() {
  const { authPopupType, setAuthPopupType } = useAuthPopup();
  const router = useRouter();
  const [paths, setPaths] = useState({
    signIn: `${router.asPath.split("?")[0]}/?auth=signIn`,
    signUp: `${router.asPath.split("?")[0]}/?auth=signUp`,
    afterSuccess: `${router.asPath.split("?")[0]}`,
  });

  function PopupWrapper({ children }: { children: React.ReactNode }) {
    // useEffect(() => {
    //   if (authPopupType === "signIn") {
    //     const signInForm = document.querySelector(
    //       ".cl-signIn-root"
    //     ) as HTMLElement;

    //     const signUpBtn = signInForm.querySelector(
    //       ".cl-footerActionLink"
    //     ) as HTMLElement;

    //     signUpBtn.addEventListener("click", (e: MouseEvent) => {
    //       e.preventDefault();
    //       setAuthPopupType("signUp");
    //     });
    //   }
    // }, [authPopupType]);

    return (
      <div className="fixed w-full h-full inset-0 z-[100] flex items-center justify-center ">
        <div className="form-wrapper relative z-10">{children}</div>
        <div
          onClick={() => router.push(router.asPath.split("?")[0])}
          className="cursor-pointer popup-bg z-[1] absolute inset-0 w-full h-full bg-black/10 backdrop-blur-lg"
        ></div>
      </div>
    );
  }

  useEffect(() => {
    const currentPath = router.asPath.split("?")[0];
    const currentPathNoTrailSlash = currentPath.endsWith("/")
      ? currentPath.slice(0, -1)
      : currentPath;

    if (router.query.auth === "signIn") {
      setPaths({
        signIn: `${currentPathNoTrailSlash}/?auth=signIn`,
        signUp: `${currentPathNoTrailSlash}/?auth=signUp`,
        afterSuccess: `${currentPathNoTrailSlash}`,
      });
      setAuthPopupType("signIn");
    } else if (router.query.auth === "signUp") {
      setPaths({
        signIn: `${currentPathNoTrailSlash}/?auth=signIn`,
        signUp: `${currentPathNoTrailSlash}/?auth=signUp`,
        afterSuccess: `${currentPathNoTrailSlash}`,
      });
      setAuthPopupType("signUp");
    } else setAuthPopupType("none");
  }, [router.query]);

  useEffect(() => {
    const html = document.querySelector("html") as HTMLElement;
    if (authPopupType === "none") html.classList?.remove("overflow-hidden");
    else html.classList?.add("overflow-hidden");
  }, [authPopupType]);

  if (authPopupType === "signIn")
    return (
      <PopupWrapper>
        <SignIn
          signUpUrl={paths.signUp}
          afterSignInUrl={paths.afterSuccess}
          afterSignUpUrl={paths.afterSuccess}
          appearance={{
            elements: {
              formButtonPrimary:
                "font-medium pt-3 pb-2 bg-black hover:bg-black text-sm normal-case",
              footerActionLink: "text-black hover:text-black",
            },
          }}
        />
      </PopupWrapper>
    );
  else if (authPopupType === "signUp")
    return (
      <PopupWrapper>
        <SignUp
          signInUrl={paths.signIn}
          afterSignInUrl={paths.afterSuccess}
          afterSignUpUrl={paths.afterSuccess}
          appearance={{
            elements: {
              formButtonPrimary:
                "font-medium pt-3 pb-2 bg-black hover:bg-black text-sm normal-case",
              footerActionLink: "text-black hover:text-black",
            },
          }}
        />
      </PopupWrapper>
    );
  else return null;
}
