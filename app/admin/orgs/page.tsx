"use client"

import type React from "react"
import Link from "next/link"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Settings,
  FolderKanban,
  MoreVertical,
  X,
  ExternalLink,
  Archive,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  getOrganizations,
  saveOrganization,
  deleteOrganization,
  getProjects,
  themeLabels,
  DELIVERY_STAGES,
  type Organization,
  type Project,
  type DeliveryStage,
} from "@/lib/data-service"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function AdminOrgsPage() {
  const router = useRouter()
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [serviceFilter, setServiceFilter] = useState<string[]>([])
  const [deliveryStageFilter, setDeliveryStageFilter] = useState<DeliveryStage[]>([])
  const [sortBy, setSortBy] = useState("recent")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    contact: "",
    status: "active" as Organization["status"],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setOrgs(getOrganizations())
    setProjects(getProjects())
  }

  const getProjectsByOrg = (orgId: string) => {
    return projects.filter((p) => p.orgId === orgId)
  }

  const getServicesByOrg = (orgId: string) => {
    const orgProjects = getProjectsByOrg(orgId)
    const themes = [...new Set(orgProjects.map((p) => p.theme))]
    return themes
  }

  const getDeliveryHeatmap = (orgId: string) => {
    const orgProjects = getProjectsByOrg(orgId)

    const heatmap: Record<
      string,
      {
        dominantStage: DeliveryStage | null
        projectCount: number
      }
    > = {
      efficiency: { dominantStage: null, projectCount: 0 },
      asset: { dominantStage: null, projectCount: 0 },
      biodiversity: { dominantStage: null, projectCount: 0 },
    }

    orgProjects.forEach((project) => {
      const theme = project.theme
      heatmap[theme].projectCount++

      // Determine dominant stage (most advanced)
      if (
        !heatmap[theme].dominantStage ||
        getStageOrder(project.deliveryStage) > getStageOrder(heatmap[theme].dominantStage!)
      ) {
        heatmap[theme].dominantStage = project.deliveryStage
      }
    })

    return heatmap
  }

  const getStageOrder = (stage: DeliveryStage): number => {
    const order: Record<DeliveryStage, number> = {
      pending: 1,
      analyzing: 2,
      delivering: 3,
      executing: 4,
      completed: 5,
    }
    return order[stage] || 0
  }

  const getLastActivity = (orgId: string) => {
    const orgProjects = getProjectsByOrg(orgId)
    if (orgProjects.length === 0) return "활동 없음"

    const latestProject = orgProjects.sort(
      (a, b) =>
        new Date(b.lastActivityAt || b.createdAt).getTime() - new Date(a.lastActivityAt || a.createdAt).getTime(),
    )[0]

    const daysAgo = Math.floor(
      (Date.now() - new Date(latestProject.lastActivityAt || latestProject.createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    )

    return daysAgo === 0 ? "오늘" : `${daysAgo}일 전`
  }

  // Filtered and sorted organizations
  const filteredOrgs = useMemo(() => {
    let filtered = orgs

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.orgId.toLowerCase().includes(query) ||
          org.contact.toLowerCase().includes(query),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((org) => org.status === statusFilter)
    }

    // Service filter
    if (serviceFilter.length > 0) {
      filtered = filtered.filter((org) => {
        const services = getServicesByOrg(org.orgId)
        return serviceFilter.some((sf) => services.includes(sf as any))
      })
    }

    if (deliveryStageFilter.length > 0) {
      filtered = filtered.filter((org) => {
        const orgProjects = getProjectsByOrg(org.orgId)
        return orgProjects.some((p) => deliveryStageFilter.includes(p.deliveryStage))
      })
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "projects") {
        return getProjectsByOrg(b.orgId).length - getProjectsByOrg(a.orgId).length
      } else if (sortBy === "activity") {
        const aProjects = getProjectsByOrg(a.orgId)
        const bProjects = getProjectsByOrg(b.orgId)
        if (aProjects.length === 0) return 1
        if (bProjects.length === 0) return -1
        const aLatest = aProjects.sort(
          (x, y) =>
            new Date(y.lastActivityAt || y.createdAt).getTime() - new Date(x.lastActivityAt || x.createdAt).getTime(),
        )[0]
        const bLatest = bProjects.sort(
          (x, y) =>
            new Date(y.lastActivityAt || y.createdAt).getTime() - new Date(x.lastActivityAt || x.createdAt).getTime(),
        )[0]
        return (
          new Date(bLatest.lastActivityAt || bLatest.createdAt).getTime() -
          new Date(aLatest.lastActivityAt || aLatest.createdAt).getTime()
        )
      }
      return 0
    })

    return filtered
  }, [orgs, projects, searchQuery, statusFilter, serviceFilter, deliveryStageFilter, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage)
  const paginatedOrgs = filteredOrgs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const org: Organization = {
      orgId: editingOrg?.orgId || `org-${Date.now()}`,
      name: formData.name,
      industry: formData.industry,
      contact: formData.contact,
      status: formData.status,
      lastActivity: editingOrg?.lastActivity,
      createdAt: editingOrg?.createdAt || new Date().toISOString(),
    }
    saveOrganization(org)
    loadData()
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (org: Organization) => {
    setEditingOrg(org)
    setFormData({
      name: org.name,
      industry: org.industry,
      contact: org.contact,
      status: org.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (orgId: string) => {
    const projectCount = getProjectsByOrg(orgId).length
    if (projectCount > 0) {
      alert(`이 조직에 ${projectCount}개의 프로젝트가 있어 삭제할 수 없습니다.`)
      return
    }
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteOrganization(orgId)
      loadData()
      if (selectedOrg?.orgId === orgId) {
        setSelectedOrg(null)
      }
    }
  }

  const handleArchive = (orgId: string) => {
    const org = orgs.find((o) => o.orgId === orgId)
    if (org) {
      saveOrganization({ ...org, status: "archived" })
      loadData()
    }
  }

  const resetForm = () => {
    setEditingOrg(null)
    setFormData({ name: "", industry: "", contact: "", status: "active" })
  }

  const toggleServiceFilter = (service: string) => {
    setServiceFilter((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const toggleDeliveryStageFilter = (stage: DeliveryStage) => {
    setDeliveryStageFilter((prev) => (prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]))
  }

  const getStatusBadge = (status: Organization["status"]) => {
    const configs = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      onboarding: { label: "Onboarding", className: "bg-blue-100 text-blue-800" },
      paused: { label: "Paused", className: "bg-yellow-100 text-yellow-800" },
      archived: { label: "Archived", className: "bg-gray-100 text-gray-800" },
    }
    const config = configs[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F5F7FB]">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${selectedOrg ? "mr-96" : ""}`}>
        {/* Top Control Bar */}
        <div className="bg-white border-b border-[#E5E7EB] px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="조직명, Org ID, 담당자 검색..."
                className="pl-10 bg-white border-[#E5E7EB] placeholder:text-slate-400"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white border-[#E5E7EB]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white border-[#E5E7EB]">
                  서비스 제공 상태
                  {deliveryStageFilter.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-[#118DFF] text-white">
                      {deliveryStageFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                {Object.entries(DELIVERY_STAGES).map(([key, { kr }]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => toggleDeliveryStageFilter(key as DeliveryStage)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {deliveryStageFilter.includes(key as DeliveryStage) && (
                        <CheckCircle2 className="w-4 h-4 text-[#118DFF]" />
                      )}
                      <span>{kr}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Service Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white border-[#E5E7EB]">
                  활성 서비스
                  {serviceFilter.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-[#118DFF] text-white">
                      {serviceFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                {Object.entries(themeLabels).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => toggleServiceFilter(key)} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      {serviceFilter.includes(key) && <CheckCircle2 className="w-4 h-4 text-[#118DFF]" />}
                      <span>{label}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-white border-[#E5E7EB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="recent">최근 생성</SelectItem>
                <SelectItem value="projects">프로젝트 수 많은 순</SelectItem>
                <SelectItem value="activity">최근 활동 기준</SelectItem>
              </SelectContent>
            </Select>

            {/* Create Button */}
            <Link href="/admin/orgs/new">
              <Button className="bg-[#118DFF] hover:bg-[#0D6FCC] gap-2 ml-auto text-white">
                <Plus className="w-4 h-4" />
                조직 생성
              </Button>
            </Link>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || statusFilter !== "all" || serviceFilter.length > 0 || deliveryStageFilter.length > 0) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-[#6B7280]">활성 필터:</span>
              {searchQuery && (
                <Badge variant="secondary" className="bg-[#F5F7FB] text-[#111827] gap-1">
                  검색: {searchQuery}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="bg-[#F5F7FB] text-[#111827] gap-1">
                  상태: {statusFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                </Badge>
              )}
              {deliveryStageFilter.map((stage) => (
                <Badge key={stage} variant="secondary" className="bg-[#F5F7FB] text-[#111827] gap-1">
                  {DELIVERY_STAGES[stage].kr}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleDeliveryStageFilter(stage)} />
                </Badge>
              ))}
              {serviceFilter.map((sf) => (
                <Badge key={sf} variant="secondary" className="bg-[#F5F7FB] text-[#111827] gap-1">
                  {themeLabels[sf as keyof typeof themeLabels]}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleServiceFilter(sf)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F5F7FB] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    조직명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Org ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    서비스 제공 현황
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    프로젝트 수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    최근 활동
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {paginatedOrgs.map((org) => {
                  const services = getServicesByOrg(org.orgId)
                  const projectCount = getProjectsByOrg(org.orgId).length
                  const lastActivity = getLastActivity(org.orgId)
                  const heatmap = getDeliveryHeatmap(org.orgId)

                  return (
                    <tr
                      key={org.orgId}
                      onClick={() => setSelectedOrg(org)}
                      className="hover:bg-[#F5F7FB] cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#111827]">{org.name}</div>
                        <div className="text-sm text-[#6B7280]">{org.industry}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs px-2 py-1 bg-[#F5F7FB] text-[#6B7280] rounded font-mono">
                          {org.orgId}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {Object.entries(heatmap).map(([theme, data]) => {
                            const stageInfo = data.dominantStage ? DELIVERY_STAGES[data.dominantStage] : null
                            const stageColor = stageInfo 
                              ? `bg-opacity-20 border-opacity-40`
                              : "bg-gray-50 border-gray-200"

                            return (
                              <div
                                key={theme}
                                className={`flex items-center justify-between px-2 py-1 rounded border ${data.projectCount > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} text-xs group relative`}
                              >
                                <span className="font-medium text-[#111827] truncate">
                                  {themeLabels[theme as keyof typeof themeLabels].split(" ")[0]}
                                </span>
                                {stageInfo ? (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0"
                                    style={{
                                      backgroundColor: stageInfo.color + "20",
                                      color: stageInfo.color,
                                      borderColor: stageInfo.color,
                                    }}
                                  >
                                    {stageInfo.kr}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-400 text-[10px]">-</span>
                                )}

                                {/* Tooltip */}
                                {data.projectCount > 0 && (
                                  <div className="absolute left-0 top-full mt-1 p-2 bg-[#111827] text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
                                    <div>프로젝트: {data.projectCount}건</div>
                                    {stageInfo && <div>단계: {stageInfo.kr}</div>}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="w-4 h-4 text-[#6B7280]" />
                          <span className="text-sm font-medium text-[#111827]">{projectCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(org.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <Clock className="w-4 h-4" />
                          {lastActivity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedOrg(org)
                              }}
                            >
                              보기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/admin/projects?org=${org.orgId}`)
                              }}
                            >
                              프로젝트 관리
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(org)
                              }}
                            >
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleArchive(org.orgId)
                              }}
                            >
                              아카이브
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(org.orgId)
                              }}
                              className="text-red-600"
                            >
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {paginatedOrgs.length === 0 && (
              <div className="py-12 text-center text-[#6B7280]">
                {searchQuery || statusFilter !== "all" || serviceFilter.length > 0 || deliveryStageFilter.length > 0
                  ? "검색 결과가 없습니다."
                  : "등록된 조직이 없습니다."}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-[#6B7280]">
                총 {filteredOrgs.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredOrgs.length)}개 표시
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? "bg-[#118DFF] hover:bg-[#0D6FCC]" : ""}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedOrg && (
        <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-[#E5E7EB] shadow-lg overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">조직 상세</h2>
            <Button variant="ghost" size="sm" onClick={() => setSelectedOrg(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Organization Summary */}
            <div>
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">조직 정보</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">조직명</div>
                  <div className="text-sm font-medium text-[#111827]">{selectedOrg.name}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">Org ID</div>
                  <code className="text-xs px-2 py-1 bg-[#F5F7FB] text-[#6B7280] rounded font-mono">
                    {selectedOrg.orgId}
                  </code>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">상태</div>
                  {getStatusBadge(selectedOrg.status)}
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">생성일</div>
                  <div className="text-sm text-[#111827]">
                    {new Date(selectedOrg.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">담당자</div>
                  <div className="text-sm text-[#111827]">{selectedOrg.contact}</div>
                </div>
              </div>
            </div>

            {/* Active Services & Projects */}
            <div>
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">활성 서비스 & 프로젝트</h3>
              <div className="space-y-2">
                {Object.entries(themeLabels).map(([theme, label]) => {
                  const count = getProjectsByOrg(selectedOrg.orgId).filter((p) => p.theme === theme).length
                  return (
                    <div key={theme} className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg">
                      <span className="text-sm text-[#111827]">{label}</span>
                      <Badge
                        variant="secondary"
                        className={count > 0 ? "bg-[#118DFF] text-white" : "bg-white text-[#6B7280]"}
                      >
                        {count}건
                      </Badge>
                    </div>
                  )
                })}
              </div>
              <Button
                variant="outline"
                className="w-full mt-3 bg-transparent"
                onClick={() => router.push(`/admin/projects?org=${selectedOrg.orgId}`)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                프로젝트 관리로 이동
              </Button>
            </div>

            {/* Widget Provisioning Status */}
            <div>
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">위젯 구성 현황</h3>
              <div className="space-y-2">
                {Object.entries(getWidgetStatusByOrg(selectedOrg.orgId)).map(([theme, status]) => {
                  const icons = {
                    configured: <CheckCircle2 className="w-4 h-4 text-green-600" />,
                    unconfigured: <AlertCircle className="w-4 h-4 text-yellow-600" />,
                    unused: <span className="w-4 h-4 text-[#9CA3AF]">-</span>,
                  }
                  const labels = {
                    configured: "구성 완료",
                    unconfigured: "구성 중",
                    unused: "미사용",
                  }
                  return (
                    <div key={theme} className="flex items-center justify-between p-3 bg-[#F5F7FB] rounded-lg">
                      <span className="text-sm text-[#111827]">{themeLabels[theme as keyof typeof themeLabels]}</span>
                      <div className="flex items-center gap-2">
                        {icons[status]}
                        <span className="text-sm text-[#6B7280]">{labels[status]}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Delivery Heatmap Status */}
            <div>
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">서비스 제공 현황</h3>
              <div className="space-y-2">
                {Object.entries(getDeliveryHeatmap(selectedOrg.orgId)).map(([theme, data]) => {
                  const stageInfo = data.dominantStage ? DELIVERY_STAGES[data.dominantStage] : null

                  return (
                    <div
                      key={theme}
                      className={`flex items-center justify-between px-3 py-2 rounded border ${data.projectCount > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <span className="text-sm text-[#111827]">{themeLabels[theme as keyof typeof themeLabels]}</span>
                      <div className="flex items-center gap-2">
                        {stageInfo ? (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                            style={{
                              backgroundColor: stageInfo.color + "20",
                              color: stageInfo.color,
                              borderColor: stageInfo.color,
                            }}
                          >
                            {stageInfo.kr}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                        <span className="text-sm text-[#6B7280]">({data.projectCount}건)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">빠른 작업</h3>
              <div className="space-y-2">
                <Button
                  className="w-full bg-[#118DFF] hover:bg-[#0D6FCC] justify-start"
                  onClick={() => router.push(`/admin/projects?action=create&org=${selectedOrg.orgId}`)}
                >
                  <Plus className="w-4 h-4 mr-2" />이 조직으로 프로젝트 생성
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    router.push(`/admin/projects?org=${selectedOrg.orgId}`)
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  프로젝트 관리
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleEdit(selectedOrg)}
                >
                  조직 정보 수정
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleArchive(selectedOrg.orgId)}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  조직 아카이브
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
