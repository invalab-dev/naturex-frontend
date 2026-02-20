'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, FolderKanban, User, LogOut } from 'lucide-react';
import {
  SharedSidebar,
  SidebarMenuItem,
} from '@/components/sidebar/shared-sidebar';
import { useAuth } from '@/lib/auth-context';

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { href: '/admin', label: '홈', icon: Home },
    { href: '/admin/orgs', label: '조직 관리', icon: Building2 },
    { href: '/admin/projects', label: '프로젝트 관리', icon: FolderKanban },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  const headerContent = (
    <div className="px-6 py-6">
      <h1 className="text-xl font-bold text-[#111827]">NatureX Admin</h1>
      <p className="text-xs text-[#6B7280] mt-1">고객 프로젝트 관리 콘솔</p>
    </div>
  );

  const navigationContent = (
    <div className="py-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link key={item.href} href={item.href}>
            <SidebarMenuItem
              active={active}
              icon={<Icon className="w-5 h-5" />}
              label={item.label}
              variant="admin"
            />
          </Link>
        );
      })}
    </div>
  );

  const footerContent = (
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-[#118DFF] flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">
            {user!.name}
          </div>
          <div className="text-xs text-slate-500 truncate">{user?.email}</div>
        </div>
      </div>
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  );

  return (
    <SharedSidebar
      header={headerContent}
      navigation={navigationContent}
      footer={footerContent}
      fixed
    />
  );
}
