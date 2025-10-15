"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useSession } from "@clerk/nextjs"
import { AnimatePresence, motion, Reorder } from "motion/react"
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort"

import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface ProjectImageUploadProps {
  label?: string
  currentImages?: string[]
  onImageAdded: (url: string) => void
  onImageRemoved?: (url: string, index: number) => void
  onImagesReordered?: (oldIndex: number, newIndex: number) => void
  bucketName: string
  folder: string
  aspectRatio?: string
  className?: string
  userId: string
  maxImages?: number
  uploadAreaText?: string
  supportedFormats?: string
  maxFileSize?: string
  gridCols?: number
  isMultiple?: boolean
  placeholder?: string
  shortInfo?: boolean
}

export default function ProjectImageUpload({
  label,
  currentImages = [],
  onImageAdded,
  onImageRemoved,
  onImagesReordered,
  bucketName,
  folder,
  aspectRatio = "aspect-3/2",
  className = "",
  userId,
  maxImages = 10,
  uploadAreaText = "Drop images here or click to upload",
  supportedFormats = "PNG, JPG, JPEG",
  maxFileSize = "5MB",
  gridCols = 2,
  isMultiple = true,
  placeholder = "No images uploaded yet",
  shortInfo = false,
}: ProjectImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number
  }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { session } = useSession()
  const supabase = createClient({ session })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (isMultiple) {
      processMultipleFiles(files)
    } else {
      processFile(files[0])
    }

    // Reset input to allow re-uploading the same file
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    if (isMultiple) {
      processMultipleFiles(files)
    } else {
      processFile(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const processMultipleFiles = (files: File[]) => {
    // Check if adding these files would exceed the limit
    const remainingSlots = maxImages - currentImages.length
    if (files.length > remainingSlots) {
      setError(
        `You can only upload ${remainingSlots} more image(s). Maximum is ${maxImages}.`
      )
      return
    }

    files.forEach((file) => processFile(file))
  }

  const processFile = (file: File) => {
    // Validate file type
    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/webm")
    ) {
      setError("Please select image or webm video files only")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(
        `File "${file.name}" is too large. Maximum size is ${maxFileSize}.`
      )
      return
    }

    // Upload file
    uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    setError(null)

    const fileId = `${file.name}-${Date.now()}`
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

    try {
      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split(".").pop()
      const filename = `${userId}/${folder}/${timestamp}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExtension}`

      // Simulate upload progress (since Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: Math.min((prev[fileId] || 0) + Math.random() * 30, 90),
        }))
      }, 200)

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        })

      clearInterval(progressInterval)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename)

      if (publicUrlData?.publicUrl) {
        setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })
        }, 500)

        onImageAdded(publicUrlData.publicUrl)
        setError(null)
      } else {
        throw new Error("Failed to get public URL")
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || `Failed to upload "${file.name}"`)
      setUploadProgress((prev) => {
        const newProgress = { ...prev }
        delete newProgress[fileId]
        return newProgress
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    if (!isMultiple && currentImages.length >= 1) return
    if (isMultiple && currentImages.length >= maxImages) return
    fileInputRef.current?.click()
  }

  const handleChangeImage = async (index: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*, video/webm"
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      // Validate file type
      if (
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/webm")
      ) {
        setError("Please select image or webm video files only")
        return
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError(`File is too large. Maximum size is ${maxFileSize}.`)
        return
      }

      // Remove the old image first
      const oldUrl = currentImages[index]
      await handleRemoveImage(oldUrl, index)

      // Upload the new image
      await uploadImage(file)
    }
    input.click()
  }

  const handleRemoveImage = async (url: string, index: number) => {
    if (!onImageRemoved) return

    try {
      // Extract filename from URL and delete from storage
      const filename = extractFilenameFromUrl(url)
      if (filename) {
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([filename])

        if (deleteError) {
          console.error("Error deleting file:", deleteError)
        }
      }

      onImageRemoved(url, index)
    } catch (err: any) {
      console.error("Error removing image:", err)
      setError("Failed to remove image")
    }
  }

  const extractFilenameFromUrl = (url: string): string | null => {
    try {
      const urlParts = url.split("/")
      const bucketIndex = urlParts.findIndex((part) => part === bucketName)
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        return urlParts.slice(bucketIndex + 1).join("/")
      }
      return null
    } catch {
      return null
    }
  }

  const canUploadMore = isMultiple
    ? currentImages.length < maxImages
    : currentImages.length === 0
  const gridColsClass = `grid-cols-${gridCols}`

  return (
    <div className={`w-full relative flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{label}</h3>
          {isMultiple && (
            <span className="text-sm text-gray-500">
              {currentImages.length} / {maxImages} images
              {currentImages.length > 1 && (
                <span className="ml-2 text-xs text-gray-400">
                  • Drag to reorder
                </span>
              )}
            </span>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, video/webm"
        multiple={isMultiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Existing Images Grid */}
      {currentImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isMultiple && currentImages.length > 1 && onImagesReordered ? (
            <SortableList
              onSortEnd={onImagesReordered}
              className={cn("grid gap-4", `grid-cols-${gridCols}`)}
              draggedItemClassName="dragged"
            >
              {currentImages.map((url, index) => (
                <SortableItem key={url}>
                  <div
                    className={cn(
                      "relative group cursor-grab overflow-hidden rounded-xl bg-gray-100 select-none",
                      aspectRatio
                    )}
                  >
                    <img
                      src={url}
                      alt={`Project image ${index + 1}`}
                      className="object-cover w-full h-full pointer-events-none"
                    />
                    {onImageRemoved && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <div className="flex flex-row gap-3 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleChangeImage(index)
                            }}
                            className="size-16 hover:scale-90 transition-all duration-300 rounded-full bg-white/20 flex items-center justify-center text-white"
                            title="Change image"
                          >
                            <svg
                              width="40%"
                              viewBox="0 0 34 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.581 30.23C10.581 28.8892 10.581 28.2189 10.6308 27.6537C11.1842 21.3719 16.1989 16.3914 22.524 15.8418C23.0931 15.7923 23.7681 15.7923 25.118 15.7923H28.4708M28.4708 15.7923C28.2524 15.0431 27.8097 14.2517 27.0197 12.8394L24.8692 8.9949C23.9016 7.26513 23.4178 6.40024 22.7297 5.77046C22.1209 5.21331 21.3994 4.79167 20.6134 4.53374C19.7249 4.24219 18.7287 4.24219 16.7363 4.24219L13.1479 4.24219C11.1555 4.24219 10.1593 4.24219 9.27083 4.53374C8.4848 4.79167 7.76329 5.21331 7.15454 5.77046C6.46643 6.40025 5.98263 7.26513 5.01503 8.9949L2.91524 12.7487C1.99908 14.3865 1.54099 15.2054 1.3614 16.0727C1.20245 16.8403 1.20245 17.6319 1.3614 18.3995C1.54099 19.2667 1.99908 20.0856 2.91525 21.7235L5.01504 25.4773C5.98263 27.207 6.46643 28.0719 7.15454 28.7017C7.76329 29.2589 8.4848 29.6805 9.27083 29.9384C10.1593 30.23 11.1555 30.23 13.1479 30.23H16.8209C18.7841 30.23 19.7656 30.23 20.6438 29.9457C21.4208 29.6943 22.1356 29.283 22.7418 28.7387C23.4269 28.1235 23.9152 27.2778 24.8918 25.5864L26.3787 23.0111L27.0964 21.6742C27.9669 20.0528 28.4021 19.2421 28.5683 18.3878C28.7153 17.6316 28.7085 16.8537 28.5484 16.1001C28.5265 15.9973 28.5008 15.8952 28.4708 15.7923ZM10.581 14.3485C9.77815 14.3485 9.1273 13.7022 9.1273 12.9048C9.1273 12.1074 9.77815 11.461 10.581 11.461C11.3839 11.461 12.0347 12.1074 12.0347 12.9048C12.0347 13.7022 11.3839 14.3485 10.581 14.3485Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M33 4.5C33 4.71478 32.8259 4.88889 32.6111 4.88889L29.8889 4.88889L29.8889 7.61111C29.8889 7.82589 29.7148 8 29.5 8C29.2852 8 29.1111 7.82589 29.1111 7.61111L29.1111 4.88889L26.3889 4.88889C26.1741 4.88889 26 4.71478 26 4.5C26 4.28522 26.1741 4.11111 26.3889 4.11111L29.1111 4.11111L29.1111 1.38889C29.1111 1.17411 29.2852 1 29.5 1C29.7148 1 29.8889 1.17411 29.8889 1.38889L29.8889 4.11111L32.6111 4.11111C32.8259 4.11111 33 4.28522 33 4.5Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveImage(url, index)
                            }}
                            className="size-16 hover:scale-90 transition-all duration-300 rounded-full bg-white/20 flex items-center justify-center text-white"
                            title="Remove image"
                          >
                            <svg
                              width="35%"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.68964 18.3144L2.94119 18.3627L3.68964 18.3144ZM16.3104 18.3144L17.0588 18.3627V18.3627L16.3104 18.3144ZM0.75 3C0.335786 3 0 3.33579 0 3.75C0 4.16421 0.335786 4.5 0.75 4.5V3ZM19.25 4.5C19.6642 4.5 20 4.16421 20 3.75C20 3.33579 19.6642 3 19.25 3V4.5ZM8.5 8.75C8.5 8.33579 8.16421 8 7.75 8C7.33579 8 7 8.33579 7 8.75H8.5ZM7 14.25C7 14.6642 7.33579 15 7.75 15C8.16421 15 8.5 14.6642 8.5 14.25H7ZM13 8.75C13 8.33579 12.6642 8 12.25 8C11.8358 8 11.5 8.33579 11.5 8.75H13ZM11.5 14.25C11.5 14.6642 11.8358 15 12.25 15C12.6642 15 13 14.6642 13 14.25H11.5ZM13.1477 3.93694C13.2509 4.33808 13.6598 4.57957 14.0609 4.47633C14.4621 4.37308 14.7036 3.9642 14.6003 3.56306L13.1477 3.93694ZM2.00156 3.79829L2.94119 18.3627L4.43808 18.2661L3.49844 3.70171L2.00156 3.79829ZM4.68756 20H15.3124V18.5H4.68756V20ZM17.0588 18.3627L17.9984 3.79829L16.5016 3.70171L15.5619 18.2661L17.0588 18.3627ZM17.25 3H2.75V4.5H17.25V3ZM0.75 4.5H2.75V3H0.75V4.5ZM17.25 4.5H19.25V3H17.25V4.5ZM15.3124 20C16.2352 20 16.9994 19.2835 17.0588 18.3627L15.5619 18.2661C15.5534 18.3976 15.4443 18.5 15.3124 18.5V20ZM2.94119 18.3627C3.0006 19.2835 3.76481 20 4.68756 20V18.5C4.55574 18.5 4.44657 18.3976 4.43808 18.2661L2.94119 18.3627ZM7 8.75V14.25H8.5V8.75H7ZM11.5 8.75V14.25H13V8.75H11.5ZM10 1.5C11.5134 1.5 12.7868 2.53504 13.1477 3.93694L14.6003 3.56306C14.0731 1.51451 12.2144 0 10 0V1.5ZM6.85237 3.93694C7.21319 2.53504 8.48668 1.5 10 1.5V0C7.78568 0 5.92697 1.51451 5.39971 3.56306L6.85237 3.93694Z"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Drag indicator */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="size-6 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-white"
                        >
                          <path
                            d="M8 6H8.01M8 12H8.01M8 18H8.01M16 6H16.01M16 12H16.01M16 18H16.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </SortableList>
          ) : (
            <div className={cn("grid gap-4", `grid-cols-${gridCols}`)}>
              <AnimatePresence>
                {currentImages.map((url, index) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-xl bg-gray-100",
                        aspectRatio
                      )}
                    >
                      {url.endsWith(".webm") ? (
                        <video
                          src={url}
                          autoPlay
                          muted
                          loop
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`Project image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      )}
                      {onImageRemoved && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="flex flex-row gap-3 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleChangeImage(index)}
                              className="size-16 hover:scale-90 transition-all duration-300 rounded-full bg-white/20 flex items-center justify-center text-white"
                              title="Change image"
                            >
                              <svg
                                width="40%"
                                viewBox="0 0 34 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.581 30.23C10.581 28.8892 10.581 28.2189 10.6308 27.6537C11.1842 21.3719 16.1989 16.3914 22.524 15.8418C23.0931 15.7923 23.7681 15.7923 25.118 15.7923H28.4708M28.4708 15.7923C28.2524 15.0431 27.8097 14.2517 27.0197 12.8394L24.8692 8.9949C23.9016 7.26513 23.4178 6.40024 22.7297 5.77046C22.1209 5.21331 21.3994 4.79167 20.6134 4.53374C19.7249 4.24219 18.7287 4.24219 16.7363 4.24219L13.1479 4.24219C11.1555 4.24219 10.1593 4.24219 9.27083 4.53374C8.4848 4.79167 7.76329 5.21331 7.15454 5.77046C6.46643 6.40025 5.98263 7.26513 5.01503 8.9949L2.91524 12.7487C1.99908 14.3865 1.54099 15.2054 1.3614 16.0727C1.20245 16.8403 1.20245 17.6319 1.3614 18.3995C1.54099 19.2667 1.99908 20.0856 2.91525 21.7235L5.01504 25.4773C5.98263 27.207 6.46643 28.0719 7.15454 28.7017C7.76329 29.2589 8.4848 29.6805 9.27083 29.9384C10.1593 30.23 11.1555 30.23 13.1479 30.23H16.8209C18.7841 30.23 19.7656 30.23 20.6438 29.9457C21.4208 29.6943 22.1356 29.283 22.7418 28.7387C23.4269 28.1235 23.9152 27.2778 24.8918 25.5864L26.3787 23.0111L27.0964 21.6742C27.9669 20.0528 28.4021 19.2421 28.5683 18.3878C28.7153 17.6316 28.7085 16.8537 28.5484 16.1001C28.5265 15.9973 28.5008 15.8952 28.4708 15.7923ZM10.581 14.3485C9.77815 14.3485 9.1273 13.7022 9.1273 12.9048C9.1273 12.1074 9.77815 11.461 10.581 11.461C11.3839 11.461 12.0347 12.1074 12.0347 12.9048C12.0347 13.7022 11.3839 14.3485 10.581 14.3485Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M33 4.5C33 4.71478 32.8259 4.88889 32.6111 4.88889L29.8889 4.88889L29.8889 7.61111C29.8889 7.82589 29.7148 8 29.5 8C29.2852 8 29.1111 7.82589 29.1111 7.61111L29.1111 4.88889L26.3889 4.88889C26.1741 4.88889 26 4.71478 26 4.5C26 4.28522 26.1741 4.11111 26.3889 4.11111L29.1111 4.11111L29.1111 1.38889C29.1111 1.17411 29.2852 1 29.5 1C29.7148 1 29.8889 1.17411 29.8889 1.38889L29.8889 4.11111L32.6111 4.11111C32.8259 4.11111 33 4.28522 33 4.5Z"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(url, index)}
                              className="size-16 hover:scale-90 transition-all duration-300 rounded-full bg-white/20 flex items-center justify-center text-white"
                              title="Remove image"
                            >
                              <svg
                                width="35%"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3.68964 18.3144L2.94119 18.3627L3.68964 18.3144ZM16.3104 18.3144L17.0588 18.3627V18.3627L16.3104 18.3144ZM0.75 3C0.335786 3 0 3.33579 0 3.75C0 4.16421 0.335786 4.5 0.75 4.5V3ZM19.25 4.5C19.6642 4.5 20 4.16421 20 3.75C20 3.33579 19.6642 3 19.25 3V4.5ZM8.5 8.75C8.5 8.33579 8.16421 8 7.75 8C7.33579 8 7 8.33579 7 8.75H8.5ZM7 14.25C7 14.6642 7.33579 15 7.75 15C8.16421 15 8.5 14.6642 8.5 14.25H7ZM13 8.75C13 8.33579 12.6642 8 12.25 8C11.8358 8 11.5 8.33579 11.5 8.75H13ZM11.5 14.25C11.5 14.6642 11.8358 15 12.25 15C12.6642 15 13 14.6642 13 14.25H11.5ZM13.1477 3.93694C13.2509 4.33808 13.6598 4.57957 14.0609 4.47633C14.4621 4.37308 14.7036 3.9642 14.6003 3.56306L13.1477 3.93694ZM2.00156 3.79829L2.94119 18.3627L4.43808 18.2661L3.49844 3.70171L2.00156 3.79829ZM4.68756 20H15.3124V18.5H4.68756V20ZM17.0588 18.3627L17.9984 3.79829L16.5016 3.70171L15.5619 18.2661L17.0588 18.3627ZM17.25 3H2.75V4.5H17.25V3ZM0.75 4.5H2.75V3H0.75V4.5ZM17.25 4.5H19.25V3H17.25V4.5ZM15.3124 20C16.2352 20 16.9994 19.2835 17.0588 18.3627L15.5619 18.2661C15.5534 18.3976 15.4443 18.5 15.3124 18.5V20ZM2.94119 18.3627C3.0006 19.2835 3.76481 20 4.68756 20V18.5C4.55574 18.5 4.44657 18.3976 4.43808 18.2661L2.94119 18.3627ZM7 8.75V14.25H8.5V8.75H7ZM11.5 8.75V14.25H13V8.75H11.5ZM10 1.5C11.5134 1.5 12.7868 2.53504 13.1477 3.93694L14.6003 3.56306C14.0731 1.51451 12.2144 0 10 0V1.5ZM6.85237 3.93694C7.21319 2.53504 8.48668 1.5 10 1.5V0C7.78568 0 5.92697 1.51451 5.39971 3.56306L6.85237 3.93694Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}

      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={cn(
            "relative w-full border-2 border-dashed border-gray-300 rounded-xl transition-all duration-300 cursor-pointer hover:border-gray-400 hover:bg-black/5",
            isDragging && "border-black bg-black/5",
            aspectRatio
          )}
          onClick={handleButtonClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2 absolute top-0 left-0 w-full h-full">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="p-3 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#505050] tracking-tight">
                      Uploading...
                    </span>
                    <span className="text-sm text-[#505050]">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-6 text-center">
            <div className="size-10">
              <svg
                width="100%"
                viewBox="0 0 34 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.581 30.23C10.581 28.8892 10.581 28.2189 10.6308 27.6537C11.1842 21.3719 16.1989 16.3914 22.524 15.8418C23.0931 15.7923 23.7681 15.7923 25.118 15.7923H28.4708M28.4708 15.7923C28.2524 15.0431 27.8097 14.2517 27.0197 12.8394L24.8692 8.9949C23.9016 7.26513 23.4178 6.40024 22.7297 5.77046C22.1209 5.21331 21.3994 4.79167 20.6134 4.53374C19.7249 4.24219 18.7287 4.24219 16.7363 4.24219L13.1479 4.24219C11.1555 4.24219 10.1593 4.24219 9.27083 4.53374C8.4848 4.79167 7.76329 5.21331 7.15454 5.77046C6.46643 6.40025 5.98263 7.26513 5.01503 8.9949L2.91524 12.7487C1.99908 14.3865 1.54099 15.2054 1.3614 16.0727C1.20245 16.8403 1.20245 17.6319 1.3614 18.3995C1.54099 19.2667 1.99908 20.0856 2.91525 21.7235L5.01504 25.4773C5.98263 27.207 6.46643 28.0719 7.15454 28.7017C7.76329 29.2589 8.4848 29.6805 9.27083 29.9384C10.1593 30.23 11.1555 30.23 13.1479 30.23H16.8209C18.7841 30.23 19.7656 30.23 20.6438 29.9457C21.4208 29.6943 22.1356 29.283 22.7418 28.7387C23.4269 28.1235 23.9152 27.2778 24.8918 25.5864L26.3787 23.0111L27.0964 21.6742C27.9669 20.0528 28.4021 19.2421 28.5683 18.3878C28.7153 17.6316 28.7085 16.8537 28.5484 16.1001C28.5265 15.9973 28.5008 15.8952 28.4708 15.7923ZM10.581 14.3485C9.77815 14.3485 9.1273 13.7022 9.1273 12.9048C9.1273 12.1074 9.77815 11.461 10.581 11.461C11.3839 11.461 12.0347 12.1074 12.0347 12.9048C12.0347 13.7022 11.3839 14.3485 10.581 14.3485Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M33 4.5C33 4.71478 32.8259 4.88889 32.6111 4.88889L29.8889 4.88889L29.8889 7.61111C29.8889 7.82589 29.7148 8 29.5 8C29.2852 8 29.1111 7.82589 29.1111 7.61111L29.1111 4.88889L26.3889 4.88889C26.1741 4.88889 26 4.71478 26 4.5C26 4.28522 26.1741 4.11111 26.3889 4.11111L29.1111 4.11111L29.1111 1.38889C29.1111 1.17411 29.2852 1 29.5 1C29.7148 1 29.8889 1.17411 29.8889 1.38889L29.8889 4.11111L32.6111 4.11111C32.8259 4.11111 33 4.28522 33 4.5Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            {!shortInfo && (
              <p className="text-base font-medium text-black tracking-tight">
                {uploadAreaText}
              </p>
            )}
            {!shortInfo && (
              <p className="text-xs text-[#acacac]">
                {supportedFormats} • Max {maxFileSize} each
                {isMultiple && ` • Up to ${maxImages} images`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {currentImages.length === 0 && !canUploadMore && (
        <div className="text-center py-8 text-gray-500">
          <p>{placeholder}</p>
        </div>
      )}
    </div>
  )
}
