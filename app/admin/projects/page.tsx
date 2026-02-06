'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  deleteProject,
  getOrganizations,
  getProjectsByOrganization,
} from '@/lib/data-service';
import type { Organization, Project } from '@/lib/data-type';

export default function AdminProjectsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterOrgId, setFilterOrgId] = useState<string>('');
  const [q, setQ] = useState('');

  const reload = async () => {
    setLoading(true);
    try {
      const o = await getOrganizations();
      setOrgs(o);
      const orgId = filterOrgId || o.at(0)?.id || '';
      if (orgId) {
        setProjects(await getProjectsByOrganization(orgId));
      } else {
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!filterOrgId) return;
    (async () => {
      setProjects(await getProjectsByOrganization(filterOrgId));
    })();
  }, [filterOrgId]);

  const filtered = useMemo(() => {
    if (!q) return projects;
    const qq = q.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(qq) ||
        (p.location ?? '').toLowerCase().includes(qq),
    );
  }, [projects, q]);

  const remove = async (id: string) => {
    if (!confirm('정말 삭제할까요?')) return;
    await deleteProject(id);
    await reload();
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">프로젝트 관리</h1>
          <p className="text-sm text-[#6B7280]">
            조직별 프로젝트를 조회/삭제합니다.
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-[#118DFF] text-white">새 프로젝트</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="조직 ID 선택 (예: 1)"
          value={filterOrgId}
          onChange={(e) => setFilterOrgId(e.target.value)}
        />
        <Input
          placeholder="검색 (이름/위치)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="text-xs text-[#6B7280] mb-4">
        현재 조직 목록: {orgs.map((o) => `${o.id}:${o.name}`).join(', ') || '-'}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id} className="p-4 bg-white border-[#E5E7EB]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-[#111827]">{p.name}</div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    theme={p.theme} · status={p.currentStatus}
                    {p.location ? ` · ${p.location}` : ''}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => remove(p.id)}>
                    삭제
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="p-8 bg-white border-[#E5E7EB] text-center text-sm text-[#6B7280]">
              프로젝트가 없습니다.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
