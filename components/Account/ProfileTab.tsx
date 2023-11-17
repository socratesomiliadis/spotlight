import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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

export default function ProfileTab() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const [clerkErrors, setClerkErrors] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username ?? "",
      displayName: user?.firstName?.toString() ?? "",
      websiteURL: user?.unsafeMetadata?.websiteURL ?? "",
      role: user?.unsafeMetadata?.role ?? "Individual",
      country: user?.unsafeMetadata?.country ?? "",
      tagline: user?.unsafeMetadata?.tagline ?? "",
    },
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

    try {
      await user?.update({
        username: data.username,
        firstName: data.displayName,
        unsafeMetadata: {
          country: data.country,
          websiteURL: data.websiteURL,
          role: data.role,
          tagline: data.tagline,
        },
      });

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setClerkErrors(err.errors[0].longMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

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
              label="Username"
              size="lg"
              disableAnimation
              labelPlacement="outside"
              defaultValue={user?.username?.toString()}
              errorMessage={
                errors.username &&
                "Your username must be at least 3 characters long"
              }
              startContent={
                <span className="text-[#ACACAC] text-sm">spotlight.com/@</span>
              }
              className="spotlight-input w-full"
              isInvalid={!!errors.username}
              classNames={{
                //   innerWrapper: ["py-6"],
                inputWrapper: [
                  "bg-white pl-6 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: [
                  "font-medium text-sm data-[has-start-content=true]:ps-0",
                ],
              }}
              {...register("username", {
                required: true,
                validate: (value) => !!value && value.length >= 3,
              })}
            />
            <Input
              type="text"
              label="Display Name"
              labelPlacement="outside"
              size="lg"
              disableAnimation
              defaultValue={user?.firstName?.toString()}
              errorMessage={
                errors.displayName &&
                "Your display name must be at least 3 characters long"
              }
              className="spotlight-input w-full"
              isInvalid={!!errors.displayName}
              classNames={{
                inputWrapper: [
                  "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: ["font-medium text-sm"],
              }}
              {...register("displayName", {
                required: true,
                validate: (value) => !!value && value.length >= 3,
              })}
            />
            <Input
              type="text"
              label="Website URL"
              placeholder="https://example.com"
              labelPlacement="outside"
              size="lg"
              disableAnimation
              defaultValue={user?.unsafeMetadata?.websiteURL?.toString()}
              errorMessage={
                errors.websiteURL && "Please provide a valid website URL"
              }
              className="spotlight-input w-full"
              isInvalid={!!errors.websiteURL}
              classNames={{
                inputWrapper: [
                  "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: [
                  "font-medium text-sm placeholder:text-[#ACACAC] placeholder:font-normal",
                ],
              }}
              {...register("websiteURL", {
                required: false,
                pattern:
                  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g,
              })}
            />
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Select
                  label="What are you?"
                  labelPlacement="outside"
                  size="lg"
                  className="spotlight-select"
                  onChange={onChange}
                  //@ts-expect-error
                  selectedKeys={!!value ? [value] : []}
                  placeholder="Your role"
                  defaultSelectedKeys={["Individual"]}
                  classNames={{
                    trigger: [
                      "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                    ],
                    popoverContent: [
                      "bg-white px-3 py-2 border-[1px] border-[#E2E2E2] rounded-2xl shadow",
                    ],
                  }}
                >
                  <SelectItem
                    style={{
                      fontFamily: "Inter",
                    }}
                    className="px-4 data-[hover=true]:bg-[#F6F6F6] spotlight-select-item"
                    key="Individual"
                    textValue="Individual"
                  >
                    <span className="text-lg">Individual</span>
                  </SelectItem>
                  <SelectItem
                    style={{
                      fontFamily: "Inter",
                    }}
                    key="Studio"
                    className="px-4 data-[hover=true]:bg-[#F6F6F6] spotlight-select-item"
                    textValue="Studio"
                  >
                    <span className="text-lg"> Studio</span>
                  </SelectItem>
                </Select>
              )}
            />
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Autocomplete
                  label="Country"
                  labelPlacement="outside"
                  size="lg"
                  className="spotlight-input"
                  onSelectionChange={onChange}
                  //@ts-expect-error
                  selectedKey={value}
                  placeholder="Your country"
                  inputProps={{
                    classNames: {
                      inputWrapper: [
                        "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                      ],
                      input: [
                        "font-medium text-sm placeholder:text-[#ACACAC] placeholder:font-normal",
                      ],
                    },
                  }}
                  classNames={{
                    popoverContent: [
                      "bg-white px-3 py-2 border-[1px] border-[#E2E2E2] rounded-2xl shadow",
                    ],
                  }}
                >
                  {countries.map((country) => (
                    <AutocompleteItem
                      style={inter.style}
                      className="px-4 data-[hover=true]:bg-[#F6F6F6] spotlight-select-item"
                      key={country.name}
                      textValue={country.name}
                      startContent={
                        <Avatar
                          alt={`${country.name} flag`}
                          className="w-6 h-6"
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                        />
                      }
                    >
                      <span className="text-lg">{country.name}</span>
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              )}
            />
            <Input
              type="text"
              label="Tagline"
              placeholder="Your tagline"
              labelPlacement="outside"
              size="lg"
              disableAnimation
              className="spotlight-input w-full"
              classNames={{
                inputWrapper: [
                  "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
                ],
                input: [
                  "font-medium text-sm placeholder:text-[#ACACAC] placeholder:font-normal",
                ],
              }}
              {...register("tagline")}
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
