import { useForm, SubmitHandler, set } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { supabaseClientWithAuth } from "@/utils/helpers";
import { toast } from "sonner";
import { useProfilePopup } from "@/hooks/useProfilePopup";
import { Twitter, Instagram, LinkedinIcon } from "lucide-react";

type Inputs = {
  tagline: string;
  occupation: string;
  location: string;
  website: string;
  twitter: string;
  instagram: string;
  read_cv: string;
  linkedin: string;
  behance: string;
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
        read_cv: inputData.read_cv,
        linkedin: inputData.linkedin,
        behance: inputData.behance,
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
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                viewBox="0 0 28 28"
                className="-mr-1"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.809 5.242a1.25 1.25 0 00-1.531.884L6.042 18.2a1.25 1.25 0 00.884 1.53l9.66 2.59a1.25 1.25 0 001.53-.885l3.236-12.074a1.25 1.25 0 00-.884-1.53l-9.66-2.589zm-2.98.496a2.75 2.75 0 013.368-1.945l9.66 2.588A2.75 2.75 0 0122.8 9.75l-3.236 12.074a2.75 2.75 0 01-3.368 1.945L6.538 21.18a2.75 2.75 0 01-1.944-3.368L7.829 5.738z"
                  fill="#000"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.518 8.27a.75.75 0 01.919-.53l7.241 1.94a.75.75 0 01-.388 1.449l-7.242-1.94a.75.75 0 01-.53-.919zM9.677 11.41a.75.75 0 01.918-.531l7.242 1.94a.75.75 0 11-.388 1.45l-7.242-1.941a.75.75 0 01-.53-.919zM8.836 14.549a.75.75 0 01.918-.53l4.83 1.293a.75.75 0 11-.388 1.45l-4.83-1.295a.75.75 0 01-.53-.918z"
                  fill="#000"
                ></path>
              </svg>
            }
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
          <SocialInput
            link="https://linkedin.com/in/"
            icon={
              <LinkedinIcon
                className="mb-1"
                fill="#000"
                stroke="#00000000"
                size={22}
              />
            }
            label="LinkedIn"
            type="text"
            autocomplete="username"
            name="linkedin"
            watch={watch}
            register={register}
            defaultValue={profileData?.socials?.linkedin}
            validationObj={{
              pattern: /^[a-z0-9_\.]+$/,
            }}
            error={errors.linkedin}
            errorMessage="Provide a valid LinkedIn handle"
          />
          <SocialInput
            link="https://behance.net/"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                className="mb-1"
                viewBox="0 0 24 24"
              >
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
              </svg>
            }
            label="Behance"
            type="text"
            autocomplete="username"
            name="behance"
            watch={watch}
            register={register}
            defaultValue={profileData?.socials?.behance}
            validationObj={{
              pattern: /^[a-z0-9_\.]+$/,
            }}
            error={errors.behance}
            errorMessage="Provide a valid Behance handle"
          />
        </div>
      </form>
    </div>
  );
}
