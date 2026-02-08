"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  LogOut,
  Home,
  Building2,
  Users,
  FolderKanban,
} from "lucide-react";
import Link from "next/link";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-[#118DFF]" />
              <span className="text-xl font-bold text-[#111827]">
                NatureX Admin
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />홈
                </Button>
              </Link>
              <Link href="/admin/orgs">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  조직 관리
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Users className="w-4 h-4" />
                  사용자 관리
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm" className="gap-2">
                  <FolderKanban className="w-4 h-4" />
                  프로젝트 관리
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#111827]">
                {user?.name}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-[#118DFF]/10 text-[#118DFF] rounded">
                ADMIN
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
