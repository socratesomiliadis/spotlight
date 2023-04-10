import { useForm, SubmitHandler, set } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { supabaseClientWithAuth } from "@/utils/helpers";
import { toast } from "sonner";
import { useProfilePopup } from "@/hooks/useProfilePopup";
import { useState, useEffect } from "react";
import { Twitter, Instagram } from "lucide-react";

type Inputs = {
  tagline: string;
  occupation: string;
  location: string;
  website: string;
  twitter: string;
  instagram: string;
  read_cv: string;
};

function Input({
  label,
  type,
  autocomplete,
  defaultValue,
  name,
  register,
  validationObj,
  error,
  watch,
  errorMessage,
}: {
  label: string;
  type: string;
  autocomplete: string;
  defaultValue?: string | null;
  name: string;
  register: any;
  validationObj: any;
  error?: any;
  watch: any;
  errorMessage?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full flex flex-row items-center justify-between">
        <label className="text-base" htmlFor={name}>
          {label}
        </label>
        <span>
          {validationObj?.maxLength && (
            <span className="text-[#8F8F8F] text-xs tracking-wide">
              {!!watch(name)?.length
                ? watch(name)?.length
                : defaultValue?.length
                ? defaultValue?.length
                : 0}
              /{validationObj.maxLength}
            </span>
          )}
        </span>
      </div>
      <input
        className="text-black pt-3 pb-2 rounded-xl px-4 bg-[#f4f4f4]/70 focus:outline-none"
        type={type}
        defaultValue={defaultValue ? defaultValue : ""}
        autoComplete={autocomplete}
        {...register(name, validationObj)}
      />
      {error && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}

function SocialInput({
  link,
  icon,
  label,
  type,
  autocomplete,
  defaultValue,
  name,
  register,
  validationObj,
  error,
  watch,
  errorMessage,
}: {
  link: string;
  icon?: React.ReactNode;
  label: string;
  type: string;
  autocomplete: string;
  defaultValue?: string | null;
  name: string;
  register: any;
  validationObj: any;
  error?: any;
  watch: any;
  errorMessage?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex flex-row items-center justify-between">
        <label
          className="text-base flex flex-row items-center gap-2"
          htmlFor={name}
        >
          {icon}
          <span className="-mb-1">{label}</span>
        </label>
        <span>
          {validationObj?.maxLength && (
            <span className="text-[#8F8F8F] text-xs tracking-wide">
              {!!watch(name)?.length
                ? watch(name)?.length
                : defaultValue?.length
                ? defaultValue?.length
                : 0}
              /{validationObj.maxLength}
            </span>
          )}
        </span>
      </div>
      <div className="text-black rounded-xl px-4 bg-[#f4f4f4]/70 flex flex-row items-center">
        <span className="text-[#8f8f8f] pt-3 pb-2">{link}</span>
        <input
          className="bg-transparent pt-3 pb-2 focus-within:bg-transparent rounded-xl focus:outline-none"
          type={type}
          defaultValue={defaultValue ? defaultValue : ""}
          autoComplete={autocomplete}
          {...register(name, validationObj)}
        />
      </div>
      {error && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default function ProfileForm({ profileData }: { profileData: any }) {
  const { user } = useUser();
  const { getToken, userId } = useAuth();
  const { setIsProfilePopupOpen } = useProfilePopup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const updateDatabaseRecords = async (inputData: Inputs) => {
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(
      supabaseAccessToken as string
    );

    const profileUpsert = await supabase
      .from("profile")
      .upsert({
        user_id: userId,
        username: user?.username,
        tagline: inputData.tagline,
        occupation: inputData.occupation,
        location: inputData.location,
        website: inputData.website,
      })
      .select();

    const socialsUpsert = await supabase
      .from("socials")
      .upsert({
        user_id: userId,
        twitter: inputData.twitter,
        instagram: inputData.instagram,
      })
      .select();

    if (profileUpsert.error || socialsUpsert.error) {
      throw new Error("Server Error. Please try again later.");
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    toast.promise(updateDatabaseRecords(formData), {
      loading: "Loading...",
      success: () => {
        setIsProfilePopupOpen(false);
        return "Profile updated successfully";
      },
      error: "Server Error. Please try again later.",
    });
  };

  return (
    <div className="flex flex-col">
      <form
        id="profileForm"
        className="profile-form gap-8"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="font-medium leading-[2]">General Information</h3>
        <div className="w-full h-[1px] bg-[#f1f1f1]"></div>
        <div className=" mt-6 flex flex-col gap-4">
          <Input
            label="Tagline"
            type="text"
            autocomplete=""
            name="tagline"
            watch={watch}
            register={register}
            defaultValue={profileData?.tagline}
            validationObj={{
              minLength: 0,
              maxLength: 48,
            }}
            error={errors.tagline}
            errorMessage="Tagline must be less than 48 characters"
          />
          <Input
            label="What do you do?"
            type="text"
            autocomplete=""
            name="occupation"
            watch={watch}
            register={register}
            defaultValue={profileData?.occupation}
            validationObj={{
              minLength: 0,
              maxLength: 24,
            }}
            error={errors.occupation}
            errorMessage="Occupation must be less than 24 characters"
          />
          <Input
            label="Location"
            type="text"
            autocomplete=""
            name="location"
            watch={watch}
            register={register}
            defaultValue={profileData?.location}
            validationObj={{
              minLength: 0,
              maxLength: 24,
            }}
            error={errors.location}
            errorMessage="Location must be less than 24 characters"
          />
          <Input
            label="Website"
            type="url"
            autocomplete=""
            name="website"
            watch={watch}
            register={register}
            defaultValue={profileData?.website}
            validationObj={{
              pattern:
                /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
            }}
            error={errors.website}
            errorMessage="Please enter a valid URL"
          />
        </div>
        <h3 className="mt-6 font-medium leading-[2]">Social Media</h3>
        <div className="w-full h-[1px] bg-[#f1f1f1]"></div>
        <div className=" mt-6 flex flex-col gap-6">
          <SocialInput
            link="https://twitter.com/"
            icon={<Twitter fill="#000" stroke="#00000000" size={22} />}
            label="Twitter"
            type="text"
            autocomplete="username"
            name="twitter"
            watch={watch}
            register={register}
            defaultValue={profileData?.socials?.twitter}
            validationObj={{
              pattern: /^[a-z0-9_\.]+$/,
            }}
            error={errors.twitter}
            errorMessage="Provide a valid Twitter handle"
          />
          <SocialInput
            link="https://instagram.com/"
            icon={<Instagram stroke="#000000" size={22} />}
            label="Instagram"
            type="text"
            autocomplete="username"
            name="instagram"
            watch={watch}
            register={register}
            defaultValue={profileData?.socials?.instagram}
            validationObj={{
              pattern: /^[a-z0-9_\.]+$/,
            }}
            error={errors.instagram}
            errorMessage="Provide a valid Instagram handle"
          />
          <SocialInput
            link="https://read.cv/"
            label="Read CV"
            type="text"
            autocomplete="username"
            name="read_cv"
            watch={watch}
            register={register}
            defaultValue={profileData?.socials?.read_cv}
            validationObj={{
              pattern: /^[a-z0-9_\.]+$/,
            }}
            error={errors.read_cv}
            errorMessage="Provide a valid Read CV handle"
          />
        </div>
      </form>
    </div>
  );
}
