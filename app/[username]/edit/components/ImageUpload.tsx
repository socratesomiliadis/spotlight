"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  showRemoveButton?: boolean;
  bucketName: string;
  folder: string;
  aspectRatio?: string;
  className?: string;
  displayAreaClassName?: string;
  userId: string;
  showInfoText?: boolean;
}

export default function ImageUpload({
  label,
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  showRemoveButton = true,
  bucketName,
  folder,
  aspectRatio = "aspect-square",
  className = "",
  displayAreaClassName = "",
  userId,
  showInfoText = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { session } = useSession();
  const supabase = createClient({ session });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Upload file
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const filename = `${userId}/${folder}/${timestamp}.${fileExtension}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);

      if (publicUrlData?.publicUrl) {
        onImageUploaded(publicUrlData.publicUrl);
        setError(null);
      } else {
        throw new Error("Failed to get public URL");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUploading(true);
    setError(null);

    try {
      // If there's a current image URL, delete it from storage
      if (currentImageUrl) {
        const filename = extractFilenameFromUrl(currentImageUrl);
        if (filename) {
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([filename]);

          if (deleteError) {
            console.error("Error deleting file:", deleteError);
            // Don't throw here, still proceed with removal from form
          }
        }
      }

      // Call the callback to update the form
      if (onImageRemoved) {
        onImageRemoved();
      }
      setPreviewUrl(null);
    } catch (err: any) {
      console.error("Error removing image:", err);
      setError("Failed to remove image");
    } finally {
      setIsUploading(false);
    }
  };

  // Extract filename from Supabase public URL
  const extractFilenameFromUrl = (url: string): string | null => {
    try {
      // Supabase public URLs have format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filename]
      const urlParts = url.split("/");
      const bucketIndex = urlParts.findIndex((part) => part === bucketName);
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        // Join all parts after the bucket name to handle nested folders
        return urlParts.slice(bucketIndex + 1).join("/");
      }
      return null;
    } catch {
      return null;
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className={`relative group ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Display Area */}
      <div
        className={cn(
          "relative w-full h-full bg-[#f6f6f6] flex items-center justify-center cursor-pointer transition-colors",
          isDragging ? "bg-gray-200" : "hover:bg-gray-200",
          !displayUrl
            ? "outline-[2px] outline-offset-[-2px] outline-dashed outline-gray-300"
            : "",
          displayAreaClassName
        )}
        onClick={handleButtonClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {showInfoText && (
          <div
            className={cn(
              "absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity",
              !displayUrl && "text-black"
            )}
          >
            PNG, JPG, JPEG • Max 5MB • 3000x1000
          </div>
        )}
        {displayUrl ? (
          <div className="relative w-full h-full">
            <Image src={displayUrl} alt={label} fill className="object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-sm font-medium">
                  Uploading...
                </div>
              </div>
            )}
            {!isUploading && (
              <div className="absolute inset-0 bg-black text-white gap-2 bg-opacity-0 group-hover:bg-opacity-60 transition-all flex flex-col items-center justify-center px-4">
                <div className="flex flex-row gap-3 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="size-16 hover:scale-90 transition-all duration-300 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      width="40%"
                      viewBox="0 0 34 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.581 30.23C10.581 28.8892 10.581 28.2189 10.6308 27.6537C11.1842 21.3719 16.1989 16.3914 22.524 15.8418C23.0931 15.7923 23.7681 15.7923 25.118 15.7923H28.4708M28.4708 15.7923C28.2524 15.0431 27.8097 14.2517 27.0197 12.8394L24.8692 8.9949C23.9016 7.26513 23.4178 6.40024 22.7297 5.77046C22.1209 5.21331 21.3994 4.79167 20.6134 4.53374C19.7249 4.24219 18.7287 4.24219 16.7363 4.24219L13.1479 4.24219C11.1555 4.24219 10.1593 4.24219 9.27083 4.53374C8.4848 4.79167 7.76329 5.21331 7.15454 5.77046C6.46643 6.40025 5.98263 7.26513 5.01503 8.9949L2.91524 12.7487C1.99908 14.3865 1.54099 15.2054 1.3614 16.0727C1.20245 16.8403 1.20245 17.6319 1.3614 18.3995C1.54099 19.2667 1.99908 20.0856 2.91525 21.7235L5.01504 25.4773C5.98263 27.207 6.46643 28.0719 7.15454 28.7017C7.76329 29.2589 8.4848 29.6805 9.27083 29.9384C10.1593 30.23 11.1555 30.23 13.1479 30.23H16.8209C18.7841 30.23 19.7656 30.23 20.6438 29.9457C21.4208 29.6943 22.1356 29.283 22.7418 28.7387C23.4269 28.1235 23.9152 27.2778 24.8918 25.5864L26.3787 23.0111L27.0964 21.6742C27.9669 20.0528 28.4021 19.2421 28.5683 18.3878C28.7153 17.6316 28.7085 16.8537 28.5484 16.1001C28.5265 15.9973 28.5008 15.8952 28.4708 15.7923ZM10.581 14.3485C9.77815 14.3485 9.1273 13.7022 9.1273 12.9048C9.1273 12.1074 9.77815 11.461 10.581 11.461C11.3839 11.461 12.0347 12.1074 12.0347 12.9048C12.0347 13.7022 11.3839 14.3485 10.581 14.3485Z"
                        stroke="currentColor"
                        strokeWidth="2.42043"
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
                  </span>
                  {onImageRemoved && showRemoveButton && (
                    <button
                      onClick={handleRemoveImage}
                      disabled={isUploading}
                      className="size-16 hover:scale-90 transition-all duration-300 rounded-full bg-white/20 flex items-center justify-center"
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
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 p-6">
            <span className="w-12">
              <svg
                width="100%"
                viewBox="0 0 34 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.581 30.23C10.581 28.8892 10.581 28.2189 10.6308 27.6537C11.1842 21.3719 16.1989 16.3914 22.524 15.8418C23.0931 15.7923 23.7681 15.7923 25.118 15.7923H28.4708M28.4708 15.7923C28.2524 15.0431 27.8097 14.2517 27.0197 12.8394L24.8692 8.9949C23.9016 7.26513 23.4178 6.40024 22.7297 5.77046C22.1209 5.21331 21.3994 4.79167 20.6134 4.53374C19.7249 4.24219 18.7287 4.24219 16.7363 4.24219L13.1479 4.24219C11.1555 4.24219 10.1593 4.24219 9.27083 4.53374C8.4848 4.79167 7.76329 5.21331 7.15454 5.77046C6.46643 6.40025 5.98263 7.26513 5.01503 8.9949L2.91524 12.7487C1.99908 14.3865 1.54099 15.2054 1.3614 16.0727C1.20245 16.8403 1.20245 17.6319 1.3614 18.3995C1.54099 19.2667 1.99908 20.0856 2.91525 21.7235L5.01504 25.4773C5.98263 27.207 6.46643 28.0719 7.15454 28.7017C7.76329 29.2589 8.4848 29.6805 9.27083 29.9384C10.1593 30.23 11.1555 30.23 13.1479 30.23H16.8209C18.7841 30.23 19.7656 30.23 20.6438 29.9457C21.4208 29.6943 22.1356 29.283 22.7418 28.7387C23.4269 28.1235 23.9152 27.2778 24.8918 25.5864L26.3787 23.0111L27.0964 21.6742C27.9669 20.0528 28.4021 19.2421 28.5683 18.3878C28.7153 17.6316 28.7085 16.8537 28.5484 16.1001C28.5265 15.9973 28.5008 15.8952 28.4708 15.7923ZM10.581 14.3485C9.77815 14.3485 9.1273 13.7022 9.1273 12.9048C9.1273 12.1074 9.77815 11.461 10.581 11.461C11.3839 11.461 12.0347 12.1074 12.0347 12.9048C12.0347 13.7022 11.3839 14.3485 10.581 14.3485Z"
                  stroke="#ADADAD"
                  strokeWidth="2.42043"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M33 4.5C33 4.71478 32.8259 4.88889 32.6111 4.88889L29.8889 4.88889L29.8889 7.61111C29.8889 7.82589 29.7148 8 29.5 8C29.2852 8 29.1111 7.82589 29.1111 7.61111L29.1111 4.88889L26.3889 4.88889C26.1741 4.88889 26 4.71478 26 4.5C26 4.28522 26.1741 4.11111 26.3889 4.11111L29.1111 4.11111L29.1111 1.38889C29.1111 1.17411 29.2852 1 29.5 1C29.7148 1 29.8889 1.17411 29.8889 1.38889L29.8889 4.11111L32.6111 4.11111C32.8259 4.11111 33 4.28522 33 4.5Z"
                  fill="#ADADAD"
                  stroke="#ADADAD"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200 z-10">
          {error}
        </div>
      )}
    </div>
  );
}
