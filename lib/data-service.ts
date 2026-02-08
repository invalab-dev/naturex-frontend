import { apiFetch } from './api-client'

// ==============================
// Types (FE contract-02)
// ==============================

export interface Organization {
  orgId: string
  name: string
  industry: string
  contact: string
  status: 'active' | 'onboarding' | 'paused' | 'archived'
  lastActivity?: string
  createdAt: string
  activeProjectsByStage?: {
    pending: number
    analyzing: number
    delivering: number
    executing: number
    completed: number
  }
}

export interface User {
  userId: string
  email: string
  name: string
  role: 'admin' | 'customer'
  orgId?: string
  createdAt: string
}

export type DeliveryStage = 'pending' | 'analyzing' | 'delivering' | 'executing' | 'completed'

export const DELIVERY_STAGES: Record<
  DeliveryStage,
  { kr: string; en: string; color: string }
> = {
  pending: { kr: '대기', en: 'Pending', color: '#6B7280' },
  analyzing: { kr: '분석 중', en: 'Analyzing', color: '#3B82F6' },
  delivering: { kr: '제공 중', en: 'Delivering', color: '#10B981' },
  executing: { kr: '실행 중', en: 'Executing', color: '#8B5CF6' },
  completed: { kr: '완료', en: 'Completed', color: '#059669' },
}

export type ProjectTheme = 'efficiency' | 'asset' | 'biodiversity'

export const themeLabels: Record<ProjectTheme, string> = {
  efficiency: '운영비 절감',
  asset: '자산 가치 향상',
  biodiversity: '생물다양성',
} as const

export interface ResultConfig {
  map: {
    enabled: boolean
    types: ('geojson' | 'tiles3d' | 'laz')[]
  }
  downloads: {
    enabled: boolean
  }
  tables: {
    enabled: boolean
    types: ('table' | 'bar' | 'line' | 'kpi')[]
  }
}

export interface Project {
  projectId: string
  orgId: string
  name: string
  theme: ProjectTheme
  location: string
  description?: string
  deliveryStage: DeliveryStage | 'paused'
  lastActivityAt: string
  createdAt: string
  updatedAt?: string
  resultConfig?: ResultConfig
}

export interface MapLayer {
  id: string
  name: string
  dataType: 'geojson' | 'laz' | 'tiles3d'
  fileName: string
  fileSize: number
  uploadedAt: string
  isPublic: boolean
  geojsonData?: object
}

export interface DeliverableFile {
  id: string
  name: string
  fileType: 'hwp' | 'xlsx' | 'pdf'
  fileName: string
  fileSize: number
  description?: string
  uploadedAt: string
  downloadUrl?: string
  isPublic: boolean
}

export interface ChartDataset {
  id: string
  title: string
  description?: string
  visualizationType: 'table' | 'bar_chart' | 'line_chart' | 'kpi'
  data: Array<{
    metric_name: string
    value: number
    unit?: string
    category?: string
    timestamp?: string
  }>
  axisLabels?: {
    x?: string
    y?: string
  }
  isPublic: boolean
  uploadedAt: string
}

export interface ProjectDeliverables {
  projectId: string
  maps: MapLayer[]
  downloads: DeliverableFile[]
  visuals: ChartDataset[]
  updatedAt: string
}

// ==============================
// API functions
// ==============================

export async function getOrganizations(): Promise<Organization[]> {
  return apiFetch('/organizations')
}

export async function createOrganization(input: {
  orgId: string
  name: string
  industry: string
  contact: string
  status: Organization['status']
}): Promise<Organization> {
  return apiFetch('/organizations', { method: 'POST', json: input })
}

export async function updateOrganization(
  orgId: string,
  patch: Partial<Omit<Organization, 'orgId' | 'createdAt'>>,
): Promise<Organization> {
  return apiFetch(`/organizations/${orgId}`, { method: 'PATCH', json: patch })
}

export async function deleteOrganization(orgId: string): Promise<void> {
  return apiFetch(`/organizations/${orgId}`, { method: 'DELETE' })
}

export async function getUsers(): Promise<User[]> {
  return apiFetch('/users')
}

export async function createUser(input: {
  email: string
  password: string
  name: string
  role: User['role']
  orgId?: string | null
}): Promise<User> {
  return apiFetch('/users', { method: 'POST', json: input })
}

export async function deleteUser(userId: string): Promise<void> {
  return apiFetch(`/users/${userId}`, { method: 'DELETE' })
}

export async function getProjects(params?: {
  orgId?: string
  theme?: string
  stage?: string
  q?: string
}): Promise<Project[]> {
  const qs = new URLSearchParams()
  if (params?.orgId) qs.set('orgId', params.orgId)
  if (params?.theme) qs.set('theme', params.theme)
  if (params?.stage) qs.set('stage', params.stage)
  if (params?.q) qs.set('q', params.q)
  const suffix = qs.toString() ? `?${qs.toString()}` : ''
  return apiFetch(`/projects${suffix}`)
}

export async function getProjectById(projectId: string): Promise<Project> {
  return apiFetch(`/projects/${projectId}`)
}

export async function createProject(input: {
  projectId: string
  orgId: string
  name: string
  theme: ProjectTheme
  location: string
  description?: string | null
  resultConfig?: ResultConfig
}): Promise<Project> {
  return apiFetch('/projects', { method: 'POST', json: input })
}

export async function deleteProject(projectId: string): Promise<void> {
  return apiFetch(`/projects/${projectId}`, { method: 'DELETE' })
}

export async function updateProjectDeliveryStage(
  projectId: string,
  stage: DeliveryStage | 'paused',
  memo?: string,
): Promise<Project> {
  return apiFetch(`/projects/${projectId}/delivery-stage`, {
    method: 'POST',
    json: { stage, memo },
  })
}

export async function getProjectStats(): Promise<{
  total: number
  byDeliveryStage: Record<string, number>
  byTheme: Record<string, number>
}> {
  // Use backend aggregated stats endpoint
  const s = await apiFetch<any>('/admin/stats/overview')
  return {
    total: s.projectsCount,
    byDeliveryStage: s.byStatus,
    byTheme: s.byTheme,
  }
}

export async function getProjectDeliverables(projectId: string): Promise<ProjectDeliverables> {
  return apiFetch(`/projects/${projectId}/deliverables`)
}

export async function putProjectDeliverables(
  projectId: string,
  deliverables: Omit<ProjectDeliverables, 'updatedAt'>,
): Promise<ProjectDeliverables> {
  return apiFetch(`/projects/${projectId}/deliverables`, {
    method: 'PUT',
    json: deliverables,
  })
}

export function getDeliverablesCount(d: ProjectDeliverables): {
  maps: number
  downloads: number
  visuals: number
} {
  return {
    maps: d.maps.filter((m) => m.isPublic).length,
    downloads: d.downloads.filter((f) => f.isPublic).length,
    visuals: d.visuals.filter((v) => v.isPublic).length,
  }
}
