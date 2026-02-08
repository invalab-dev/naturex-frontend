"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  endImpersonation,
  getImpersonationSession,
  type ImpersonationSession,
} from "@/lib/impersonation";
import { getOrganizationById } from "@/lib/local-data-service";

export function ImpersonationBanner() {
  const router = useRouter();
  const [session, setSession] = useState<ImpersonationSession | null>(null);
  const [orgName, setOrgName] = useState<string>("");

  useEffect(() => {
    const impersonationSession = getImpersonationSession();
    setSession(impersonationSession);

    if (impersonationSession) {
      const org = getOrganizationById(impersonationSession.impersonatedOrgId);
      setOrgName(org?.name || impersonationSession.impersonatedOrgId);
    }
  }, []);

  if (!session) return null;

  const handleExitImpersonation = () => {
    endImpersonation();
    router.push("/admin");
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <div className="flex items-center gap-2">
          <span className="font-semibold">관리자 미리보기 모드</span>
          <span className="text-sm opacity-90">
            현재 {orgName} 고객 화면을 보고 있습니다
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-orange-600 gap-2"
        onClick={handleExitImpersonation}
      >
        <X className="w-4 h-4" />
        관리자 화면으로 돌아가기
      </Button>
    </div>
  );
}
