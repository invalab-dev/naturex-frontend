'use client';

import { useAuth } from '@/lib/auth-context';
import React, { useEffect, useState } from 'react';
import { UserRole } from '@/lib/data-type';
import { useRouter } from 'next/navigation';

export function AuthGuard({
  children,
  acceptUserRoles,
}: {
  children: React.ReactNode;
  acceptUserRoles: UserRole[];
}) {
  const { user, isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (acceptUserRoles.some((r) => user.roles.includes(r))) {
      setIsLoading(false);
    } else {
      router.replace(`/login`);
    }
  }, [user]);

  return isLoading ? (
    <div className="flex items-center justify-center w-full h-full bg-[#F5F7FB]">
      <div className="text-[#6B7280]">Loading...</div>
    </div>
  ) : (
    children
  );
}
