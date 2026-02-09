import type React from 'react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminTopBar } from '@/components/admin-topbar';
import { AuthGuard } from '@/lib/auth-guard';
import { UserRole } from '@/lib/data-type';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard acceptUserRoles={[UserRole.ADMIN]}>
      <div className="min-h-screen bg-[#F5F7FB]">
        <AdminSidebar />
        <div className="ml-64">
          <AdminTopBar />
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
