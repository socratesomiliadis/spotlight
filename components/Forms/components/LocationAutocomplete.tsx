"use client"

/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react"
import { Input } from "@heroui/react"

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void
  label?: string
  isInvalid?: boolean
  errorMessage?: string
  placeholder?: string
}

export default function LocationAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  label = "Location",
  isInvalid = false,
  errorMessage,
  placeholder = "Enter a location",
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (typeof google !== "undefined" && google.maps && google.maps.places) {
      setIsLoaded(true)
      return
    }

    // Load Google Maps script
    const script = document.createElement("script")
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.error("Google Maps API key is not configured")
      return
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Cleanup: remove script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    // Initialize autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(cities)"], // Restrict to cities only
        fields: ["formatted_address", "address_components", "geometry"],
      }
    )

    // Listen for place selection
    const listener = autocompleteRef.current.addListener(
      "place_changed",
      () => {
        const place = autocompleteRef.current?.getPlace()
        if (place && place.formatted_address) {
          onChange(place.formatted_address)
          onPlaceSelected?.(place)
        }
      }
    )

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener)
      }
    }
  }, [isLoaded, onChange, onPlaceSelected])

  return (
    <div className="w-full">
      <Input
        ref={inputRef}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        placeholder={placeholder}
        classNames={{
          input: "text-base",
          inputWrapper:
            "bg-white border-1 border-[#CBCBCB] rounded-lg group-data-[focus=true]:border-black",
        }}
      />
    </div>
  )
}
