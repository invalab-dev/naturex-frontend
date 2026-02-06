'use client';

// Widget admin is treated as removed/dead feature for Milestone 1.

import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function AdminWidgetsPlaceholder() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <h1 className="text-xl font-bold text-[#111827] mb-2">위젯</h1>
        <p className="text-sm text-[#6B7280]">
          이 기능은 현재 범위(Milestone 1)에서 제외되었습니다.
        </p>
        <div className="mt-4">
          <Link className="text-sm text-[#118DFF]" href="/admin">
            ← 관리자 홈
          </Link>
        </div>
      </Card>
    </div>
  );
}
