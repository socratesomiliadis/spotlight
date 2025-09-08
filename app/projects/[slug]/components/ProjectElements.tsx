"use client"

import { useState } from "react"
import Image from "next/image"

import { Lightbox } from "@/components/ui/lightbox"

export default function ProjectElements({
  elementURLs,
}: {
  elementURLs: string[]
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < elementURLs.length - 1 ? prev + 1 : prev
    )
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  return (
    <div className="w-full flex flex-col px-4 lg:px-8 tracking-tight mt-8 lg:mt-12">
      <span className="text-black text-xl">Elements</span>
      <p className="text-[#ACACAC] text-xl">
        See the highlights of this website
      </p>
      <div className="w-full h-px bg-[#EAEAEA] my-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {elementURLs.map((url, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative overflow-hidden rounded-2xl transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`View element ${index + 1} in full size`}
          >
            <Image
              src={url}
              alt={`Element ${index + 1}`}
              width={1920}
              height={1080}
              className="w-full h-auto aspect-video object-cover rounded-2xl transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl" />
          </button>
        ))}
      </div>

      <Lightbox
        images={elementURLs}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </div>
  )
}
