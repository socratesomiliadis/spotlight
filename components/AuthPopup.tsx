import { useAuthPopup } from "@/hooks/useAuthPopup";
import { SignIn, SignUp } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthPopup() {
  const { authPopupType, setAuthPopupType } = useAuthPopup();
  const router = useRouter();

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
    if (router.query.auth === "signIn") setAuthPopupType("signIn");
    else if (router.query.auth === "signUp") setAuthPopupType("signUp");
    else setAuthPopupType("none");
  }, [router.query.auth]);

  useEffect(() => {
    const html = document.querySelector("html") as HTMLElement;
    if (authPopupType === "none") html.classList?.remove("overflow-hidden");
    else html.classList?.add("overflow-hidden");
  }, [authPopupType]);

  if (authPopupType === "none") return null;
  else if (authPopupType === "signIn")
    return (
      <PopupWrapper>
        <SignIn
          signUpUrl={`${router.asPath.split("?")[0]}/?auth=signUp`}
          afterSignInUrl={`${router.asPath.split("?")[0]}`}
          afterSignUpUrl={`${router.asPath.split("?")[0]}`}
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
          signInUrl={`${router.asPath.split("?")[0]}/?auth=signIn`}
          afterSignInUrl={`${router.asPath.split("?")[0]}`}
          afterSignUpUrl={`${router.asPath.split("?")[0]}`}
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
