import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Input as InputCN } from "@/components/primitives/Input";

type Inputs = {
  tagline: string;
  occupation: string;
  location: string;
  website: string;
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
  errorMessage?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" htmlFor={name}>
        {label}
      </label>
      <input
        className="text-black pt-3 pb-2 rounded-xl px-6 bg-[#f4f4f4]/70 focus:outline-none"
        type={type}
        defaultValue={defaultValue ? defaultValue : ""}
        autoComplete={autocomplete}
        {...register(name, validationObj)}
      />
      {error && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default function ProfileForm() {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="flex flex-col">
      <h3 className="font-medium leading-[2]">Social Links</h3>
      <div className="w-full h-[1px] bg-[#f1f1f1]"></div>
      <form
        className="profile-form mt-6 gap-8"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="What do you do?"
            type="text"
            autocomplete=""
            name="occupation"
            register={register}
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
            register={register}
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
            register={register}
            validationObj={{
              pattern:
                /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
            }}
            error={errors.website}
            errorMessage="Please enter a valid URL"
          />
        </div>

        <button
          className="text-white mt-4 px-10 py-3 flex bg-black rounded-full"
          type="submit"
        >
          <span className="-mb-1">Submit</span>
        </button>
      </form>
    </div>
  );
}
