export type ProjectType = "efficiency" | "asset" | "biodiversity"

export interface Project {
  id: string
  name: string
  description?: string
  type: ProjectType
  createdAt: string
  updatedAt?: string
  config: Record<string, any>
}

const STORAGE_KEY = "naturex_projects"

export function getProjects(): Project[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("[v0] Failed to read projects from localStorage:", error)
    return []
  }
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id)
}

export const getProject = getProjectById