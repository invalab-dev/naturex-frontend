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

export interface Project {
  projectId: string
  orgId: string
  name: string
  theme: "efficiency" | "asset" | "biodiversity"
  location: string
  deliveryStage: DeliveryStage
  widgetCompletion: {
    total: number
    configured: number
  }
  widgetStatus: "none" | "partial" | "complete"
  lastActivityAt: string
  createdAt: string
  updatedAt?: string
}

export interface Widget {
  id: string
  title: string
  description: string
  enabled: boolean
  permission: "customer_view" | "admin_only"
  order: number
  component: string
}

export interface WidgetConfig {
  projectId: string
  theme: "efficiency" | "asset" | "biodiversity"
  widgets: Widget[]
  updatedAt: string
}

// Storage keys
const STORAGE_KEYS = {
  orgs: "naturex_orgs",
  users: "naturex_users",
  projects: "naturex_projects",
  widgetConfig: (projectId: string) => `naturex_widget_config__${projectId}`,
}

// Initialize default data if not exists
export function initializeDefaultData() {
  // Default organizations
  if (!localStorage.getItem(STORAGE_KEYS.orgs)) {
    const defaultOrgs: Organization[] = [
      {
        orgId: "org-customer-001",
        name: "테스트 고객 1",
        industry: "지자체",
        contact: "customer1@test.com",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        orgId: "org-customer-002",
        name: "테스트 고객 2",
        industry: "기업",
        contact: "customer2@test.com",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        orgId: "org-customer-003",
        name: "테스트 고객 3",
        industry: "기업",
        contact: "customer3@test.com",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        orgId: "org-customer-004",
        name: "테스트 고객 4",
        industry: "지자체",
        contact: "customer4@test.com",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        orgId: "org-customer-005",
        name: "테스트 고객 5",
        industry: "기업",
        contact: "customer5@test.com",
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
        email: "customer1@test.com",
        name: "고객1 담당자",
        role: "customer",
        orgId: "org-customer-001",
        createdAt: new Date().toISOString(),
      },
      {
        userId: "customer-002",
        email: "customer2@test.com",
        name: "고객2 담당자",
        role: "customer",
        orgId: "org-customer-002",
        createdAt: new Date().toISOString(),
      },
      {
        userId: "customer-003",
        email: "customer3@test.com",
        name: "고객3 담당자",
        role: "customer",
        orgId: "org-customer-003",
        createdAt: new Date().toISOString(),
      },
      {
        userId: "customer-004",
        email: "customer4@test.com",
        name: "고객4 담당자",
        role: "customer",
        orgId: "org-customer-004",
        createdAt: new Date().toISOString(),
      },
      {
        userId: "customer-005",
        email: "customer5@test.com",
        name: "고객5 담당자",
        role: "customer",
        orgId: "org-customer-005",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(defaultUsers))
  }

  // Default projects
  if (!localStorage.getItem(STORAGE_KEYS.projects)) {
    const defaultProjects: Project[] = [
      {
        projectId: "proj-demo-1",
        orgId: "org-customer-001",
        name: "서울숲 생태복원 프로젝트",
        theme: "biodiversity",
        location: "서울시 성동구",
        deliveryStage: "pending",
        widgetCompletion: { total: 0, configured: 0 },
        widgetStatus: "none",
        lastActivityAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        projectId: "proj-demo-2",
        orgId: "org-customer-002",
        name: "청계천 수목 관리",
        theme: "efficiency",
        location: "서울시 중구",
        deliveryStage: "pending",
        widgetCompletion: { total: 0, configured: 0 },
        widgetStatus: "none",
        lastActivityAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(defaultProjects))
  }
}

// Organizations
export function getOrganizations(): Organization[] {
  const data = localStorage.getItem(STORAGE_KEYS.orgs)
  return data ? JSON.parse(data) : []
}

export function getOrganizationById(orgId: string): Organization | undefined {
  const orgs = getOrganizations()
  return orgs.find((o) => o.orgId === orgId)
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

// Users
export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.users)
  return data ? JSON.parse(data) : []
}

export function getUserById(userId: string): User | undefined {
  const users = getUsers()
  return users.find((u) => u.userId === userId)
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

// Projects
export function getProjects(userRole?: "admin" | "customer", userOrgId?: string): Project[] {
  const data = localStorage.getItem(STORAGE_KEYS.projects)
  const projects = data ? JSON.parse(data) : []

  // Admin sees all projects
  if (userRole === "admin") {
    return projects
  }

  // Customer sees only their org's projects
  if (userRole === "customer" && userOrgId) {
    return projects.filter((p: Project) => p.orgId === userOrgId)
  }

  // Default: return all
  return projects
}

export function getProjectById(projectId: string): Project | undefined {
  const projects = getProjects()
  return projects.find((p) => p.projectId === projectId)
}

export function saveProject(project: Project): void {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.projectId === project.projectId)
  if (index >= 0) {
    projects[index] = project
  } else {
    projects.push(project)
  }
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
}

export function deleteProject(projectId: string): void {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.projectId !== projectId)
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(filtered))
  // Also delete widget config
  localStorage.removeItem(STORAGE_KEYS.widgetConfig(projectId))
}

// Widget Config
export function getWidgetConfig(projectId: string): WidgetConfig | null {
  const data = localStorage.getItem(STORAGE_KEYS.widgetConfig(projectId))
  return data ? JSON.parse(data) : null
}

export function saveWidgetConfig(config: WidgetConfig): void {
  localStorage.setItem(STORAGE_KEYS.widgetConfig(config.projectId), JSON.stringify(config))
}

export function deleteWidgetConfig(projectId: string): void {
  localStorage.removeItem(STORAGE_KEYS.widgetConfig(projectId))
}

// Default widget templates by theme
export function getDefaultWidgetsByTheme(theme: "efficiency" | "asset" | "biodiversity"): Widget[] {
  const templates: Record<string, Widget[]> = {
    efficiency: [
      {
        id: "w-eff-1",
        title: "관리 우선순위 맵",
        description: "AI 기반 수목 관리 우선순위 시각화",
        enabled: true,
        permission: "customer_view",
        order: 1,
        component: "PriorityMapWidget",
      },
      {
        id: "w-eff-2",
        title: "작업 효율 분석",
        description: "유지관리 작업 효율성 및 비용 절감 분석",
        enabled: true,
        permission: "customer_view",
        order: 2,
        component: "EfficiencyAnalysisWidget",
      },
      {
        id: "w-eff-3",
        title: "수목 건강도 대시보드",
        description: "전체 수목의 건강 상태 요약",
        enabled: true,
        permission: "customer_view",
        order: 3,
        component: "TreeHealthWidget",
      },
      {
        id: "w-eff-4",
        title: "작업 스케줄",
        description: "월별 권장 관리 작업 일정",
        enabled: false,
        permission: "customer_view",
        order: 4,
        component: "ScheduleWidget",
      },
    ],
    asset: [
      {
        id: "w-asset-1",
        title: "자산 가치 평가",
        description: "자연자산의 경제적 가치 정량화",
        enabled: true,
        permission: "customer_view",
        order: 1,
        component: "AssetValueWidget",
      },
      {
        id: "w-asset-2",
        title: "바이오매스 분석",
        description: "생산성 및 바이오매스 측정",
        enabled: true,
        permission: "customer_view",
        order: 2,
        component: "BiomassWidget",
      },
      {
        id: "w-asset-3",
        title: "탄소 저장량",
        description: "탄소 흡수 및 저장 능력 분석",
        enabled: true,
        permission: "customer_view",
        order: 3,
        component: "CarbonWidget",
      },
      {
        id: "w-asset-4",
        title: "투자 수익 예측",
        description: "장기 자산 가치 및 ROI 전망",
        enabled: false,
        permission: "admin_only",
        order: 4,
        component: "ROIWidget",
      },
    ],
    biodiversity: [
      {
        id: "w-bio-1",
        title: "생물다양성 지수",
        description: "종 다양성 및 생태계 건강도 측정",
        enabled: true,
        permission: "customer_view",
        order: 1,
        component: "BiodiversityIndexWidget",
      },
      {
        id: "w-bio-2",
        title: "서식지 분석",
        description: "주요 서식지 현황 및 변화 추적",
        enabled: true,
        permission: "customer_view",
        order: 2,
        component: "HabitatWidget",
      },
      {
        id: "w-bio-3",
        title: "복원 프로젝트 현황",
        description: "생태 복원 작업 진행 상황",
        enabled: true,
        permission: "customer_view",
        order: 3,
        component: "RestorationWidget",
      },
      {
        id: "w-bio-4",
        title: "TNFD 공시 준비",
        description: "TNFD 프레임워크 기반 데이터 정리",
        enabled: false,
        permission: "customer_view",
        order: 4,
        component: "TNFDWidget",
      },
    ],
  }
  return templates[theme] || []
}

// Theme label mapping for UI display
export const themeLabels = {
  efficiency: "운영비 절감",
  asset: "자산 가치 향상",
  biodiversity: "생물다양성",
} as const

// Customer org mapping for display
export const customerOrgMap = {
  "org-customer-001": "고객 1",
  "org-customer-002": "고객 2",
  "org-customer-003": "고객 3",
  "org-customer-004": "고객 4",
  "org-customer-005": "고객 5",
} as const

// Migration function for existing projects without orgId
export function migrateProjectsWithOrgId(currentUser: { role: "admin" | "customer"; orgId?: string }) {
  const data = localStorage.getItem(STORAGE_KEYS.projects)
  if (!data) return

  const projects: Project[] = JSON.parse(data)
  let needsSave = false

  const migratedProjects = projects.map((project) => {
    if (!project.orgId) {
      needsSave = true
      return {
        ...project,
        orgId: currentUser.role === "customer" ? currentUser.orgId || "org-unknown" : "org-unknown",
      }
    }
    return project
  })

  if (needsSave) {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(migratedProjects))
  }
}

export type DeliveryStage = "pending" | "analyzing" | "delivering" | "executing" | "completed"

export const DELIVERY_STAGES: Record<DeliveryStage, { kr: string; en: string; color: string }> = {
  pending: { kr: "대기", en: "Pending", color: "#6B7280" },
  analyzing: { kr: "분석 중", en: "Analyzing", color: "#3B82F6" },
  delivering: { kr: "제공 중", en: "Delivering", color: "#10B981" },
  executing: { kr: "실행 중", en: "Executing", color: "#8B5CF6" },
  completed: { kr: "완료", en: "Completed", color: "#059669" },
}

export function getProjectsByDeliveryStage(stage: DeliveryStage): Project[] {
  return getProjects().filter((p) => p.deliveryStage === stage)
}

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
    widgetStatus: {
      unconfigured: projects.filter((p) => p.widgetStatus === "none").length,
      partial: projects.filter((p) => p.widgetStatus === "partial").length,
      configured: projects.filter((p) => p.widgetStatus === "complete").length,
    },
  }
}

export function updateProjectDeliveryStage(projectId: string, stage: DeliveryStage, memo?: string): void {
  const project = getProjectById(projectId)
  if (!project) return

  const updatedProject = {
    ...project,
    deliveryStage: stage,
    lastActivityAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  saveProject(updatedProject)

  // Optionally log stage change
  if (memo) {
    console.log(`[Stage Change] ${projectId}: ${stage} - ${memo}`)
  }
}

export function calculateWidgetCompletion(projectId: string): { total: number; configured: number } {
  const config = getWidgetConfig(projectId)
  if (!config) return { total: 0, configured: 0 }

  const totalWidgets = config.widgets.length
  const configuredWidgets = config.widgets.filter((w) => w.enabled).length

  return { total: totalWidgets, configured: configuredWidgets }
}

export function updateProjectWidgetStatus(projectId: string): void {
  const project = getProjectById(projectId)
  if (!project) return

  const completion = calculateWidgetCompletion(projectId)
  let widgetStatus: "none" | "partial" | "complete" = "none"

  if (completion.configured === 0) {
    widgetStatus = "none"
  } else if (completion.configured < completion.total) {
    widgetStatus = "partial"
  } else {
    widgetStatus = "complete"
  }

  const updatedProject = {
    ...project,
    widgetCompletion: completion,
    widgetStatus,
    lastActivityAt: new Date().toISOString(),
  }

  saveProject(updatedProject)
}

export function getOrgWithAggregates(orgId: string): Organization | undefined {
  const org = getOrganizationById(orgId)
  if (!org) return undefined

  const orgProjects = getProjectsByOrg(orgId)

  const activeProjectsByStage = {
    pending: orgProjects.filter((p) => p.deliveryStage === "pending").length,
    analyzing: orgProjects.filter((p) => p.deliveryStage === "analyzing").length,
    delivering: orgProjects.filter((p) => p.deliveryStage === "delivering").length,
    executing: orgProjects.filter((p) => p.deliveryStage === "executing").length,
    completed: orgProjects.filter((p) => p.deliveryStage === "completed").length,
  }

  return {
    ...org,
    activeProjectsByStage,
  }
}

export function migrateProjectsToDeliveryStage() {
  const data = localStorage.getItem("naturex_projects")
  if (!data) return

  const projects: any[] = JSON.parse(data)
  let needsSave = false

  const migrated = projects.map((project) => {
    // If already has deliveryStage, skip
    if (project.deliveryStage) return project

    needsSave = true

    // Map old status to new deliveryStage
    let deliveryStage: DeliveryStage = "pending"
    if (project.status === "analyzing") deliveryStage = "analyzing"
    else if (project.status === "delivered") deliveryStage = "delivering"
    else if (project.status === "executing") deliveryStage = "executing"
    else if (project.status === "closed") deliveryStage = "completed"
    else deliveryStage = "pending"

    // Calculate widget completion
    const completion = calculateWidgetCompletion(project.projectId)
    let widgetStatus: "none" | "partial" | "complete" = "none"
    if (completion.configured === 0) widgetStatus = "none"
    else if (completion.configured < completion.total) widgetStatus = "partial"
    else widgetStatus = "complete"

    return {
      ...project,
      deliveryStage,
      widgetCompletion: completion,
      widgetStatus,
      lastActivityAt: project.updatedAt || project.createdAt,
    }
  })

  if (needsSave) {
    localStorage.setItem("naturex_projects", JSON.stringify(migrated))
    console.log("[Migration] Projects migrated to new deliveryStage model")
  }
}

export function getProjectsByOrg(orgId: string): Project[] {
  return getProjects().filter((p) => p.orgId === orgId)
}
