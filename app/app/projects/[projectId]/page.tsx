"use client"

import { useMemo } from "react"
import { useSearchParams, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Map,
  Download,
  BarChart3,
  FileText,
  Table,
  Globe,
  Box,
  Inbox,
  LineChart,
  LayoutDashboard,
} from "lucide-react"
import { ServiceWorkflowCard } from "@/components/service-workflow-card"
import {
  getProjectById,
  getProjectDeliverables,
  DELIVERY_STAGES,
  themeLabels,
  type MapLayer,
  type DeliverableFile,
  type ChartDataset,
} from "@/lib/local-data-service"
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function ProjectDashboardPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const isPreview = searchParams.get("preview") === "true"
  const userRole = user?.role
  const userOrgId = user?.orgId

  const project = useMemo(() => {
    const proj = getProjectById(projectId)

    if (!proj) return null
    if (!isPreview && userRole === "customer" && proj.orgId !== userOrgId) return null

    return proj
  }, [projectId, isPreview, userRole, userOrgId])

  const deliverables = useMemo(() => {
    if (!project) return { maps: [], downloads: [], visuals: [] }
    const all = getProjectDeliverables(project.projectId)
    return {
      maps: all.maps.filter((m) => m.isPublic),
      downloads: all.downloads.filter((d) => d.isPublic),
      visuals: all.visuals.filter((v) => v.isPublic),
    }
  }, [project])

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FB]">
        <div className="text-center">
          <div className="text-[#6B7280] mb-4">프로젝트를 찾을 수 없습니다</div>
          <Link href="/app/projects">
            <Button variant="outline" size="sm">
              프로젝트 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const stageInfo = DELIVERY_STAGES[project.deliveryStage]
  const hasAnyContent = deliverables.maps.length > 0 || deliverables.downloads.length > 0 || deliverables.visuals.length > 0

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/app/projects">
          <Button variant="ghost" size="sm" className="gap-2 mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            프로젝트 목록
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#111827]">{project.name}</h1>
            <Badge
              style={{ backgroundColor: `${stageInfo.color}20`, color: stageInfo.color, borderColor: stageInfo.color }}
              className="border"
            >
              {stageInfo.kr}
            </Badge>
          </div>
          <p className="text-[#6B7280]">{project.location}</p>
          {project.description && <p className="text-sm text-[#9CA3AF] mt-1">{project.description}</p>}
        </div>

        {/* Workflow Card */}
        <div className="mb-8">
          <ServiceWorkflowCard />
        </div>

        {!hasAnyContent ? (
          <Card className="p-12 bg-white border-[#E5E7EB] text-center">
            <Inbox className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#111827] mb-2">분석 결과 준비 중</h3>
            <p className="text-sm text-[#6B7280] max-w-md mx-auto">
              아직 제공된 결과가 없습니다. InvaLab이 분석 결과를 업로드하면 이곳에 표시됩니다.
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Maps Section */}
            {deliverables.maps.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-5 h-5 text-[#118DFF]" />
                  <h2 className="text-lg font-semibold text-[#111827]">지도</h2>
                  <span className="text-sm text-[#6B7280]">({deliverables.maps.length})</span>
                </div>
                <div className="grid gap-4">
                  {deliverables.maps.map((layer) => (
                    <MapLayerCard key={layer.id} layer={layer} />
                  ))}
                </div>
              </section>
            )}

            {/* Visuals Section */}
            {deliverables.visuals.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-[#118DFF]" />
                  <h2 className="text-lg font-semibold text-[#111827]">표·도표</h2>
                  <span className="text-sm text-[#6B7280]">({deliverables.visuals.length})</span>
                </div>
                <div className="grid gap-4">
                  {deliverables.visuals.map((visual) => (
                    <VisualCard key={visual.id} visual={visual} />
                  ))}
                </div>
              </section>
            )}

            {/* Downloads Section */}
            {deliverables.downloads.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Download className="w-5 h-5 text-[#118DFF]" />
                  <h2 className="text-lg font-semibold text-[#111827]">다운로드</h2>
                  <span className="text-sm text-[#6B7280]">({deliverables.downloads.length})</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {deliverables.downloads.map((file) => (
                    <DownloadCard key={file.id} file={file} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Map Layer Card Component
function MapLayerCard({ layer }: { layer: MapLayer }) {
  const getMapTypeIcon = (type: string) => {
    switch (type) {
      case "geojson":
        return <Globe className="w-5 h-5 text-green-600" />
      case "tiles3d":
        return <Box className="w-5 h-5 text-blue-600" />
      default:
        return <Map className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <Card className="bg-white border-[#E5E7EB] overflow-hidden">
      <div className="p-4 flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            layer.dataType === "geojson" ? "bg-green-100" : layer.dataType === "tiles3d" ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          {getMapTypeIcon(layer.dataType)}
        </div>
        <div className="flex-1">
          <div className="font-medium text-[#1F2937]">{layer.name}</div>
          <div className="text-xs text-[#6B7280] flex items-center gap-2">
            <Badge variant="outline" className="uppercase text-xs">
              {layer.dataType}
            </Badge>
            <span>{new Date(layer.uploadedAt).toLocaleDateString("ko-KR")}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Map className="w-4 h-4" />
          지도 보기
        </Button>
      </div>

      {/* Map Preview Placeholder */}
      <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 border-t border-[#E5E7EB] flex items-center justify-center">
        <div className="text-center text-[#6B7280]">
          <Map className="w-8 h-8 mx-auto mb-2 text-[#118DFF]" />
          <p className="text-sm">인터랙티브 지도 뷰어</p>
        </div>
      </div>
    </Card>
  )
}

// Visual Card Component
function VisualCard({ visual }: { visual: ChartDataset }) {
  const getVisualTypeIcon = (type: string) => {
    switch (type) {
      case "table":
        return <Table className="w-5 h-5 text-slate-600" />
      case "bar_chart":
        return <BarChart3 className="w-5 h-5 text-blue-600" />
      case "line_chart":
        return <LineChart className="w-5 h-5 text-green-600" />
      case "kpi":
        return <LayoutDashboard className="w-5 h-5 text-purple-600" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

  const renderVisualization = () => {
    if (visual.visualizationType === "kpi") {
      return (
        <div className="grid grid-cols-3 gap-4 p-4">
          {visual.data.slice(0, 6).map((item, idx) => (
            <div key={idx} className="bg-[#F9FAFB] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#118DFF]">
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                {item.unit && <span className="text-sm font-normal text-[#6B7280] ml-1">{item.unit}</span>}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">{item.metric_name}</div>
            </div>
          ))}
        </div>
      )
    }

    if (visual.visualizationType === "bar_chart") {
      return (
        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visual.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="metric_name" tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#118DFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (visual.visualizationType === "line_chart") {
      return (
        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={visual.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="metric_name" tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#118DFF" strokeWidth={2} dot={{ fill: "#118DFF" }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      )
    }

    // Default: Table
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-[#374151]">항목</th>
              <th className="px-4 py-2 text-right font-medium text-[#374151]">값</th>
              {visual.data.some((d) => d.unit) && (
                <th className="px-4 py-2 text-left font-medium text-[#374151]">단위</th>
              )}
              {visual.data.some((d) => d.category) && (
                <th className="px-4 py-2 text-left font-medium text-[#374151]">분류</th>
              )}
            </tr>
          </thead>
          <tbody>
            {visual.data.map((row, idx) => (
              <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 text-[#1F2937]">{row.metric_name}</td>
                <td className="px-4 py-3 text-right font-medium text-[#118DFF]">
                  {typeof row.value === "number" ? row.value.toLocaleString() : row.value}
                </td>
                {visual.data.some((d) => d.unit) && <td className="px-4 py-3 text-[#6B7280]">{row.unit || "—"}</td>}
                {visual.data.some((d) => d.category) && (
                  <td className="px-4 py-3 text-[#6B7280]">{row.category || "—"}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <Card className="bg-white border-[#E5E7EB] overflow-hidden">
      <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          {getVisualTypeIcon(visual.visualizationType)}
        </div>
        <div>
          <div className="font-medium text-[#1F2937]">{visual.title}</div>
          {visual.description && <div className="text-xs text-[#6B7280]">{visual.description}</div>}
        </div>
      </div>
      {renderVisualization()}
    </Card>
  )
}

// Download Card Component
function DownloadCard({ file }: { file: DeliverableFile }) {
  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "hwp":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "xlsx":
        return <Table className="w-5 h-5 text-green-600" />
      case "pdf":
        return <FileText className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "—"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card className="p-4 bg-white border-[#E5E7EB]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          {getFileTypeIcon(file.fileType)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[#1F2937] truncate">{file.name}</div>
          <div className="text-xs text-[#6B7280] flex items-center gap-2">
            <Badge variant="outline" className="uppercase text-xs">
              {file.fileType}
            </Badge>
            <span>{formatFileSize(file.fileSize)}</span>
          </div>
          {file.description && <p className="text-xs text-[#9CA3AF] mt-1 truncate">{file.description}</p>}
        </div>
        <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
          <Download className="w-4 h-4" />
          다운로드
        </Button>
      </div>
    </Card>
  )
}
