'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createProject,
  getOrganizations,
  getProjectThemeMeta,
} from '@/lib/data-service';
import { useAuth } from '@/lib/auth-context';
import type { Organization, Project } from '@/lib/data-type';

export default function AdminNewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [themes, setThemes] = useState<
    Array<{ value: Project['theme']; label: string; description: string }>
  >([]);

  const [form, setForm] = useState({
    organizationId: '',
    name: '',
    location: '',
    description: '',
    theme: '' as Project['theme'] | '',
  });

  useEffect(() => {
    (async () => {
      setOrgs(await getOrganizations());
      const meta = await getProjectThemeMeta();
      setThemes(
        meta.map((m) => ({
          value: m.value,
          label: m.label,
          description: m.description,
        })),
      );
    })();
  }, []);

  const submit = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    if (!form.organizationId || !form.name || !form.theme) {
      alert('조직/프로젝트명/테마를 입력하세요.');
      return;
    }

    const created = await createProject({
      name: form.name,
      description: form.description || null,
      location: form.location || null,
      theme: form.theme as Project['theme'],
      organizationId: form.organizationId,
      managerId: user.id,
      status: 'REGISTERED',
      changedBy: user.id,
    });

    router.push('/admin/projects');
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <div className="mb-4">
        <Link href="/admin/projects" className="text-sm text-[#118DFF]">
          ← 프로젝트 목록
        </Link>
      </div>
      <Card className="p-6 bg-white border-[#E5E7EB] space-y-3">
        <h1 className="text-xl font-bold text-[#111827]">새 프로젝트 생성</h1>

        <Input
          placeholder={`조직 ID (예: ${orgs.at(0)?.id ?? ''})`}
          value={form.organizationId}
          onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
        />
        <div className="text-xs text-[#6B7280]">
          조직 목록: {orgs.map((o) => `${o.id}:${o.name}`).join(', ') || '-'}
        </div>

        <Input
          placeholder="프로젝트명"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="위치"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <Input
          placeholder="설명(옵션)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input
          placeholder="테마(운영비 절감|자산 가치 향상|생물 다양성)"
          value={form.theme}
          onChange={(e) => setForm({ ...form, theme: e.target.value as any })}
        />
        <div className="text-xs text-[#6B7280]">
          추천 테마: {themes.map((t) => t.value).join(' / ') || '-'}
        </div>

        <Button onClick={submit} className="bg-[#118DFF] text-white">
          생성
        </Button>
      </Card>
    </div>
  );
}
