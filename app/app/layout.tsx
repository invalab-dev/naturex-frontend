import React from 'react';
import { GlobalSidebar } from '@/components/global-sidebar';
import { GlobalHeader } from '@/components/global-header';
import { AuthGuard } from '@/components/auth-guard';
import { UserRole } from '@/lib/data-type';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <GlobalHeader />
      <div className="flex pt-14 w-full h-full">
        <GlobalSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AuthGuard acceptUserRoles={[UserRole.USER]}>
            <main className="flex-1 overflow-auto">{children}</main>
          </AuthGuard>
        </div>
      </div>
    </div>
  );
}
