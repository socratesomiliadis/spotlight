import { useRouter } from "next/router";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isVisible, setIsVisible] = useState(false);
  const [clerkErrors, setClerkErrors] = useState<any>(null);
  const redirectURL = useMemo(() => {
    if (typeof router.query.redirect_url === "string") {
      return router.query.redirect_url;
    }
    return "/";
  }, [router.query.redirect_url]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isSignedIn) {
      router.push(redirectURL);
    }
  }, [isSignedIn]);

  if (!isLoaded || isSignedIn) {
    return null;
  }

  const onSubmit = async (data: any, e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    setClerkErrors(null);
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: data.email_or_username,
        password: data.password,
      });

      if (result.status === "complete") {
        setLoading(false);
        await setActive({ session: result.createdSessionId });
      } else {
        /*Investigate why the login hasn't completed */
        console.log(result);
      }
    } catch (err: any) {
      setLoading(false);
      setClerkErrors(err.errors[0].longMessage);
      console.error("error", err.errors[0].longMessage);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        }}
        key="sign-in-form"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-black text-5xl font-medium">
            Sign in to Spotlight
          </h2>
        </div>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 flex flex-col items-start gap-4 w-full"
        >
          <Input
            type="email"
            label="E-mail or username"
            size="md"
            errorMessage={
              errors.email_or_username &&
              "Please enter a valid email or username"
            }
            isInvalid={!!errors.email_or_username}
            className="spotlight-input"
            classNames={{
              inputWrapper: [
                "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-2xl shadow",
              ],
              input: ["font-medium"],
            }}
            {...register("email_or_username", {
              required: true,
            })}
          />

          <Input
            label="Password"
            size="md"
            classNames={{
              inputWrapper: [
                "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-2xl shadow",
              ],
              input: ["font-medium"],
            }}
            className="spotlight-input"
            errorMessage={
              errors.password &&
              "Your password must be at least 8 characters long"
            }
            isInvalid={!!errors.password}
            endContent={
              <button
                className="focus:outline-none mr-1"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <span className="w-5 block">
                    <svg
                      width="100%"
                      viewBox="0 0 24 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-default-400"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.00113 0.585938L22.4153 20.0002L21.0011 21.4144L17.2035 17.6168C14.5534 19.0943 11.5789 19.3944 8.7825 18.4857C5.7439 17.4983 3.0038 15.1155 1.11262 11.4591L0.875 10.9997L1.11262 10.5403C2.19905 8.43978 3.56474 6.75983 5.10892 5.52215L1.58691 2.00015L3.00113 0.585938ZM8.00085 10.9997C8.00085 10.2584 8.20313 9.56343 8.55477 8.96801L10.0684 10.4816C10.0243 10.6468 10.0009 10.8204 10.0009 10.9997C10.0009 12.1043 10.8963 12.9997 12.0009 12.9997C12.1802 12.9997 12.3538 12.9763 12.5189 12.9322L14.0326 14.4458C13.4372 14.7975 12.7422 14.9997 12.0009 14.9997C9.79172 14.9997 8.00085 13.2089 8.00085 10.9997Z"
                        fill="currentColor"
                      />
                      <path
                        d="M22.8889 11.4594C22.16 12.8686 21.3044 14.0883 20.3551 15.1118L8.7627 3.51936C9.81638 3.17482 10.9038 3.00001 12.0006 3C16.2398 2.99997 20.3393 5.61119 22.8889 10.5405L23.1265 10.9999L22.8889 11.4594Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="w-5 block">
                    <svg
                      width="100%"
                      viewBox="0 0 24 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-default-400"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.0008 2.5284e-10C16.24 -2.96819e-05 20.3395 2.61119 22.8891 7.54053L23.1267 7.99995L22.8891 8.45936C20.3395 13.3887 16.24 16 12.0009 16C7.76169 16 3.66221 13.3888 1.11262 8.45947L0.875 8.00005L1.11262 7.54064C3.66221 2.6113 7.76168 2.96844e-05 12.0008 2.5284e-10ZM8.50085 8C8.50085 6.067 10.0679 4.5 12.0009 4.5C13.9339 4.5 15.5009 6.067 15.5009 8C15.5009 9.933 13.9339 11.5 12.0009 11.5C10.0679 11.5 8.50085 9.933 8.50085 8Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            {...register("password", {
              required: true,
              validate: (value) => value.length >= 8,
            })}
          />

          <button
            type="submit"
            className="mt-4 group w-full rounded-[2rem] relative text-white text-sm flex flex-row items-center gap-3"
          >
            <div className="z-[2] flex items-center justify-between w-full px-4">
              <div className="w-12" />
              <span className="z-[1] py-6 text-2xl font-medium">Sign In</span>
              <div className="bg-white relative w-12 h-12 rounded-xl z-[1] flex items-center justify-center">
                {loading ? (
                  <CircularProgress
                    size="sm"
                    color="default"
                    aria-label="Loading..."
                    className="z-[1]"
                    classNames={{
                      svg: "w-4 h-4",
                    }}
                  />
                ) : (
                  <svg
                    width="32%"
                    viewBox="0 0 11 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.54942 1.17541L9.95703 4.58301M9.95703 4.58301L6.54942 7.99063M9.95703 4.58301L0.870074 4.58301"
                      stroke="black"
                      strokeWidth="1.13587"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <Image
              src="/static/images/authImage.png"
              width={1500 / 2}
              height={2060 / 2}
              alt=""
              className="w-full rounded-[2rem] h-full z-[1] absolute object-cover"
            />
            <Image
              src="/static/images/authImage.png"
              width={1500 / 4}
              height={2060 / 4}
              alt=""
              className="w-full rounded-[2rem] h-full z-0 absolute blur-[20px] opacity-0 group-hover:opacity-50 transition-opacity duration-400 ease-out object-cover"
            />
          </button>
          {clerkErrors && (
            <span className="text-sm text-red-500">{clerkErrors}</span>
          )}
        </form>
        <div className="flex items-center mt-4 gap-2">
          <p>Don&apos;t have an account?</p>
          <Link
            href={{
              pathname: "/auth/sign-up",
              query: { redirect_url: redirectURL },
            }}
            className="text-xs text-white bg-black px-3 py-1 rounded-full"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
