"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface ProjectVisitContextType {
  visitUrl: string | null
  setVisitUrl: (url: string | null) => void
}

const ProjectVisitContext = createContext<ProjectVisitContextType | undefined>(
  undefined
)

export function ProjectVisitProvider({ children }: { children: ReactNode }) {
  const [visitUrl, setVisitUrl] = useState<string | null>(null)

  return (
    <ProjectVisitContext.Provider value={{ visitUrl, setVisitUrl }}>
      {children}
    </ProjectVisitContext.Provider>
  )
}

export function useProjectVisit() {
  const context = useContext(ProjectVisitContext)
  if (context === undefined) {
    throw new Error(
      "useProjectVisit must be used within a ProjectVisitProvider"
    )
  }
  return context
}
