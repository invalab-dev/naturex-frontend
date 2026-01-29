'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProject, type Project } from '@/lib/project-storage';
import {
  TrendingUp,
  Sprout,
  Leaf,
  Zap,
  ArrowLeft,
  Download,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AssetValueWorkspace() {
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

  const assetKPIs = [
    {
      name: '생산성 지수',
      value: 87,
      unit: '점',
      trend: '+5.2%',
      icon: Sprout,
    },
    {
      name: '바이오매스',
      value: 245.8,
      unit: 'ton/ha',
      trend: '+12.3%',
      icon: Leaf,
    },
    {
      name: '탄소저장량',
      value: 122.9,
      unit: 'tCO2/ha',
      trend: '+8.7%',
      icon: Zap,
    },
  ];

  const scenarios = [
    { name: '현재 관리', value: 100, color: 'bg-gray-500' },
    { name: '집약 관리', value: 135, color: 'bg-green-600' },
    { name: '최소 관리', value: 78, color: 'bg-amber-600' },
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
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h1 className="text-xl font-semibold text-[#111827]">
                {project.name}
              </h1>
            </div>
            <div className="text-sm text-[#6B7280] mt-0.5">
              자산 가치 향상 워크스페이스
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            데이터 업데이트
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            가치 평가 보고서
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Asset KPIs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            자산 핵심 지표
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {assetKPIs.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <Card key={index} className="p-6 bg-white border-[#E5E7EB]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-[#6B7280]">{kpi.name}</div>
                    <Icon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-[#111827]">
                      {kpi.value}
                    </span>
                    <span className="text-sm text-[#6B7280]">{kpi.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{kpi.trend} vs 기준선</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Baseline & Trend */}
          <div className="col-span-2">
            {/* Baseline Analysis */}
            <Card className="p-6 bg-white border-[#E5E7EB] mb-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                기준선 및 트렌드 분석
              </h2>
              <div className="h-64 flex items-center justify-center bg-[#F5F7FB] rounded-lg border border-[#E5E7EB]">
                <div className="text-center text-[#6B7280]">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-40" />
                  <div className="text-sm">시계열 차트 영역</div>
                  <div className="text-xs mt-1">
                    생산성, 바이오매스, 탄소 추이
                  </div>
                </div>
              </div>
            </Card>

            {/* Scenario Comparison */}
            <Card className="p-6 bg-white border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                시나리오 비교
              </h2>
              <div className="space-y-4">
                {scenarios.map((scenario, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#6B7280]">
                        {scenario.name}
                      </span>
                      <span className="text-sm font-semibold text-[#111827]">
                        {scenario.value}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${scenario.color}`}
                        style={{ width: `${scenario.value}%` }}
                      />
                    </div>
                    <div className="text-xs text-[#6B7280] mt-1">
                      {scenario.value > 100
                        ? `+${((scenario.value - 100) * 2.45).toFixed(1)} ton/ha`
                        : `${((100 - scenario.value) * 2.45).toFixed(1)} ton/ha 감소`}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-sm font-medium text-green-900 mb-1">
                  권장: 집약 관리 시나리오
                </div>
                <div className="text-xs text-green-700">
                  20년 기준 추가 수익 약 8.7억원 예상 (탄소크레딧 + 목재 생산)
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Current Asset Value */}
            <Card className="p-6 bg-white border-[#E5E7EB] mb-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                현재 자산 가치
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#F5F7FB]">
                  <div className="text-xs text-[#6B7280] mb-1">목재 가치</div>
                  <div className="text-2xl font-bold text-[#111827]">
                    24.5억원
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#F5F7FB]">
                  <div className="text-xs text-[#6B7280] mb-1">
                    탄소크레딧 가치
                  </div>
                  <div className="text-2xl font-bold text-[#111827]">
                    3.2억원
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#F5F7FB]">
                  <div className="text-xs text-[#6B7280] mb-1">
                    생태계서비스
                  </div>
                  <div className="text-2xl font-bold text-[#111827]">
                    5.8억원
                  </div>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <div className="text-xs text-[#6B7280] mb-1">
                    총 자산 가치
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    33.5억원
                  </div>
                </div>
              </div>
            </Card>

            {/* Analysis Tools */}
            <Card className="p-6 bg-white border-[#E5E7EB] mb-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                분석 도구
              </h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  시나리오 편집기
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  장기 예측 모델
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  생태계서비스 평가
                </Button>
              </div>
            </Card>

            {/* Reports */}
            <Card className="p-6 bg-white border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                리포트
              </h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  자산 평가 보고서
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  시나리오 비교 분석
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  투자 의사결정 자료
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
