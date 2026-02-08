"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, FolderKanban } from "lucide-react";
import {
  SharedSidebar,
  SidebarMenuItem,
} from "@/components/sidebar/shared-sidebar";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "홈", icon: Home },
    { href: "/admin/orgs", label: "조직관리", icon: Building2 },
    { href: "/admin/projects", label: "프로젝트 관리", icon: FolderKanban },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
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
    <div className="px-6 py-4 text-xs text-[#9CA3AF]">v1.0.0 · InvaLab Co.</div>
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
