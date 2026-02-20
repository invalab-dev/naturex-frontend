'use client';

import React, { useEffect, useRef } from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Building2, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Organization,
  OrganizationSize,
  OrganizationStatus,
  OrganizationType,
} from '@/lib/data-type';
import { clsx } from 'clsx';
import debounce, { DebouncedFunction } from 'debounce';

export default function NewOrgPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    type: OrganizationType;
    size: OrganizationSize;
    contact: string;
    website: string;
  }>({
    name: '',
    type: OrganizationType.COMPANY,
    size: OrganizationSize.SOLO,
    contact: '',
    website: '',
  });
  const [existenceBefore, setExistenceBefore] = useState<boolean | null>(null);
  const [existenceCheckLoading, setExistenceCheckLoading] =
    useState<boolean>(false);
  const orgNameDebouncer = useRef<DebouncedFunction<
    (_: string) => void
  > | null>(null);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  useEffect(() => {
    orgNameDebouncer.current = debounce((orgName: string) => {
      if (orgName.length == 0) {
        setExistenceBefore(null);
        return;
      }

      setExistenceCheckLoading(true);
      (async () => {
        const res = await fetch(
          new URL(
            `organizations/existence?name=${orgName}`,
            process.env.NEXT_PUBLIC_NATUREX_BACKEND,
          ),
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        if (!res.ok) {
          console.error('existence call failed');
          return;
        }
        const json = await res.json();
        setExistenceBefore(json.existence);
        setExistenceCheckLoading(false);
      })();
    }, 500);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setCreateLoading(true);
    await fetch(
      new URL('organizations', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    setCreateLoading(false);

    router.push('/admin/orgs');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-white border-[#E5E7EB] shadow-lg">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/orgs">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                돌아가기
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#118DFF]/10 rounded-lg">
              <Building2 className="w-6 h-6 text-[#118DFF]" />
            </div>
            <h1 className="text-3xl font-bold text-[#111827]">새 조직 생성</h1>
          </div>
          <p className="text-[#6B7280] mb-8">
            조직은 프로젝트와 서비스 제공의 기본 단위입니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  조직명 <span className="text-red-500">*</span>
                </Label>
                <div className={'flex flex-row'}>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData({ ...formData, name: newName });
                      orgNameDebouncer.current?.(newName);
                    }}
                    placeholder="예: 서울시청"
                    required
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
                  />
                  <div className={'ml-2 w-14 flex items-center justify-center'}>
                    <span>
                      {existenceCheckLoading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : existenceBefore == null ? (
                        <span className={'text-sm font-semibold'}>확인</span>
                      ) : existenceBefore ? (
                        <span className={'text-sm font-semibold text-red-700'}>
                          불가능
                        </span>
                      ) : (
                        <span
                          className={'text-sm font-semibold text-green-700'}
                        >
                          가능
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgId" className="text-sm font-medium">
                  업종 <span className="text-red-500">*</span>
                </Label>
                <div className="space-x-2">
                  {Object.values(OrganizationType).map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      className={clsx(
                        'text-xs rounded-lg border border-[#E5E7EB]',
                        formData.type == type
                          ? 'border-3 border-[#118DFF]'
                          : 'text-[#4B5563] hover:bg-[#F5F7FB] hover:text-[#118DFF]',
                      )}
                      onClick={() => {
                        setFormData((prevState) => {
                          return {
                            ...prevState,
                            type,
                          };
                        });
                      }}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  규모 <span className="text-red-500">*</span>
                </Label>
                <div className="space-x-2">
                  {Object.values(OrganizationSize).map((size) => (
                    <Button
                      key={size}
                      size="sm"
                      className={clsx(
                        'text-xs rounded-lg border border-[#E5E7EB]',
                        formData.size == size
                          ? 'border-3 border-[#118DFF]'
                          : 'text-[#4B5563] hover:bg-[#F5F7FB] hover:text-[#118DFF]',
                      )}
                      onClick={() => {
                        setFormData((prevState) => {
                          return {
                            ...prevState,
                            size,
                          };
                        });
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium">
                    담당자
                  </Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    placeholder="예: 홍길동"
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    웹사이트
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="website@example.com"
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                disabled={createLoading}
                type="submit"
                className="bg-[#118DFF] text-white hover:bg-[#118DFF] hover:text-white w-16"
              >
                {createLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>생성</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
