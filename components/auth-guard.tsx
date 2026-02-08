'use client';

import { useAuth } from '@/lib/auth-context';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {UserRole} from "@/lib/data-service";

export function AuthGuard({
                            children,
                            acceptUserRoles,
                          }: {
  children: React.ReactNode;
  acceptUserRoles: UserRole[];
}) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
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
