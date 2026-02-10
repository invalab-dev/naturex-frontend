'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  Building2,
  FolderKanban,
  TrendingUp,
  Clock,
  CheckCircle2,
  PlayCircle,
  Flag,
} from 'lucide-react';
import { ProjectStatus, ProjectTheme } from '@/lib/data-type';

export default function AdminHomePage() {
  type StatsType = {
    organizationsCount: number;
    projectsCount: Record<ProjectTheme, number> & Record<ProjectStatus, number>;
    details: Map<string, number>;
  };

  const [stats, setStats] = useState<StatsType>({
    organizationsCount: 0,
    projectsCount: {
      efficiency: 0,
      asset: 0,
      biodiversity: 0,
      pending: 0,
      analyzing: 0,
      delivering: 0,
      executing: 0,
      completed: 0,
    },
    details: new Map(),
  });

  useEffect(() => {
    (async () => {
      const [organizationsCount, projectOverview] = (await Promise.all([
        (
          await fetch(
            new URL(
              'organizations/count',
              process.env.NEXT_PUBLIC_NATUREX_BACKEND,
            ),
            {
              method: 'GET',
              credentials: 'include',
            },
          )
        ).json(),
        (
          await fetch(
            new URL(
              'projects/overview',
              process.env.NEXT_PUBLIC_NATUREX_BACKEND,
            ),
            {
              method: 'GET',
              credentials: 'include',
            },
          )
        ).json(),
      ])) as [
        number,
        { theme: ProjectTheme; status: ProjectStatus; count: number }[],
      ];

      const details = new Map<string, number>();
      projectOverview.map((e) => {
        details.set(`${e.theme}:${e.status}`, e.count);
      });

      const obj = {
        organizationsCount: organizationsCount,
        projectsCount: {
          ...(Object.fromEntries(
            Object.entries(ProjectTheme).map(([_, v]) => [
              v,
              projectOverview
                .filter((e) => e.theme == v)
                .reduce((sum, e) => sum + e.count, 0),
            ]),
          ) as Record<ProjectTheme, number>),
          ...(Object.fromEntries(
            Object.entries(ProjectStatus).map(([_, v]) => [
              v,
              projectOverview
                .filter((e) => e.status == v)
                .reduce((sum, e) => sum + e.count, 0),
            ]),
          ) as Record<ProjectStatus, number>),
        },
        details: details,
      };

      setStats(obj);
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">관리자 홈</h1>
        <p className="text-[#6B7280]">
          NatureX 서비스 제공 현황을 실시간으로 확인하세요
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">
          서비스 제공 단계별 현황
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link href="/admin/projects?stage=pending">
            <Card className="p-5 bg-white border-[#E5E7EB] hover:border-gray-400 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-600 mb-1">
                {stats.projectsCount.pending}
              </div>
              <h3 className="text-sm font-medium text-[#111827]">대기</h3>
              <p className="text-xs text-[#6B7280] mt-1">프로젝트 생성됨</p>
            </Card>
          </Link>

          <Link href="/admin/projects?stage=analyzing">
            <Card className="p-5 bg-white border-[#E5E7EB] hover:border-blue-400 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.projectsCount.analyzing}
              </div>
              <h3 className="text-sm font-medium text-[#111827]">분석</h3>
              <p className="text-xs text-[#6B7280] mt-1">InvaLab 분석</p>
            </Card>
          </Link>

          <Link href="/admin/projects?stage=delivering">
            <Card className="p-5 bg-white border-[#E5E7EB] hover:border-green-400 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stats.projectsCount.delivering}
              </div>
              <h3 className="text-sm font-medium text-[#111827]">제공</h3>
              <p className="text-xs text-[#6B7280] mt-1">대시보드 활성</p>
            </Card>
          </Link>

          <Link href="/admin/projects?stage=executing">
            <Card className="p-5 bg-white border-[#E5E7EB] hover:border-purple-400 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {stats.projectsCount.completed}
              </div>
              <h3 className="text-sm font-medium text-[#111827]">실행</h3>
              <p className="text-xs text-[#6B7280] mt-1">현장 활동</p>
            </Card>
          </Link>

          <Link href="/admin/projects?stage=completed">
            <Card className="p-5 bg-white border-[#E5E7EB] hover:border-green-600 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Flag className="w-5 h-5 text-green-700" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">
                {stats.projectsCount.completed}
              </div>
              <h3 className="text-sm font-medium text-[#111827]">완료</h3>
              <p className="text-xs text-[#6B7280] mt-1">서비스 종료</p>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/admin/orgs">
          <Card className="p-6 bg-white border-[#E5E7EB] hover:border-[#118DFF] cursor-pointer transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#118DFF]/10 rounded-lg">
                <Building2 className="w-6 h-6 text-[#118DFF]" />
              </div>
              <span className="text-4xl font-bold text-[#111827]">
                {stats.organizationsCount}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[#111827] mb-1">
              전체 조직 수
            </h3>
            <p className="text-xs text-[#6B7280]">등록된 고객사</p>
          </Card>
        </Link>

        <Link href="/admin/projects">
          <Card className="p-6 bg-white border-[#E5E7EB] hover:border-[#118DFF] cursor-pointer transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#118DFF]/10 rounded-lg">
                <FolderKanban className="w-6 h-6 text-[#118DFF]" />
              </div>
              <span className="text-4xl font-bold text-[#111827]">
                {stats.projectsCount.efficiency +
                  stats.projectsCount.asset +
                  stats.projectsCount.biodiversity}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[#111827] mb-1">
              전체 프로젝트 수
            </h3>
            <p className="text-xs text-[#6B7280]">진행 중인 서비스</p>
          </Card>
        </Link>
      </div>

      <Card className="p-6 bg-white border-[#E5E7EB] mb-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#118DFF]" />
          <h2 className="text-xl font-bold text-[#111827]">
            테마별 서비스 제공 현황
          </h2>
        </div>
        <p className="text-sm text-[#6B7280] mb-6">
          각 서비스 테마의 프로젝트 진행 단계 요약
        </p>

        <div className="space-y-4">
          {[
            {
              key: 'efficiency' as const,
              label: '운영비 절감',
              bg: 'bg-blue-100 text-blue-700',
              total: stats.projectsCount.efficiency,
              ...(Object.fromEntries(
                Object.entries(ProjectStatus).map(([_, v]) => [
                  v,
                  stats.details.get(`${ProjectTheme.EFFICIENCY}:${v}`) ?? 0,
                ]),
              ) as Record<ProjectStatus, number>),
            },
            {
              key: 'asset' as const,
              label: '자산 가치 향상',
              bg: 'bg-green-100 text-green-700',
              total: stats.projectsCount.asset,
              ...(Object.fromEntries(
                Object.entries(ProjectStatus).map(([_, v]) => [
                  v,
                  stats.details.get(`${ProjectTheme.ASSET}:${v}`) ?? 0,
                ]),
              ) as Record<ProjectStatus, number>),
            },
            {
              key: 'biodiversity' as const,
              label: '생물다양성',
              bg: 'bg-purple-100 text-purple-700',
              total: stats.projectsCount.biodiversity,
              ...(Object.fromEntries(
                Object.entries(ProjectStatus).map(([_, v]) => [
                  v,
                  stats.details.get(`${ProjectTheme.BIODIVERSITY}:${v}`) ?? 0,
                ]),
              ) as Record<ProjectStatus, number>),
            },
          ].map((t) => (
            <div
              key={t.key}
              className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`px-3 py-1 rounded font-semibold text-sm ${t.bg}`}
                >
                  {t.label}
                </div>
                <span className="text-2xl font-bold text-[#111827]">
                  {t.total}개 프로젝트
                </span>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="text-[#6B7280] mb-1">대기</div>
                  <div className="text-lg font-semibold">{t.pending}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#6B7280] mb-1">분석</div>
                  <div className="text-lg font-semibold">{t.analyzing}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#6B7280] mb-1">제공</div>
                  <div className="text-lg font-semibold">{t.delivering}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#6B7280] mb-1">실행</div>
                  <div className="text-lg font-semibold">{t.executing}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#6B7280] mb-1">완료</div>
                  <div className="text-lg font-semibold">{t.completed}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
