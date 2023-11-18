import { useRouter } from "next/router";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { supabaseClient } from "@/utils/helpers";
import { supabaseClientWithAuth } from "@/utils/helpers";
import {
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Avatar,
} from "@nextui-org/react";
import { motion } from "framer-motion";
// import PhoneInput from "@/components/PhoneInput";
import { CircularProgress } from "@nextui-org/react";
import { countries } from "@/lib/countries";
import { inter } from "@/pages/_app";

export default function SocialsTab() {
  const [loading, setLoading] = useState(false);
  const [socials, setSocials] = useState<any>(null);
  const router = useRouter();
  const { getToken, userId } = useAuth();
  const { isLoaded, user } = useUser();

  const [clerkErrors, setClerkErrors] = useState<any>(null);

  async function getSocials(username: string) {
    const { data, error } = await supabaseClient
      .from("profile")
      .select(`*, socials (*)`)
      .eq("username", username)
      .single();

    if (error) {
      console.log(error);
    }
    if (data) {
      setSocials(data.socials);
    }
  }

  useEffect(() => {
    if (!!user?.username) {
      getSocials(user.username).catch((err) => console.log(err));
    }
  }, [user]);

  // useEffect(() => {
  //   console.log(socials);
  // }, [socials]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   twitter: socials?.twitter ?? "",
    //   instagram: socials?.instagram ?? "",
    //   readcv: socials?.readcv ?? "",
    //   linkedin: socials?.linkedin ?? "",
    //   behance: socials?.behance ?? "",
    // },
  });

  const onSubmit = async (data: any, e: any) => {
    console.log("here");
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    console.log("here loaded");
    setClerkErrors(null);
    setLoading(true);

    // try {
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(
      supabaseAccessToken as string
    );
    const { data: supaData, error } = await supabase
      .from("socials")
      .update({
        twitter: data.twitter,
        instagram: data.instagram,
        read_cv: data.readcv,
        linkedin: data.linkedin,
        behance: data.behance,
      })
      .eq("user_id", userId)
      .select();

    console.log(supaData, error, data);

    if (error) {
      setLoading(false);
      setClerkErrors(error.message);
      console.log(error);
    }
    if (supaData) {
      setLoading(false);
    }
  };

  if (!socials) return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      }}
      className="w-full pt-16 flex items-center justify-center"
    >
      <div className="flex flex-col items-start w-1/2">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col items-end gap-8 w-full"
        >
          <div className="grid grid-cols-2 gap-8 w-full">
            <Input
              type="text"
              label="Twitter"
              size="lg"
              disableAnimation
              labelPlacement="outside"
              defaultValue={socials?.twitter ?? ""}
              startContent={
                <span className="text-[#ACACAC] text-sm">
                  https://twitter.com/
                </span>
              }
              className="spotlight-input w-full"
              classNames={{
                //   innerWrapper: ["py-6"],
                inputWrapper: [
                  "bg-white pl-6 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: [
                  "font-medium h-auto text-sm data-[has-start-content=true]:ps-0",
                ],
              }}
              {...register("twitter")}
            />
            <Input
              type="text"
              label="Instagram"
              size="lg"
              disableAnimation
              labelPlacement="outside"
              defaultValue={socials?.instagram ?? ""}
              startContent={
                <span className="text-[#ACACAC] text-sm">
                  https://instagram.com/
                </span>
              }
              className="spotlight-input w-full"
              classNames={{
                //   innerWrapper: ["py-6"],
                inputWrapper: [
                  "bg-white pl-6 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: [
                  "font-medium h-auto text-sm data-[has-start-content=true]:ps-0",
                ],
              }}
              {...register("instagram")}
            />
            <Input
              type="text"
              label="Read CV"
              size="lg"
              disableAnimation
              labelPlacement="outside"
              defaultValue={socials?.read_cv ?? ""}
              startContent={
                <span className="text-[#ACACAC] text-sm">https://read.cv/</span>
              }
              className="spotlight-input w-full"
              classNames={{
                //   innerWrapper: ["py-6"],
                inputWrapper: [
                  "bg-white pl-6 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: [
                  "font-medium h-auto text-sm data-[has-start-content=true]:ps-0",
                ],
              }}
              {...register("readcv")}
            />
            <Input
              type="text"
              label="LinkedIn"
              size="lg"
              disableAnimation
              labelPlacement="outside"
              defaultValue={socials?.linkedin ?? ""}
              startContent={
                <span className="text-[#ACACAC] text-sm">
                  https://linkedin.com/in/
                </span>
              }
              className="spotlight-input w-full"
              classNames={{
                //   innerWrapper: ["py-6"],
                inputWrapper: [
                  "bg-white pl-6 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: [
                  "font-medium h-auto text-sm data-[has-start-content=true]:ps-0",
                ],
              }}
              {...register("linkedin")}
            />
            <Input
              type="text"
              label="Behance"
              size="lg"
              disableAnimation
              labelPlacement="outside"
              defaultValue={socials?.behance ?? ""}
              startContent={
                <span className="text-[#ACACAC] text-sm">
                  https://behance.net/
                </span>
              }
              className="spotlight-input w-full"
              classNames={{
                //   innerWrapper: ["py-6"],
                inputWrapper: [
                  "bg-white pl-6 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: [
                  "font-medium h-auto text-sm data-[has-start-content=true]:ps-0",
                ],
              }}
              {...register("behance")}
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-fit place-self-end group rounded-[1.5rem] bg-black relative text-white text-sm flex flex-row items-center gap-3"
          >
            <div className="z-[2] flex items-center gap-12 w-full pl-16 pr-3">
              <span className="z-[1] py-4 text-lg font-medium">Save</span>
              <div className="bg-white overflow-hidden group-hover:scale-[1.1] transition-transform duration-300 ease-out relative w-10 h-10 rounded-xl z-[1] flex items-center justify-center">
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
                  <>
                    <svg
                      width="32%"
                      viewBox="0 0 11 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute transition-transform duration-250 ease-soft-spring group-hover:translate-x-[220%] arrow-default"
                    >
                      <path
                        d="M6.54942 1.17541L9.95703 4.58301M9.95703 4.58301L6.54942 7.99063M9.95703 4.58301L0.870074 4.58301"
                        stroke="black"
                        strokeWidth="1.13587"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg
                      width="32%"
                      viewBox="0 0 11 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute translate-x-[-220%] transition-transform duration-250 ease-soft-spring group-hover:translate-x-0 arrow-hover"
                    >
                      <path
                        d="M6.54942 1.17541L9.95703 4.58301M9.95703 4.58301L6.54942 7.99063M9.95703 4.58301L0.870074 4.58301"
                        stroke="black"
                        strokeWidth="1.13587"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </div>
            </div>
          </button>
          {clerkErrors && (
            <span className="text-sm text-red-500">{clerkErrors}</span>
          )}
        </form>
      </div>
    </motion.div>
  );
}
