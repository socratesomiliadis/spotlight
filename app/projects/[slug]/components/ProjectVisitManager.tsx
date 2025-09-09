"use client"

import { useEffect } from "react"
import { useProjectVisit } from "@/contexts/project-visit-context"

interface ProjectVisitManagerProps {
  liveUrl: string | null
}

export default function ProjectVisitManager({
  liveUrl,
}: ProjectVisitManagerProps) {
  const { setVisitUrl } = useProjectVisit()

  useEffect(() => {
    // Set the visit URL when component mounts
    setVisitUrl(liveUrl)

    // Clear the visit URL when component unmounts (navigating away from project page)
    return () => {
      setVisitUrl(null)
    }
  }, [liveUrl, setVisitUrl])

  return null
}
