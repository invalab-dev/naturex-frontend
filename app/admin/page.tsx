'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getAdminOverviewStats } from '@/lib/data-service';

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    orgsCount: number;
    projectsCount: number;
    byTheme: Record<string, number>;
    byStatus: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await getAdminOverviewStats();
        setStats(s);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">관리자 홈</h1>
        <p className="text-[#6B7280]">서비스 제공 현황을 확인하세요.</p>
      </div>

      {!stats ? (
        <div className="text-sm text-red-600">통계를 불러오지 못했습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-white border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280]">조직 수</div>
            <div className="text-2xl font-bold text-[#111827]">
              {stats.orgsCount}
            </div>
            <div className="mt-4">
              <Link className="text-sm text-[#118DFF]" href="/admin/orgs">
                조직 관리 →
              </Link>
            </div>
          </Card>
          <Card className="p-6 bg-white border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280]">프로젝트 수</div>
            <div className="text-2xl font-bold text-[#111827]">
              {stats.projectsCount}
            </div>
            <div className="mt-4">
              <Link className="text-sm text-[#118DFF]" href="/admin/projects">
                프로젝트 관리 →
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
