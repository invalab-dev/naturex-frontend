'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createUser,
  deleteUser,
  getOrganizations,
  getUsers,
} from '@/lib/data-service';
import type { Organization, User } from '@/lib/data-type';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    organizationId: '',
    roles: 'USER',
  });

  const reload = async () => {
    setLoading(true);
    try {
      const [u, o] = await Promise.all([getUsers(), getOrganizations()]);
      setUsers(u);
      setOrgs(o);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const submit = async () => {
    if (!form.email || !form.password) {
      alert('email/password를 입력하세요');
      return;
    }
    await createUser({
      email: form.email,
      password: form.password,
      name: form.name || null,
      organizationId: form.organizationId || null,
      roles: [form.roles as any],
      language: 'ko',
      timezone: 'Asia/Seoul',
    });
    setForm({
      email: '',
      password: '',
      name: '',
      organizationId: '',
      roles: 'USER',
    });
    await reload();
  };

  const remove = async (id: string) => {
    if (!confirm('정말 삭제할까요?')) return;
    await deleteUser(id);
    await reload();
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">사용자 관리</h1>
        <p className="text-sm text-[#6B7280]">사용자 조회/생성/삭제</p>
      </div>

      <Card className="p-4 bg-white border-[#E5E7EB] space-y-2 mb-6">
        <div className="font-semibold">사용자 생성</div>
        <Input
          placeholder="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          placeholder="name (optional)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder={`organizationId (optional, e.g. ${orgs.at(0)?.id ?? ''})`}
          value={form.organizationId}
          onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
        />
        <div className="text-xs text-[#6B7280]">
          조직 목록: {orgs.map((o) => `${o.id}:${o.name}`).join(', ') || '-'}
        </div>
        <Input
          placeholder="roles (ADMIN or USER)"
          value={form.roles}
          onChange={(e) => setForm({ ...form, roles: e.target.value })}
        />
        <Button onClick={submit} className="bg-[#118DFF] text-white">
          생성
        </Button>
      </Card>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id} className="p-4 bg-white border-[#E5E7EB]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-[#111827]">{u.email}</div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    id={u.id} · roles={u.roles.join(',')} · org=
                    {u.organizationId ?? '-'}
                  </div>
                </div>
                <Button variant="outline" onClick={() => remove(u.id)}>
                  삭제
                </Button>
              </div>
            </Card>
          ))}
          {users.length === 0 && (
            <Card className="p-8 bg-white border-[#E5E7EB] text-center text-sm text-[#6B7280]">
              사용자가 없습니다.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
