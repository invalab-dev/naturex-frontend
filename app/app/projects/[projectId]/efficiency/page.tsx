'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProject, type Project } from '@/lib/project-storage';
import {
  TrendingDown,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Download,
  MapPin,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function EfficiencyWorkspace() {
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
            onClick={() => router.push('/app/projects')}
            variant="outline"
          >
            프로젝트 목록으로
          </Button>
        </div>
      </div>
    );
  }

  const managementScope = project.config?.managementScope || [];
  const includesTreeManagement = managementScope.includes('위험 수목 관리');
  const includesPriorityOptimization =
    managementScope.includes('유지관리 우선순위 최적화');
  const includesInvasiveSpecies =
    managementScope.includes('교란식물 탐지 및 제거');

  const priorityItems = [
    {
      id: 1,
      location: '중구 을지로 234',
      risk: 'high',
      status: 'urgent',
      issue: '가로수 기울기 15° 이상',
      cost: 280000,
    },
    {
      id: 2,
      location: '강남구 테헤란로 521',
      risk: 'medium',
      status: 'planned',
      issue: '병충해 감염 확인',
      cost: 150000,
    },
    {
      id: 3,
      location: '송파구 올림픽로 435',
      risk: 'high',
      status: 'urgent',
      issue: '뿌리 융기로 보행로 손상',
      cost: 320000,
    },
    {
      id: 4,
      location: '마포구 월드컵로 240',
      risk: 'low',
      status: 'monitoring',
      issue: '수관 비대칭',
      cost: 85000,
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
            onClick={() => router.push('/app/projects')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <h1 className="text-xl font-semibold text-[#111827]">
                {project.name}
              </h1>
            </div>
            <div className="text-sm text-[#6B7280] mt-0.5">
              운영비 절감 워크스페이스
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            데이터 업로드
          </Button>
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            비용 절감 시뮬레이션
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1600px] mx-auto">
        <Card className="p-6 bg-white border-[#E5E7EB] mb-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            분석 범위 요약
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {includesTreeManagement ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-[#9CA3AF]" />
              )}
              <span
                className={
                  includesTreeManagement ? 'text-[#111827]' : 'text-[#9CA3AF]'
                }
              >
                위험 수목 관리
              </span>
            </div>
            <div className="flex items-center gap-2">
              {includesPriorityOptimization ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-[#9CA3AF]" />
              )}
              <span
                className={
                  includesPriorityOptimization
                    ? 'text-[#111827]'
                    : 'text-[#9CA3AF]'
                }
              >
                유지관리 우선순위 최적화
              </span>
            </div>
            <div className="flex items-center gap-2">
              {includesInvasiveSpecies ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-[#9CA3AF]" />
              )}
              <span
                className={
                  includesInvasiveSpecies ? 'text-[#111827]' : 'text-[#9CA3AF]'
                }
              >
                교란식물 탐지 및 제거
              </span>
              {!includesInvasiveSpecies && (
                <span className="text-xs text-[#9CA3AF] ml-2">
                  (요청되지 않음)
                </span>
              )}
            </div>
          </div>
          {!includesInvasiveSpecies && (
            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280]">
                💡 교란식물 관리는 본 프로젝트 범위에 포함되지 않습니다. 추가를
                원하시면 프로젝트 설정을 변경해주세요.
              </p>
            </div>
          )}
        </Card>

        {/* Management Status Summary */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-[#6B7280]">총 관리 대상</div>
              <MapPin className="h-4 w-4 text-[#118DFF]" />
            </div>
            <div className="text-3xl font-bold text-[#111827] mb-1">1,247</div>
            <div className="text-xs text-[#6B7280]">개소</div>
          </Card>
          <Card className="p-6 bg-white border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-[#6B7280]">긴급 조치 필요</div>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-1">23</div>
            <div className="text-xs text-[#6B7280]">개소 (1.8%)</div>
          </Card>
          <Card className="p-6 bg-white border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-[#6B7280]">계획된 작업</div>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-1">87</div>
            <div className="text-xs text-[#6B7280]">개소 (7.0%)</div>
          </Card>
          <Card className="p-6 bg-white border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-[#6B7280]">예상 절감액</div>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">3.2억</div>
            <div className="text-xs text-[#6B7280]">연간 (24% 절감)</div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Priority Action List */}
          <div className="col-span-2">
            <Card className="p-6 bg-white border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#111827]">
                  우선 조치 목록
                </h2>
                <Button variant="outline" size="sm">
                  전체 보기
                </Button>
              </div>
              <div className="space-y-3">
                {priorityItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      item.status === 'urgent'
                        ? 'border-red-200 bg-red-50 hover:border-red-300'
                        : item.status === 'planned'
                          ? 'border-amber-200 bg-amber-50 hover:border-amber-300'
                          : 'border-[#E5E7EB] bg-white hover:border-[#118DFF]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-3.5 w-3.5 text-[#6B7280]" />
                          <span className="font-medium text-[#111827]">
                            {item.location}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.risk === 'high'
                                ? 'bg-red-100 text-red-700'
                                : item.risk === 'medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.risk === 'high'
                              ? '높음'
                              : item.risk === 'medium'
                                ? '중간'
                                : '낮음'}
                          </span>
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {item.issue}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#111827]">
                          {(item.cost / 10000).toFixed(0)}만원
                        </div>
                        <div className="text-xs text-[#6B7280]">예상 비용</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs bg-transparent"
                      >
                        상세 보기
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 text-xs bg-[#118DFF] hover:bg-[#0d6ecc] text-white"
                      >
                        작업 배정
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Cost Reduction Progress */}
            <Card className="p-6 bg-white border-[#E5E7EB] mb-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                비용 절감 현황
              </h2>
              <div className="space-y-4">
                {includesTreeManagement && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#6B7280]">
                        긴급 작업 최적화
                      </span>
                      <span className="text-sm font-semibold text-[#111827]">
                        8,200만원
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}
                {includesPriorityOptimization && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#6B7280]">
                          예방 관리 효율화
                        </span>
                        <span className="text-sm font-semibold text-[#111827]">
                          1억 2천만원
                        </span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#6B7280]">
                          불필요한 작업 제거
                        </span>
                        <span className="text-sm font-semibold text-[#111827]">
                          1억 2천만원
                        </span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </>
                )}
                {includesInvasiveSpecies && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#6B7280]">
                        교란식물 제거 효율화
                      </span>
                      <span className="text-sm font-semibold text-[#111827]">
                        4,500만원
                      </span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                )}
              </div>
            </Card>

            {/* Execution Tools */}
            <Card className="p-6 bg-white border-[#E5E7EB] mb-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                실행 도구
              </h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  지도에서 보기
                </Button>
                {includesPriorityOptimization && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm bg-transparent"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    작업 일정 관리
                  </Button>
                )}
                {includesTreeManagement && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm bg-transparent"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    위험도 재평가
                  </Button>
                )}
              </div>
            </Card>

            {/* Reports */}
            <Card className="p-6 bg-white border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                리포트
              </h2>
              <div className="space-y-2">
                {includesPriorityOptimization && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    우선순위 목록
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  비용 절감 분석
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  작업 이행 보고서
                </Button>
                {includesInvasiveSpecies && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    교란식물 관리 보고서
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
