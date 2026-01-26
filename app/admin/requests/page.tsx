"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getProjectRequests,
  convertRequestToProject,
  updateProjectRequest,
  deleteProjectRequest,
  type ProjectRequest,
} from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Clock,
  CheckCircle2,
  XCircle,
  Gauge,
  TrendingUp,
  Leaf,
  Mail,
  MapPin,
  Database,
  FileText,
  AlertCircle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminRequestsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = () => {
    const allRequests = getProjectRequests("admin")
    const sorted = allRequests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
    setRequests(sorted)
  }

  const handleAction = (request: ProjectRequest, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setActionType(action)
    setReviewNotes("")
    setActionDialogOpen(true)
  }

  const confirmAction = () => {
    if (!selectedRequest || !actionType || !user) return

    try {
      if (actionType === "approve") {
        // Convert request to project
        const project = convertRequestToProject(selectedRequest.requestId, user.id)
        toast({
          title: "프로젝트 생성 완료",
          description: `${project.name} 프로젝트가 생성되었습니다. 위젯 구성을 시작하세요.`,
        })

        // Navigate to widget builder
        router.push(`/admin/projects/${project.projectId}/builder`)
      } else if (actionType === "reject") {
        // Update request as rejected
        updateProjectRequest(selectedRequest.requestId, {
          status: "rejected",
          reviewedBy: user.id,
          reviewedAt: new Date().toISOString(),
          reviewNotes,
        })

        toast({
          title: "요청 거절됨",
          description: "프로젝트 요청이 거절되었습니다.",
        })
      }

      loadRequests()
      setActionDialogOpen(false)
      setSelectedRequest(null)
      setActionType(null)
      setReviewNotes("")
    } catch (error) {
      console.error("[v0] Failed to process request:", error)
      toast({
        title: "작업 실패",
        description: "요청 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (requestId: string) => {
    if (!confirm("이 요청을 삭제하시겠습니까?")) return

    try {
      deleteProjectRequest(requestId)
      loadRequests()
      toast({
        title: "요청 삭제됨",
        description: "프로젝트 요청이 삭제되었습니다.",
      })
    } catch (error) {
      console.error("[v0] Failed to delete request:", error)
      toast({
        title: "삭제 실패",
        description: "요청 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const purposeConfig = {
    efficiency: { label: "운영비 절감", icon: Gauge, color: "text-blue-600", bgColor: "bg-blue-50" },
    asset: { label: "자산 가치 향상", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
    biodiversity: { label: "생물다양성", icon: Leaf, color: "text-teal-600", bgColor: "bg-teal-50" },
  }

  const statusConfig = {
    pending: { label: "대기 중", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    approved: { label: "승인됨", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    rejected: { label: "거절됨", color: "bg-red-100 text-red-700", icon: XCircle },
    converted: { label: "프로젝트 생성됨", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const processedRequests = requests.filter((r) => r.status !== "pending")

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#111827] mb-2">프로젝트 요청 관리</h1>
          <p className="text-sm text-[#6B7280]">
            고객이 요청한 프로젝트를 검토하고 승인하여 실제 프로젝트로 전환합니다
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280] mb-1">전체 요청</div>
            <div className="text-2xl font-bold text-[#111827]">{requests.length}</div>
          </Card>
          <Card className="p-4 bg-white border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280] mb-1">대기 중</div>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
          </Card>
          <Card className="p-4 bg-white border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280] mb-1">승인됨</div>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter((r) => r.status === "approved" || r.status === "converted").length}
            </div>
          </Card>
          <Card className="p-4 bg-white border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280] mb-1">거절됨</div>
            <div className="text-2xl font-bold text-red-600">
              {requests.filter((r) => r.status === "rejected").length}
            </div>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              검토 대기 중 ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => {
                const purpose = purposeConfig[request.purpose]
                const PurposeIcon = purpose.icon
                const status = statusConfig[request.status]
                const StatusIcon = status.icon

                return (
                  <Card key={request.requestId} className="p-6 bg-white border-[#E5E7EB]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${purpose.bgColor}`}>
                            <PurposeIcon className={`w-5 h-5 ${purpose.color}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#111827]">{purpose.label} 프로젝트 요청</h3>
                            <div className="text-sm text-[#6B7280]">{request.orgName}</div>
                          </div>
                          <Badge className={`ml-auto ${status.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5" />
                            <div>
                              <div className="text-xs text-[#6B7280] mb-0.5">대상 지역</div>
                              <div className="text-sm text-[#111827]">{request.location}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-[#6B7280] mt-0.5" />
                            <div>
                              <div className="text-xs text-[#6B7280] mb-0.5">요청자</div>
                              <div className="text-sm text-[#111827]">
                                {request.requestedBy} ({request.requestedByEmail})
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Database className="w-4 h-4 text-[#6B7280] mt-0.5" />
                            <div>
                              <div className="text-xs text-[#6B7280] mb-0.5">보유 데이터</div>
                              <div className="text-sm text-[#111827]">
                                {request.availableData.length > 0
                                  ? request.availableData
                                      .map((d) => {
                                        if (d === "drone_rgb") return "드론 RGB"
                                        if (d === "lidar") return "LiDAR"
                                        if (d === "satellite") return "위성"
                                        if (d === "none") return "없음"
                                        return d
                                      })
                                      .join(", ")
                                  : "미입력"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-[#6B7280] mt-0.5" />
                            <div>
                              <div className="text-xs text-[#6B7280] mb-0.5">기대 결과</div>
                              <div className="text-sm text-[#111827]">
                                {request.expectedOutputs.length > 0
                                  ? request.expectedOutputs
                                      .map((o) => {
                                        if (o === "dashboard") return "대시보드"
                                        if (o === "pdf_report") return "PDF 보고서"
                                        if (o === "data_download") return "데이터 다운로드"
                                        return o
                                      })
                                      .join(", ")
                                  : "미입력"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Notes */}
                        {request.additionalNotes && (
                          <div className="p-3 bg-[#F5F7FB] rounded-lg mb-4">
                            <div className="text-xs text-[#6B7280] mb-1">추가 요청 사항</div>
                            <div className="text-sm text-[#374151]">{request.additionalNotes}</div>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="text-xs text-[#9CA3AF]">
                          요청일: {new Date(request.requestedAt).toLocaleString("ko-KR")}
                        </div>
                      </div>

                      {/* Actions */}
                      {request.status === "pending" && (
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleAction(request, "approve")}
                            className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            승인 및 프로젝트 생성
                          </Button>
                          <Button
                            onClick={() => handleAction(request, "reject")}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            거절
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-[#111827] mb-4">처리 완료 ({processedRequests.length})</h2>
            <div className="space-y-3">
              {processedRequests.map((request) => {
                const purpose = purposeConfig[request.purpose]
                const PurposeIcon = purpose.icon
                const status = statusConfig[request.status]
                const StatusIcon = status.icon

                return (
                  <Card
                    key={request.requestId}
                    className="p-4 bg-white border-[#E5E7EB] opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PurposeIcon className={`w-5 h-5 ${purpose.color}`} />
                        <div>
                          <div className="font-medium text-[#111827]">
                            {purpose.label} - {request.location}
                          </div>
                          <div className="text-sm text-[#6B7280]">
                            {request.orgName} · {new Date(request.requestedAt).toLocaleDateString("ko-KR")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        {request.status === "converted" && request.convertedToProjectId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/projects/${request.convertedToProjectId}/builder`)}
                          >
                            프로젝트 보기
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(request.requestId)}>
                          삭제
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <Card className="p-16 bg-white border-[#E5E7EB] text-center">
            <Clock className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#111827] mb-2">요청이 없습니다</h3>
            <p className="text-sm text-[#6B7280]">고객이 프로젝트를 요청하면 여기에 표시됩니다.</p>
          </Card>
        )}

        {/* Action Dialog */}
        <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <AlertDialogContent className="bg-white border-[#E5E7EB]">
            <AlertDialogHeader>
              <AlertDialogTitle>{actionType === "approve" ? "프로젝트 생성 및 승인" : "요청 거절"}</AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === "approve"
                  ? "이 요청을 승인하고 실제 프로젝트로 전환하시겠습니까? 승인 후 위젯 구성 페이지로 이동합니다."
                  : "이 요청을 거절하시겠습니까? 거절 사유를 입력해주세요."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {actionType === "reject" && (
              <div className="py-4">
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="거절 사유를 입력하세요 (선택사항)"
                  className="min-h-[100px] bg-white border-[#E5E7EB]"
                />
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                className={
                  actionType === "approve"
                    ? "bg-[#118DFF] hover:bg-[#0d6ecc] text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
              >
                {actionType === "approve" ? "승인 및 생성" : "거절"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
