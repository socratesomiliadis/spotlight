import { useRouter } from "next/router";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Avatar,
} from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
// import PhoneInput from "@/components/PhoneInput";
import { CircularProgress } from "@nextui-org/react";
import { countries } from "@/lib/countries";

export default function ProfileTab() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [pendingVerification, setPendingVerification] = useState(false);

  const [clerkErrors, setClerkErrors] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({});

  if (!isLoaded) {
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
      await user?.update({
        username: data.username,
        firstName: data.displayName,
        unsafeMetadata: {
          country: data.country,
        },
      });

      // send the email.
      //   await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setClerkErrors(err.errors[0].longMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (!isLoaded) return null;

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
          className="mt-6 grid grid-cols-2 gap-8 w-full"
        >
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
              input: ["font-medium text-sm data-[has-start-content=true]:ps-0"],
            }}
            {...register("username", {
              required: true,
              validate: (value) => value.length >= 3,
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
              validate: (value) => value.length >= 3,
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
              errors.displayName &&
              "Your display name must be at least 3 characters long"
            }
            className="spotlight-input w-full"
            isInvalid={!!errors.displayName}
            classNames={{
              inputWrapper: [
                "bg-white pl-5 border-[1px] border-[#E2E2E2] rounded-3xl shadow",
              ],
              input: [
                "font-medium text-sm placeholder:text-[#ACACAC] placeholder:font-normal",
              ],
            }}
            {...register("websiteURL", {
              required: true,
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
                selectedKeys={[value]}
                //@ts-expect-error
                defaultSelectedKeys={[
                  user?.unsafeMetadata?.role ?? "Individual",
                ]}
                placeholder="Your role"
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
                onChange={onChange}
                selectedKeys={[value]}
                defaultSelectedKeys={
                  user?.unsafeMetadata?.country
                    ? [user?.unsafeMetadata?.country]
                    : []
                }
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
                    style={{
                      fontFamily: "Inter",
                    }}
                    className="px-4 data-[hover=true]:bg-[#F6F6F6] spotlight-select-item"
                    key={country.code}
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
          {/* <PhoneInput
            register={register}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            countryName={countryName}
            setCountryName={setCountryName}
            //@ts-expect-error
            defaultCountry={user?.unsafeMetadata?.country}
            //@ts-expect-error
            defaultPhoneNumberWithCode={user?.unsafeMetadata?.phone_number}
            //@ts-expect-error
            hasError={errors.phoneNumber}
            width="500px"
          /> */}

          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-white text-black text-sm flex flex-row items-center gap-3"
          >
            {loading && (
              <CircularProgress
                size="sm"
                color="default"
                aria-label="Loading..."
                classNames={{
                  svg: "w-4 h-4",
                }}
              />
            )}
            <span>Save changes</span>
          </button>
          {clerkErrors && (
            <span className="text-sm text-red-500">{clerkErrors}</span>
          )}
        </form>
      </div>
    </motion.div>
  );
}
