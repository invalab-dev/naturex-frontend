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

export function saveProject(project: Project): void {
  try {
    const projects = getProjects()
    projects.push(project)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch (error) {
    console.error("[v0] Failed to save project to localStorage:", error)
    throw error
  }
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id)
}

export const getProject = getProjectById

export function updateProject(id: string, updates: Partial<Project>): void {
  try {
    const projects = getProjects()
    const index = projects.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    }
  } catch (error) {
    console.error("[v0] Failed to update project:", error)
    throw error
  }
}

export function deleteProject(id: string): void {
  try {
    const projects = getProjects().filter((p) => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch (error) {
    console.error("[v0] Failed to delete project:", error)
    throw error
  }
}
