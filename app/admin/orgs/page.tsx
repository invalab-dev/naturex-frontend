'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
} from '@/lib/data-service';
import type { Organization } from '@/lib/data-type';

export default function AdminOrgsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  const [editing, setEditing] = useState<Organization | null>(null);
  const [form, setForm] = useState({
    name: '',
    type: 'COMPANY' as Organization['type'],
    size: 'SMALL' as Organization['size'],
    website: '',
    status: 'ACTIVE' as Organization['status'],
  });

  async function reload() {
    setLoading(true);
    try {
      setOrgs(await getOrganizations());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return orgs;
    const qq = q.toLowerCase();
    return orgs.filter((o) => o.name.toLowerCase().includes(qq));
  }, [orgs, q]);

  const startCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      type: 'COMPANY',
      size: 'SMALL',
      website: '',
      status: 'ACTIVE',
    });
  };

  const startEdit = (o: Organization) => {
    setEditing(o);
    setForm({
      name: o.name,
      type: o.type,
      size: o.size,
      website: o.website ?? '',
      status: o.status,
    });
  };

  const submit = async () => {
    if (!form.name.trim()) {
      alert('조직명을 입력하세요');
      return;
    }
    if (editing) {
      await updateOrganization({
        id: editing.id,
        name: form.name,
        type: form.type,
        size: form.size,
        website: form.website || null,
        status: form.status,
      });
    } else {
      await createOrganization({
        name: form.name,
        type: form.type,
        size: form.size,
        website: form.website || null,
        status: form.status,
      });
    }
    await reload();
  };

  const remove = async (id: string) => {
    if (!confirm('정말 삭제할까요?')) return;
    await deleteOrganization(id);
    await reload();
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">조직 관리</h1>
          <p className="text-sm text-[#6B7280]">
            조직(organizations)을 생성/수정/삭제합니다.
          </p>
        </div>
        <Button onClick={startCreate} className="bg-[#118DFF] text-white">
          새 조직
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="조직명 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div>Loading...</div>
        ) : (
          filtered.map((o) => (
            <Card key={o.id} className="p-4 bg-white border-[#E5E7EB]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-[#111827]">{o.name}</div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    type={o.type} · size={o.size} · status={o.status}
                    {o.website ? ` · ${o.website}` : ''}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => startEdit(o)}>
                    수정
                  </Button>
                  <Button variant="outline" onClick={() => remove(o.id)}>
                    삭제
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">
          {editing ? '조직 수정' : '조직 생성'}
        </h2>
        <Card className="p-4 bg-white border-[#E5E7EB] space-y-3">
          <Input
            placeholder="조직명"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="flex gap-2">
            <Input
              placeholder="type (COMPANY|PUBLIC|NGO)"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as any })
              }
            />
            <Input
              placeholder="size (SOLO|SMALL|MEDIUM|ENTERPRISE)"
              value={form.size}
              onChange={(e) =>
                setForm({ ...form, size: e.target.value as any })
              }
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="website (optional)"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
            <Input
              placeholder="status (ACTIVE|INACTIVE|ARCHIVED)"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as any })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={submit} className="bg-[#118DFF] text-white">
              저장
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null);
                startCreate();
              }}
            >
              초기화
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
