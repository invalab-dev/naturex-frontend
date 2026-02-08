"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject, type Project } from "@/lib/project-storage";
import {
  Leaf,
  Target,
  MapPin,
  Activity,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function BiodiversityWorkspace() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.projectId) {
      const projectData = getProject(params.projectId as string);
      setProject(projectData);
      setLoading(false);
    }
  }, [params.projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-[#6B7280]">프로젝트를 불러오는 중...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#6B7280] mb-4">
            프로젝트를 찾을 수 없습니다.
          </div>
          <Button
            onClick={() => router.push("/app/projects")}
            variant="outline"
          >
            프로젝트 목록으로
          </Button>
        </div>
      </div>
    );
  }

  const conservationGoals = [
    { name: "종 다양성 지수", current: 67, target: 85, unit: "점" },
    { name: "서식지 면적", current: 12.3, target: 18.0, unit: "ha" },
    { name: "개체군 밀도", current: 24, target: 40, unit: "개체/ha" },
  ];

  const actions = [
    {
      id: 1,
      title: "외래종 제거 작업",
      status: "in-progress",
      area: "A구역",
      completion: 65,
    },
    {
      id: 2,
      title: "서식지 복원",
      status: "planned",
      area: "B구역",
      completion: 0,
    },
    {
      id: 3,
      title: "모니터링 조사",
      status: "completed",
      area: "전체",
      completion: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/app/projects")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <h1 className="text-xl font-semibold text-[#111827]">
                {project.name}
              </h1>
            </div>
            <div className="text-sm text-[#6B7280] mt-0.5">
              생물다양성 프로젝트 워크스페이스
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            현장 데이터 입력
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            ESG 보고서 생성
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Project Goals */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            프로젝트 목표
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {conservationGoals.map((goal, index) => (
              <Card key={index} className="p-6 bg-white border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-[#6B7280]">{goal.name}</div>
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-semibold text-[#111827]">
                      {goal.current}
                    </span>
                    <span className="text-sm text-[#6B7280]">
                      / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress
                    value={(goal.current / goal.target) * 100}
                    className="h-2"
                  />
                </div>
                <div className="text-xs text-[#6B7280]">
                  {Math.round((goal.current / goal.target) * 100)}% 달성
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Baseline & Actions */}
          <div className="col-span-2">
            {/* Biodiversity Baseline */}
            <Card className="p-6 bg-white border-[#E5E7EB] mb-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                생물다양성 기준선
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-sm text-green-700 mb-2">확인된 종</div>
                  <div className="text-3xl font-bold text-green-900 mb-1">
                    142종
                  </div>
                  <div className="text-xs text-green-600">
                    식물 87종, 동물 55종
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-sm text-blue-700 mb-2">보호종</div>
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    8종
                  </div>
                  <div className="text-xs text-blue-600">
                    법정보호종 3종 포함
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="text-sm text-amber-700 mb-2">외래종</div>
                  <div className="text-3xl font-bold text-amber-900 mb-1">
                    12종
                  </div>
                  <div className="text-xs text-amber-600">관리 대상 5종</div>
                </div>
                <div className="p-4 rounded-lg bg-violet-50 border border-violet-200">
                  <div className="text-sm text-violet-700 mb-2">
                    서식지 상태
                  </div>
                  <div className="text-3xl font-bold text-violet-900 mb-1">
                    양호
                  </div>
                  <div className="text-xs text-violet-600">
                    평균 건강도 78/100
                  </div>
                </div>
              </div>
            </Card>

            {/* Conservation Actions */}
            <Card className="p-6 bg-white border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#111827]">
                  보전/복원 활동
                </h2>
                <Button variant="outline" size="sm">
                  활동 추가
                </Button>
              </div>
              <div className="space-y-4">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="p-4 rounded-lg border border-[#E5E7EB] hover:border-green-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium text-[#111827] mb-1">
                          {action.title}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <MapPin className="h-3.5 w-3.5" />
                          {action.area}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          action.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : action.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {action.status === "completed"
                          ? "완료"
                          : action.status === "in-progress"
                            ? "진행중"
                            : "예정"}
                      </div>
                    </div>
                    <Progress value={action.completion} className="h-2" />
                    <div className="text-xs text-[#6B7280] mt-2">
                      {action.completion}% 완료
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Impact Tracking */}
            <Card className="p-6 bg-white border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                임팩트 추적
              </h2>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-[#F5F7FB]">
                  <div className="text-xs text-[#6B7280] mb-1">
                    탄소저장량 증가
                  </div>
                  <div className="text-xl font-semibold text-[#111827]">
                    +245 tCO2
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#F5F7FB]">
                  <div className="text-xs text-[#6B7280] mb-1">
                    서식지 개선 면적
                  </div>
                  <div className="text-xl font-semibold text-[#111827]">
                    8.7 ha
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#F5F7FB]">
                  <div className="text-xs text-[#6B7280] mb-1">
                    생태계서비스 가치
                  </div>
                  <div className="text-xl font-semibold text-[#111827]">
                    +2.3억원
                  </div>
                </div>
              </div>
            </Card>

            {/* ESG & TNFD */}
            <Card className="p-6 bg-white border-[#E5E7EB] mt-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                ESG·TNFD 연계
              </h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-sm font-medium text-green-900 mb-1">
                    공시 준비도
                  </div>
                  <Progress value={72} className="h-2 mb-2" />
                  <div className="text-xs text-green-700">72% 완료</div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  TNFD 데이터 매핑
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  LEAP 분석 결과
                </Button>
              </div>
            </Card>

            {/* Reports */}
            <Card className="p-6 bg-white border-[#E5E7EB] mt-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                보고서
              </h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  생물다양성 현황 보고서
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  보전 활동 이행 보고서
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  ESG 공시 자료
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
