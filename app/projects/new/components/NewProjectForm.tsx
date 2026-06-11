"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Form, SelectItem } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { arrayMoveImmutable } from "array-move"
import { useMutation } from "convex/react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import tagsJSON from "@/lib/tags.json"
import CustomButton from "@/components/custom-button"
import MyInput from "@/components/Forms/components/Input"
import MultiSelectCombobox from "@/components/Forms/components/MultiSelectCombobox"
import MySelect from "@/components/Forms/components/Select"

import ProjectImageUpload from "./ProjectImageUpload"
import UnclaimedUserSelector from "./UnclaimedUserSelector"

// Define validation schema for project submission
const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  main_img_url: z.string().min(1, "Main project image is required"),
  preview_url: z.string().optional(),
  banner_url: z.string().min(1, "Banner image is required"),
  elements_url: z.array(z.string()).optional(),
  live_url: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(["websites", "design", "films", "crypto", "startups", "ai"]),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface NewProjectFormProps {
  userId: string
  isStaff?: boolean
}

export default function NewProjectForm({
  userId,
  isStaff = false,
}: NewProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [elementImages, setElementImages] = useState<string[]>([])
  const [elementStorageIds, setElementStorageIds] = useState<string[]>([])
  const [mainImageStorageId, setMainImageStorageId] = useState<string>()
  const [bannerStorageId, setBannerStorageId] = useState<string>()
  const [previewStorageId, setPreviewStorageId] = useState<string>()
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const createProject = useMutation(api.projects.create)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    shouldFocusError: false,
    defaultValues: {
      title: "",
      tags: [],
      main_img_url: "",
      preview_url: "",
      banner_url: "",
      elements_url: [],
      live_url: "",
      description: "",
      category: "websites",
    },
  })

  // Watch the image URLs to update the preview
  const bannerUrl = watch("banner_url")
  const mainImageUrl = watch("main_img_url")
  const previewUrl = watch("preview_url")
  const tags = watch("tags")
  const category = watch("category")

  async function insertProject(data: ProjectFormValues) {
    try {
      const projectData = await createProject({
        title: data.title,
        tags: data.tags,
        mainImageStorageId: mainImageStorageId as any,
        previewStorageId: previewStorageId as any,
        bannerStorageId: bannerStorageId as any,
        elementStorageIds: elementStorageIds as any,
        ownerAuthUserId: isStaff && selectedUserId ? selectedUserId : userId,
        category: data.category,
        liveUrl: data.live_url || undefined,
      })

      // Redirect to the new project page after successful creation
      setTimeout(() => {
        router.push(`/projects/${projectData.slug}`)
      }, 2000)
    } catch (err: any) {
      console.error("Error creating project:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProjectFormValues) => {
    // Validate that a user is selected when in staff mode
    if (isStaff && !selectedUserId) {
      toast.error("Please select or create a user before creating the project.")
      return
    }

    setIsLoading(true)
    toast.promise(insertProject(data), {
      loading: "Creating project...",
      success: "Project created successfully! Redirecting...",
      error: (err) =>
        err instanceof Error
          ? err.message
          : "Failed to create project. Please try again.",
    })
  }

  const addElementImage = (url: string, storageId?: string) => {
    setElementImages((prev) => {
      const newElements = [...prev, url]
      setValue("elements_url", newElements)
      return newElements
    })
    if (storageId) {
      setElementStorageIds((prev) => [...prev, storageId])
    }
  }

  const removeElementImage = (index: number) => {
    const newElements = elementImages.filter((_, i) => i !== index)
    setElementImages(newElements)
    setElementStorageIds((ids) => ids.filter((_, i) => i !== index))
    setValue("elements_url", newElements)
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full relative"
    >
      {/* Banner Upload Section */}
      <div className="w-full px-6 pt-4">
        <ProjectImageUpload
          label="Project Banner *"
          currentImages={bannerUrl ? [bannerUrl] : []}
          onImageAdded={(url, storageId) => {
            setValue("banner_url", url)
            setBannerStorageId(storageId)
          }}
          onImageRemoved={() => setValue("banner_url", "")}
          bucketName="project-images"
          folder="banners"
          aspectRatio="aspect-3/1"
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

      {/* Staff User Selection Section */}
      {isStaff && (
        <div className="px-6 py-4 border-b border-gray-200 w-full">
          <UnclaimedUserSelector
            onUserSelected={(userId) => {
              setSelectedUserId(userId)
            }}
            selectedUserId={selectedUserId}
          />
        </div>
      )}

      {/* Project Details Section */}
      <div className="px-6 py-8 space-y-6 w-full">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-black text-xl">Project Details</span>
          {/* Project Title and Category */}
          <div className="w-full flex flex-row gap-4">
            <MyInput
              label="Project Title *"
              type="text"
              {...register("title")}
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
            />
            <div className="w-full">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <MySelect
                    label="Category"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string
                      field.onChange(selectedKey)
                    }}
                    isInvalid={!!errors.category}
                    errorMessage={errors.category?.message}
                    className="w-full"
                  >
                    <SelectItem key="websites" textValue="Websites">
                      Websites
                    </SelectItem>
                    <SelectItem key="design" textValue="Design">
                      Design
                    </SelectItem>
                    <SelectItem key="films" textValue="Films">
                      Films
                    </SelectItem>
                    <SelectItem key="crypto" textValue="Crypto">
                      Crypto
                    </SelectItem>
                    <SelectItem key="startups" textValue="Startups">
                      Startups
                    </SelectItem>
                    <SelectItem key="ai" textValue="AI">
                      AI
                    </SelectItem>
                  </MySelect>
                )}
              />
            </div>
          </div>
          <MyInput
            label="Project URL *"
            type="text"
            {...register("live_url")}
            isInvalid={!!errors.live_url}
            errorMessage={errors.live_url?.message}
          />
        </div>
        <div className="w-full grid grid-cols-2 gap-4">
          {/* Main Project Image */}
          <div className="space-y-2 w-full">
            <ProjectImageUpload
              label="Main Project Image *"
              currentImages={mainImageUrl ? [mainImageUrl] : []}
              onImageAdded={(url, storageId) => {
                setValue("main_img_url", url)
                setMainImageStorageId(storageId)
              }}
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
          {/* Preview Video */}
          <div className="space-y-2 w-full">
            <div className="w-full relative">
              <span className="absolute -bottom-7 left-0">
                You can use our{" "}
                <Link
                  href="https://video-tool.spotlight.day"
                  target="_blank"
                  className="underline"
                >
                  Video Tool
                </Link>{" "}
                to optimize your preview video.
              </span>
              <ProjectImageUpload
                label="Preview Video *"
                currentImages={previewUrl ? [previewUrl] : []}
                onImageAdded={(url, storageId) => {
                  setValue("preview_url", url)
                  setPreviewStorageId(storageId)
                }}
                onImageRemoved={() => setValue("preview_url", "")}
                bucketName="project-images"
                folder="previews"
                aspectRatio="aspect-video"
                userId={userId}
                maxImages={1}
                uploadAreaText="Drop preview video here"
                supportedFormats="WEBM"
                maxFileSize="5MB"
                gridCols={1}
                isMultiple={false}
                placeholder="Upload a preview video for your project."
              />
            </div>
            {errors.preview_url && (
              <p className="text-sm text-red-500">
                {errors.preview_url.message}
              </p>
            )}
          </div>
        </div>

        {/* Element Images */}
        <div className="space-y-4">
          <div>
            <span className="text-black text-xl">Elements</span>
            <p className="text-[#ACACAC] text-xl">
              Add additional images to showcase different aspects of your
              project
            </p>
            <div className="w-full h-px bg-[#EAEAEA] my-3"></div>
          </div>
          {/* Tools Used */}
          <div className="space-y-2">
            <MultiSelectCombobox
              label="Tags"
              placeholder="Search and select tags..."
              value={tags}
              onChange={(value) => setValue("tags", value)}
              options={tagsJSON.categories[category]}
              isInvalid={!!errors.tags}
              errorMessage={errors.tags?.message}
            />
          </div>
          <ProjectImageUpload
            currentImages={elementImages}
            onImageAdded={addElementImage}
            label="Element Images"
            onImageRemoved={(url, index) => removeElementImage(index)}
            onImagesReordered={(oldIndex: number, newIndex: number) => {
              setElementImages((array) =>
                arrayMoveImmutable(array, oldIndex, newIndex)
              )
              setElementStorageIds((array) =>
                arrayMoveImmutable(array, oldIndex, newIndex)
              )
              setValue("elements_url", elementImages)
            }}
            bucketName="project-images"
            folder="elements"
            aspectRatio="aspect-video"
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
      <div className="flex flex-row items-center justify-between w-full gap-4 px-8 pb-8">
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
    </Form>
  )
}
