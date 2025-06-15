"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Form } from "@heroui/react";
import MyInput from "@/components/Forms/components/Input";
import CustomButton from "@/components/custom-button";
import ImageUpload from "./ImageUpload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@clerk/nextjs";
import { AnimatePresence, motion } from "motion/react";

// Define validation schema with social links
const profileSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  location: z.string().optional(),
  website_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  avatar_url: z.string().optional(),
  banner_url: z.string().optional(),
  // Social links
  linkedin: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("Please enter a valid Instagram URL")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Please enter a valid Twitter URL")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  user: {
    banner_url?: string;
    avatar_url?: string;
    display_name?: string;
    username?: string;
    location?: string;
    website_url?: string;
    user_id: string;
    socials?: {
      linkedin?: string;
      instagram?: string;
      twitter?: string;
    };
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { session } = useSession();
  const supabase = createClient({ session });

  const displayName = user.display_name || user.username || "User";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: user.display_name || "",
      location: user.location || "",
      website_url: user.website_url || "",
      avatar_url: user.avatar_url || "",
      banner_url: user.banner_url || "",
      linkedin: user.socials?.linkedin || "",
      instagram: user.socials?.instagram || "",
      twitter: user.socials?.twitter || "",
    },
  });

  // Watch the image URLs to update the preview
  const bannerUrl = watch("banner_url");
  const avatarUrl = watch("avatar_url");

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Update profile data
      const { error: profileError } = await supabase
        .from("profile")
        .update({
          display_name: data.display_name,
          location: data.location || null,
          website_url: data.website_url || null,
          avatar_url: data.avatar_url || null,
          banner_url: data.banner_url || null,
        })
        .eq("user_id", user.user_id);

      if (profileError) {
        console.log(profileError);
        setError(profileError.message);
        throw profileError;
      }

      // Handle social links - upsert a single record with all social links
      const socialLinksData = {
        user_id: user.user_id,
        linked_in: data.linkedin || null,
        instagram: data.instagram || null,
        twitter: data.twitter || null,
      };

      const { error: socialsError } = await supabase
        .from("socials")
        .upsert(socialLinksData, {
          onConflict: "user_id",
        });

      if (socialsError) {
        console.log(socialsError);
        setError(socialsError.message);
        throw socialsError;
      }

      setSuccess(true);
      // Redirect back to profile page after successful update
      setTimeout(() => {
        setSuccess(false);
        setError(null);
        router.refresh();
      }, 3000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating your profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-3 pb-10">
      {/* Banner Upload Section - matches ProfileHeader layout */}
      <div className="w-full aspect-[3/1] bg-[#f6f6f6] rounded-2xl overflow-hidden relative">
        <ImageUpload
          label="Banner Image"
          currentImageUrl={bannerUrl}
          onImageUploaded={(url) => setValue("banner_url", url)}
          onImageRemoved={() => setValue("banner_url", "")}
          bucketName="profile-images"
          folder="banners"
          aspectRatio="aspect-[3/1]"
          userId={user.user_id}
          className="absolute inset-0 h-full"
          displayAreaClassName="rounded-2xl"
          showInfoText={true}
        />
      </div>

      {/* Profile Image Upload Section - matches ProfileHeader positioning */}
      <div className="w-full flex flex-row items-start justify-between relative -mt-[5.5rem] pl-8 pr-6 pointer-events-none">
        <div className="w-40 h-40 relative pointer-events-auto">
          <ImageUpload
            label="Profile Image"
            currentImageUrl={avatarUrl}
            onImageUploaded={(url) => setValue("avatar_url", url)}
            onImageRemoved={() => setValue("avatar_url", "")}
            bucketName="profile-images"
            folder="avatars"
            aspectRatio="aspect-square"
            userId={user.user_id}
            className="w-40 h-40 rounded-xl overflow-hidden outline outline-[0.7rem] outline-white"
            displayAreaClassName="rounded-xl"
            showRemoveButton={false}
          />
        </div>

        <div className="flex flex-row items-center gap-2 mt-24 pointer-events-auto">
          <CustomButton
            text="Cancel"
            href={`/${user.username}`}
            inverted
            className="text-[#FA5A59] border-[#FA5A59]"
          />
          {/* <button
            type="submit"
            disabled={isLoading}
            className="bg-black px-6 py-2 rounded-xl text-white tracking-tight text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button> */}
          <CustomButton
            text={isLoading ? "Saving..." : "Save Changes"}
            type="submit"
          />
        </div>
      </div>

      {/* Form Fields Section - matches ProfileHeader spacing */}
      <div className="flex-col pl-8 mt-4 gap-y-2 gap-x-2 relative w-[66.6%] grid grid-cols-2">
        <h3 className="text-lg font-semibold tracking-tight w-fit col-span-2">
          Profile Info
        </h3>
        <MyInput
          label="Name"
          {...register("display_name")}
          isInvalid={!!errors.display_name}
          errorMessage={errors.display_name?.message}
        />
        <div></div>

        <MyInput
          label="Location"
          {...register("location")}
          isInvalid={!!errors.location}
          errorMessage={errors.location?.message}
        />
        <MyInput
          label="Website URL"
          {...register("website_url")}
          isInvalid={!!errors.website_url}
          errorMessage={errors.website_url?.message}
        />
      </div>
      {/* Social Links Section */}
      <div className="flex flex-col gap-2 mt-8 w-full  pl-8 pr-6">
        <h3 className="text-lg font-semibold tracking-tight">Social Links</h3>
        <div className="grid grid-cols-3 gap-2 w-full">
          <MyInput
            label="LinkedIn URL"
            {...register("linkedin")}
            isInvalid={!!errors.linkedin}
            errorMessage={errors.linkedin?.message}
          />
          <MyInput
            label="Instagram URL"
            {...register("instagram")}
            isInvalid={!!errors.instagram}
            errorMessage={errors.instagram?.message}
          />
          <MyInput
            label="Twitter URL"
            {...register("twitter")}
            isInvalid={!!errors.twitter}
            errorMessage={errors.twitter?.message}
          />
        </div>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl z-50"
          >
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 100, x: "-50%", scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl z-50"
          >
            <p className="text-green-800">Profile updated successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
}
