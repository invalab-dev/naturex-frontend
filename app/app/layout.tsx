import React from 'react';
import { UserSidebar } from '@/components/user-sidebar';
import { UserHeader } from '@/components/user-header';
import { AuthGuard } from '@/lib/auth-guard';
import { UserRole } from '@/lib/data-type';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <UserHeader />
      <div className="flex pt-14 w-full h-full">
        <UserSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AuthGuard acceptUserRoles={[UserRole.USER]}>
            <main className="flex-1 overflow-auto">{children}</main>
          </AuthGuard>
        </div>
      </div>
    </div>
  );
}
