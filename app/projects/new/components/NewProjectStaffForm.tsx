"use client";

import { useState } from "react";
import { Form } from "@heroui/react";
import MyInput from "@/components/Forms/components/Input";
import CustomButton from "@/components/custom-button";
import ImageUpload from "@/app/[username]/edit/components/ImageUpload";
import ProjectImageUpload from "./ProjectImageUpload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@clerk/nextjs";
import { AnimatePresence, motion } from "motion/react";
import { arrayMoveImmutable } from "array-move";

const fakeUserSchema = z.object({
  name: z.string().min(1, "User name is required"),
  image_url: z.string().min(1, "User image is required"),
});

// Define validation schema for project submission
const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  tools_used: z.string().min(1, "Please add at least one tool"),
  main_img_url: z.string().min(1, "Main project image is required"),
  thumbnail_url: z.string().min(1, "Thumbnail image is required"),
  banner_url: z.string().optional(),
  elements_url: z.array(z.string()).optional(),
  preview_gif_url: z.string().optional(),
  user: fakeUserSchema,
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface NewProjectFormProps {
  userId: string;
}

export default function NewProjectForm({ userId }: NewProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [elementImages, setElementImages] = useState<string[]>([]);
  const router = useRouter();
  const { session } = useSession();
  const supabase = createClient({ session });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    shouldFocusError: false,
    defaultValues: {
      title: "",
      tools_used: "",
      main_img_url: "",
      preview_gif_url: "",
      thumbnail_url: "",
      banner_url: "",
      elements_url: [],
      user: {
        name: "",
        image_url: "",
      },
    },
  });

  // Watch the image URLs to update the preview
  const bannerUrl = watch("banner_url");
  const mainImageUrl = watch("main_img_url");
  const thumbnailUrl = watch("thumbnail_url");
  const userImageUrl = watch("user.image_url");
  const previewGifUrl = watch("preview_gif_url");

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);

      // Convert tools string to array
      const toolsArray = data.tools_used
        .split(",")
        .map((tool) => tool.trim())
        .filter((tool) => tool.length > 0);

      // Insert project data
      const { data: projectData, error: projectError } = await supabase
        .from("project")
        .insert({
          title: data.title,
          slug: slug,
          tools_used: toolsArray,
          main_img_url: data.main_img_url,
          preview_gif_url: data.preview_gif_url || null,
          thumbnail_url: data.thumbnail_url,
          banner_url: data.banner_url || null,
          elements_url: elementImages.length > 0 ? elementImages : null,
          user_id: userId,
          is_staff_project: true,
          user_fake: {
            name: data.user.name,
            image_url: data.user.image_url,
          },
        })
        .select()
        .single();

      if (projectError) {
        console.log(projectError);
        setError(projectError.message);
        throw projectError;
      }

      setSuccess(true);
      // Redirect to the new project page after successful creation
      setTimeout(() => {
        router.push(`/projects/${projectData.slug}`);
      }, 2000);
    } catch (err: any) {
      console.error("Error creating project:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating your project"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addElementImage = (url: string) => {
    setElementImages((prev) => {
      const newElements = [...prev, url];
      setValue("elements_url", newElements);
      return newElements;
    });
  };

  const removeElementImage = (index: number) => {
    const newElements = elementImages.filter((_, i) => i !== index);
    setElementImages(newElements);
    setValue("elements_url", newElements);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full relative"
    >
      {/* Banner Upload Section */}
      <div className="w-full px-6 pt-4">
        <ProjectImageUpload
          label="Project Banner (Optional)"
          currentImages={bannerUrl ? [bannerUrl] : []}
          onImageAdded={(url) => setValue("banner_url", url)}
          onImageRemoved={() => setValue("banner_url", "")}
          bucketName="project-images"
          folder="banners"
          aspectRatio="aspect-[3/1]"
          userId={userId}
          maxImages={1}
          uploadAreaText="Drop banner image here or click to upload"
          supportedFormats="PNG, JPG, JPEG"
          maxFileSize="5MB"
          gridCols={1}
          isMultiple={false}
          placeholder="No banner image uploaded. Add a banner to showcase your project prominently."
        />
      </div>

      {/* Project Details Section */}
      <div className="px-6 py-8 space-y-6 w-full">
        <div className="flex flex-col gap-4 mt-8 w-fit">
          {/* Project Title */}
          <div className="space-y-2">
            <MyInput
              label="Project Title"
              type="text"
              {...register("title")}
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
            />
            <div className="flex flex-row items-end gap-4">
              <div className="w-48">
                <ProjectImageUpload
                  label="Project User Image"
                  currentImages={userImageUrl ? [userImageUrl] : []}
                  onImageAdded={(url) => setValue("user.image_url", url)}
                  onImageRemoved={() => setValue("user.image_url", "")}
                  bucketName="project-images"
                  folder="fake-users"
                  aspectRatio="aspect-square"
                  userId={userId}
                  maxImages={1}
                  uploadAreaText="Drop user image here"
                  supportedFormats="PNG, JPG, JPEG"
                  maxFileSize="5MB"
                  gridCols={1}
                  isMultiple={false}
                  shortInfo={true}
                  placeholder="Upload a square user image for your project."
                />
              </div>
              <MyInput
                label="Project User Name"
                type="text"
                placeholder="Enter your project user name"
                {...register("user.name")}
                isInvalid={!!errors.user?.name}
                errorMessage={errors.user?.name?.message}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full">
          {/* Thumbnail Image */}
          <div className="space-y-2 w-1/2">
            <div className="w-full">
              <ProjectImageUpload
                label="Thumbnail Image *"
                currentImages={thumbnailUrl ? [thumbnailUrl] : []}
                onImageAdded={(url) => setValue("thumbnail_url", url)}
                onImageRemoved={() => setValue("thumbnail_url", "")}
                bucketName="project-images"
                folder="thumbnails"
                aspectRatio="aspect-video"
                userId={userId}
                maxImages={1}
                uploadAreaText="Drop thumbnail here"
                supportedFormats="PNG, JPG, JPEG"
                maxFileSize="5MB"
                gridCols={1}
                isMultiple={false}
                placeholder="Upload a square thumbnail for your project."
              />
            </div>
            {errors.thumbnail_url && (
              <p className="text-sm text-red-500">
                {errors.thumbnail_url.message}
              </p>
            )}
          </div>
          {/* Preview Video */}
          <div className="space-y-2 w-1/2">
            <div className="w-full">
              <ProjectImageUpload
                label="Preview Video *"
                currentImages={previewGifUrl ? [previewGifUrl] : []}
                onImageAdded={(url) => setValue("preview_gif_url", url)}
                onImageRemoved={() => setValue("preview_gif_url", "")}
                bucketName="project-images"
                folder="previews"
                aspectRatio="aspect-video"
                userId={userId}
                maxImages={1}
                uploadAreaText="Drop preview video here"
                supportedFormats="MP4, WEBM, GIF"
                maxFileSize="5MB"
                gridCols={1}
                isMultiple={false}
                placeholder="Upload a preview video for your project."
              />
            </div>
            {errors.preview_gif_url && (
              <p className="text-sm text-red-500">
                {errors.preview_gif_url.message}
              </p>
            )}
          </div>
        </div>

        {/* Main Project Image */}
        <div className="space-y-2">
          <ProjectImageUpload
            label="Main Project Image *"
            currentImages={mainImageUrl ? [mainImageUrl] : []}
            onImageAdded={(url) => setValue("main_img_url", url)}
            onImageRemoved={() => setValue("main_img_url", "")}
            bucketName="project-images"
            folder="main"
            aspectRatio="aspect-video"
            userId={userId}
            maxImages={1}
            uploadAreaText="Drop main project image here or click to upload"
            supportedFormats="PNG, JPG, JPEG"
            maxFileSize="5MB"
            gridCols={1}
            isMultiple={false}
            placeholder="Upload the main image that represents your project best."
          />
          {errors.main_img_url && (
            <p className="text-sm text-red-500">
              {errors.main_img_url.message}
            </p>
          )}
        </div>

        {/* Element Images */}
        <div className="space-y-4">
          <div>
            <span className="text-black text-xl">Elements</span>
            <p className="text-[#ACACAC] text-xl">
              Add additional images to showcase different aspects of your
              project
            </p>
            <div className="w-full h-[1px] bg-[#EAEAEA] my-6"></div>
          </div>
          {/* Tools Used */}
          <div className="space-y-2">
            <MyInput
              label="Tools Used"
              type="text"
              placeholder="React, TypeScript, Tailwind CSS (comma separated)"
              {...register("tools_used")}
              isInvalid={!!errors.tools_used}
              errorMessage={errors.tools_used?.message}
            />
            <p className="text-sm text-gray-500">
              Separate multiple tools with commas
            </p>
          </div>
          <ProjectImageUpload
            currentImages={elementImages}
            onImageAdded={addElementImage}
            onImageRemoved={(url, index) => removeElementImage(index)}
            onImagesReordered={(oldIndex: number, newIndex: number) => {
              setElementImages((array) =>
                arrayMoveImmutable(array, oldIndex, newIndex)
              );
              setValue("elements_url", elementImages);
            }}
            bucketName="project-images"
            folder="elements"
            label="Element Images"
            aspectRatio="aspect-[16/9]"
            userId={userId}
            maxImages={4}
            uploadAreaText="Drop element images here or click to upload"
            supportedFormats="PNG, JPG, JPEG"
            maxFileSize="5MB"
            gridCols={2}
            isMultiple={true}
            placeholder="No element images added yet. Add images to showcase different aspects of your project."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center justify-end gap-4 px-8 pb-8">
        <CustomButton
          text="Cancel"
          href="/"
          inverted
          className="text-[#FA5A59] border-[#FA5A59]"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black px-6 py-2 rounded-xl text-white tracking-tight text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-8 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <p className="text-green-600 text-sm">
              Project created successfully! Redirecting...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
}
