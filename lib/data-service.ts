export interface Organization {
  orgId: string
  name: string
  industry: string
  contact: string
  status: "active" | "onboarding" | "paused" | "archived"
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
  role: "admin" | "customer"
  orgId?: string
  createdAt: string
}

export type DeliveryStage = "pending" | "analyzing" | "delivering" | "executing" | "completed"

export const DELIVERY_STAGES: Record<DeliveryStage, { kr: string; en: string; color: string }> = {
  pending: { kr: "대기", en: "Pending", color: "#6B7280" },
  analyzing: { kr: "분석 중", en: "Analyzing", color: "#3B82F6" },
  delivering: { kr: "제공 중", en: "Delivering", color: "#10B981" },
  executing: { kr: "실행 중", en: "Executing", color: "#8B5CF6" },
  completed: { kr: "완료", en: "Completed", color: "#059669" },
}

// Result configuration for planned deliverables
export interface ResultConfig {
  map: {
    enabled: boolean
    types: ("geojson" | "tiles3d" | "laz")[]
  }
  downloads: {
    enabled: boolean
  }
  tables: {
    enabled: boolean
    types: ("table" | "bar" | "line" | "kpi")[]
  }
}

// Project interface - deliverables-based, no widgets
export interface Project {
  projectId: string
  orgId: string
  name: string
  theme: "efficiency" | "asset" | "biodiversity"
  location: string
  description?: string
  deliveryStage: DeliveryStage
  lastActivityAt: string
  createdAt: string
  updatedAt?: string
  resultConfig?: ResultConfig
}

// Deliverables Types
export interface MapLayer {
  id: string
  name: string
  dataType: "geojson" | "laz" | "tiles3d"
  fileName: string
  fileSize: number
  uploadedAt: string
  isPublic: boolean
  geojsonData?: object
}

export interface DeliverableFile {
  id: string
  name: string
  fileType: "hwp" | "xlsx" | "pdf"
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
  visualizationType: "table" | "bar_chart" | "line_chart" | "kpi"
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

// Storage keys
const STORAGE_KEYS = {
  orgs: "naturex_orgs",
  users: "naturex_users",
  projects: "naturex_projects",
  deliverables: (projectId: string) => `naturex_deliverables__${projectId}`,
}

// Theme label mapping for UI display
export const themeLabels = {
  efficiency: "운영비 절감",
  asset: "자산 가치 향상",
  biodiversity: "생물다양성",
} as const

// Initialize default data if not exists
export function initializeDefaultData() {
  // Default organizations
  if (!localStorage.getItem(STORAGE_KEYS.orgs)) {
    const defaultOrgs: Organization[] = [
      {
        orgId: "org-customer-001",
        name: "서울특별시 녹지과",
        industry: "지자체",
        contact: "green@seoul.go.kr",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        orgId: "org-customer-002",
        name: "한국환경공단",
        industry: "공공기관",
        contact: "eco@keco.or.kr",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        orgId: "org-customer-003",
        name: "삼성물산 조경팀",
        industry: "기업",
        contact: "landscape@samsung.com",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.orgs, JSON.stringify(defaultOrgs))
  }

  // Default users
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    const defaultUsers: User[] = [
      {
        userId: "admin-1",
        email: "admin@invalab.co",
        name: "InvaLab Admin",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        userId: "customer-001",
        email: "green@seoul.go.kr",
        name: "서울시 담당자",
        role: "customer",
        orgId: "org-customer-001",
        createdAt: new Date().toISOString(),
      },
      {
        userId: "customer-002",
        email: "eco@keco.or.kr",
        name: "환경공단 담당자",
        role: "customer",
        orgId: "org-customer-002",
        createdAt: new Date().toISOString(),
      },
      {
        userId: "customer-003",
        email: "landscape@samsung.com",
        name: "삼성물산 담당자",
        role: "customer",
        orgId: "org-customer-003",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(defaultUsers))
  }

  // Default projects with demo deliverables
  if (!localStorage.getItem(STORAGE_KEYS.projects)) {
    const defaultProjects: Project[] = [
      {
        projectId: "proj-demo-1",
        orgId: "org-customer-001",
        name: "서울숲 생태복원 프로젝트",
        theme: "biodiversity",
        location: "서울시 성동구",
        description: "서울숲 생태계 복원 및 생물다양성 증진 프로젝트",
        deliveryStage: "delivering",
        lastActivityAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        projectId: "proj-demo-2",
        orgId: "org-customer-002",
        name: "청계천 수목 관리",
        theme: "efficiency",
        location: "서울시 중구",
        description: "청계천 일대 수목 유지관리 효율화",
        deliveryStage: "analyzing",
        lastActivityAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(defaultProjects))

    // Initialize demo deliverables for proj-demo-1
    const demoDeliverables: ProjectDeliverables = {
      projectId: "proj-demo-1",
      maps: [
        {
          id: "map-1",
          name: "서식지 분포 지도",
          dataType: "geojson",
          fileName: "habitat_map.geojson",
          fileSize: 245000,
          uploadedAt: new Date().toISOString(),
          isPublic: true,
        },
        {
          id: "map-2",
          name: "포인트클라우드 원본",
          dataType: "laz",
          fileName: "seoul_forest.laz",
          fileSize: 52000000,
          uploadedAt: new Date().toISOString(),
          isPublic: false,
        },
      ],
      downloads: [
        {
          id: "file-1",
          name: "생태복원 분석 보고서",
          fileType: "hwp",
          fileName: "restoration_report.hwp",
          fileSize: 3200000,
          description: "2024년 상반기 생태복원 분석 결과 보고서",
          uploadedAt: new Date().toISOString(),
          isPublic: true,
        },
        {
          id: "file-2",
          name: "수종별 데이터",
          fileType: "xlsx",
          fileName: "species_data.xlsx",
          fileSize: 156000,
          description: "조사된 수종별 상세 데이터",
          uploadedAt: new Date().toISOString(),
          isPublic: true,
        },
      ],
      visuals: [],
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.deliverables("proj-demo-1"), JSON.stringify(demoDeliverables))
  }
}

// Organizations CRUD
export function getOrganizations(): Organization[] {
  const data = localStorage.getItem(STORAGE_KEYS.orgs)
  return data ? JSON.parse(data) : []
}

export function getOrganizationById(orgId: string): Organization | undefined {
  return getOrganizations().find((o) => o.orgId === orgId)
}

export function saveOrganization(org: Organization): void {
  const orgs = getOrganizations()
  const index = orgs.findIndex((o) => o.orgId === org.orgId)
  if (index >= 0) {
    orgs[index] = org
  } else {
    orgs.push(org)
  }
  localStorage.setItem(STORAGE_KEYS.orgs, JSON.stringify(orgs))
}

export function deleteOrganization(orgId: string): void {
  const orgs = getOrganizations().filter((o) => o.orgId !== orgId)
  localStorage.setItem(STORAGE_KEYS.orgs, JSON.stringify(orgs))
}

// Users CRUD
export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.users)
  return data ? JSON.parse(data) : []
}

export function getUserById(userId: string): User | undefined {
  return getUsers().find((u) => u.userId === userId)
}

export function saveUser(user: User): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.userId === user.userId)
  if (index >= 0) {
    users[index] = user
  } else {
    users.push(user)
  }
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users))
}

export function deleteUser(userId: string): void {
  const users = getUsers().filter((u) => u.userId !== userId)
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users))
}

// Projects CRUD
export function getProjects(userRole?: "admin" | "customer", userOrgId?: string): Project[] {
  const data = localStorage.getItem(STORAGE_KEYS.projects)
  const projects = data ? JSON.parse(data) : []

  if (userRole === "admin") return projects
  if (userRole === "customer" && userOrgId) {
    return projects.filter((p: Project) => p.orgId === userOrgId)
  }
  return projects
}

export function getProjectById(projectId: string): Project | undefined {
  return getProjects().find((p) => p.projectId === projectId)
}

export function getProjectsByOrg(orgId: string): Project[] {
  return getProjects().filter((p) => p.orgId === orgId)
}

export function saveProject(project: Project): void {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.projectId === project.projectId)
  if (index >= 0) {
    projects[index] = { ...project, updatedAt: new Date().toISOString() }
  } else {
    projects.push(project)
  }
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
}

export function deleteProject(projectId: string): void {
  const projects = getProjects().filter((p) => p.projectId !== projectId)
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
  // Also delete deliverables
  localStorage.removeItem(STORAGE_KEYS.deliverables(projectId))
}

export function updateProjectDeliveryStage(projectId: string, stage: DeliveryStage): void {
  const project = getProjectById(projectId)
  if (!project) return
  saveProject({ ...project, deliveryStage: stage, lastActivityAt: new Date().toISOString() })
}

// Deliverables CRUD
export function getProjectDeliverables(projectId: string): ProjectDeliverables {
  const data = localStorage.getItem(STORAGE_KEYS.deliverables(projectId))
  if (data) return JSON.parse(data)
  
  // Return empty deliverables structure if none exists
  return {
    projectId,
    maps: [],
    downloads: [],
    visuals: [],
    updatedAt: new Date().toISOString(),
  }
}

export function saveProjectDeliverables(deliverables: ProjectDeliverables): void {
  deliverables.updatedAt = new Date().toISOString()
  localStorage.setItem(STORAGE_KEYS.deliverables(deliverables.projectId), JSON.stringify(deliverables))
}

// Map Layer operations
export function addMapLayer(projectId: string, layer: Omit<MapLayer, "id" | "uploadedAt">): MapLayer {
  const deliverables = getProjectDeliverables(projectId)
  const newLayer: MapLayer = {
    ...layer,
    id: `map-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  }
  deliverables.maps.push(newLayer)
  saveProjectDeliverables(deliverables)
  return newLayer
}

export function updateMapLayer(projectId: string, layerId: string, updates: Partial<MapLayer>): void {
  const deliverables = getProjectDeliverables(projectId)
  const index = deliverables.maps.findIndex((m) => m.id === layerId)
  if (index >= 0) {
    deliverables.maps[index] = { ...deliverables.maps[index], ...updates }
    saveProjectDeliverables(deliverables)
  }
}

export function deleteMapLayer(projectId: string, layerId: string): void {
  const deliverables = getProjectDeliverables(projectId)
  deliverables.maps = deliverables.maps.filter((m) => m.id !== layerId)
  saveProjectDeliverables(deliverables)
}

// Downloadable File operations
export function addDeliverableFile(projectId: string, file: Omit<DeliverableFile, "id" | "uploadedAt">): DeliverableFile {
  const deliverables = getProjectDeliverables(projectId)
  const newFile: DeliverableFile = {
    ...file,
    id: `file-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  }
  deliverables.downloads.push(newFile)
  saveProjectDeliverables(deliverables)
  return newFile
}

export function updateDeliverableFile(projectId: string, fileId: string, updates: Partial<DeliverableFile>): void {
  const deliverables = getProjectDeliverables(projectId)
  const index = deliverables.downloads.findIndex((f) => f.id === fileId)
  if (index >= 0) {
    deliverables.downloads[index] = { ...deliverables.downloads[index], ...updates }
    saveProjectDeliverables(deliverables)
  }
}

export function deleteDeliverableFile(projectId: string, fileId: string): void {
  const deliverables = getProjectDeliverables(projectId)
  deliverables.downloads = deliverables.downloads.filter((f) => f.id !== fileId)
  saveProjectDeliverables(deliverables)
}

// Chart/Visual operations
export function addChartDataset(projectId: string, chart: Omit<ChartDataset, "id" | "uploadedAt">): ChartDataset {
  const deliverables = getProjectDeliverables(projectId)
  const newChart: ChartDataset = {
    ...chart,
    id: `chart-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  }
  deliverables.visuals.push(newChart)
  saveProjectDeliverables(deliverables)
  return newChart
}

export function updateChartDataset(projectId: string, chartId: string, updates: Partial<ChartDataset>): void {
  const deliverables = getProjectDeliverables(projectId)
  const index = deliverables.visuals.findIndex((c) => c.id === chartId)
  if (index >= 0) {
    deliverables.visuals[index] = { ...deliverables.visuals[index], ...updates }
    saveProjectDeliverables(deliverables)
  }
}

export function deleteChartDataset(projectId: string, chartId: string): void {
  const deliverables = getProjectDeliverables(projectId)
  deliverables.visuals = deliverables.visuals.filter((c) => c.id !== chartId)
  saveProjectDeliverables(deliverables)
}

// Stats and aggregates
export function getProjectStats() {
  const projects = getProjects()
  return {
    total: projects.length,
    byDeliveryStage: {
      pending: projects.filter((p) => p.deliveryStage === "pending").length,
      analyzing: projects.filter((p) => p.deliveryStage === "analyzing").length,
      delivering: projects.filter((p) => p.deliveryStage === "delivering").length,
      executing: projects.filter((p) => p.deliveryStage === "executing").length,
      completed: projects.filter((p) => p.deliveryStage === "completed").length,
    },
    byTheme: {
      efficiency: projects.filter((p) => p.theme === "efficiency").length,
      asset: projects.filter((p) => p.theme === "asset").length,
      biodiversity: projects.filter((p) => p.theme === "biodiversity").length,
    },
  }
}

export function getOrgWithAggregates(orgId: string): Organization | undefined {
  const org = getOrganizationById(orgId)
  if (!org) return undefined

  const orgProjects = getProjectsByOrg(orgId)
  return {
    ...org,
    activeProjectsByStage: {
      pending: orgProjects.filter((p) => p.deliveryStage === "pending").length,
      analyzing: orgProjects.filter((p) => p.deliveryStage === "analyzing").length,
      delivering: orgProjects.filter((p) => p.deliveryStage === "delivering").length,
      executing: orgProjects.filter((p) => p.deliveryStage === "executing").length,
      completed: orgProjects.filter((p) => p.deliveryStage === "completed").length,
    },
  }
}

// Get public deliverables count for a project
export function getDeliverablesCount(projectId: string): { maps: number; downloads: number; visuals: number } {
  const deliverables = getProjectDeliverables(projectId)
  return {
    maps: deliverables.maps.filter((m) => m.isPublic).length,
    downloads: deliverables.downloads.filter((d) => d.isPublic).length,
    visuals: deliverables.visuals.filter((v) => v.isPublic).length,
  }
}
