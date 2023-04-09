import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Input as InputCN } from "@/components/primitives/Input";

type Inputs = {
  firstName: string;
  lastName: string;
  tagline: string;
};

function Input({
  label,
  type,
  autocomplete,
  defaultValue,
  name,
  register,
  required,
}: {
  label: string;
  type: string;
  autocomplete: string;
  defaultValue: string | null;
  name: string;
  register: any;
  required: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm uppercase" htmlFor={name}>
        {label}
      </label>
      <input
        className="text-black pt-3 pb-2 rounded-2xl px-6 bg-[#eeeeee] focus:outline-none"
        type={type}
        defaultValue={defaultValue}
        autoComplete={autocomplete}
        {...register(name, { required })}
      />
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
    <form
      className="profile-form grid grid-cols-2 gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-row items-center">
        <div className="relative aspect-square w-[100px] h-auto overflow-hidden rounded-full">
          <Image
            src={user?.profileImageUrl as string}
            width={160}
            height={160}
            alt=""
          />
        </div>
        <div>
          <label
            htmlFor="file_input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Profile Image
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              id="file_input"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Input
          label="First Name"
          type="text"
          autocomplete="given-name"
          defaultValue={user!.firstName}
          name="firstName"
          register={register}
          required={true}
        />
        <Input
          label="Last Name"
          type="text"
          autocomplete="family-name"
          defaultValue={user!.lastName}
          name="lastName"
          register={register}
          required={true}
        />
      </div>

      <button type="submit"></button>
    </form>
  );
}
