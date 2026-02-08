"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FolderKanban, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  SharedSidebar,
  SidebarMenuItem,
} from "@/components/sidebar/shared-sidebar";

export function GlobalSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => {
    if (pathname === "/app/projects/new") {
      return false;
    }

    if (path === "/app") {
      return pathname === "/app";
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const headerContent = (
    <Link href="/" className="flex items-center gap-2 p-6">
      <div className="text-xl font-bold text-[#118DFF]">NatureX</div>
    </Link>
  );

  const navigationContent = (
    <>
      <Link href="/app">
        <SidebarMenuItem
          active={isActive("/app")}
          icon={<Home className="w-5 h-5" />}
          label="홈"
        />
      </Link>

      <Link href="/app/projects">
        <SidebarMenuItem
          active={isActive("/app/projects")}
          icon={<FolderKanban className="w-5 h-5" />}
          label="프로젝트"
        />
      </Link>

      <Link href="/app/settings">
        <SidebarMenuItem
          active={isActive("/app/settings")}
          icon={<Settings className="w-5 h-5" />}
          label="설정"
        />
      </Link>
    </>
  );

  const footerContent = (
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-[#118DFF] flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">
            {user?.name || "사용자"}
          </div>
          <div className="text-xs text-slate-500 truncate">{user?.email}</div>
        </div>
      </div>
      <button
        onClick={handleLogout}
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
    />
  );
}
