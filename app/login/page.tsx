"use client"
import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Leaf, User, Building2 } from "lucide-react"




function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const redirect = searchParams.get("redirect") || "/app"

  useEffect(() => {
    if (user) {
      // Role-aware redirect
      if (user.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace(redirect)
      }
    }
  }, [user, router, redirect])

  const handleAdminLogin = () => {
    const authData = {
      userId: "admin-001",
      name: "Dr. Shin",
      role: "admin" as const,
      email: "admin@naturex.test",
      orgId: null,
      isMock: true,
    }
    localStorage.setItem("naturex_auth", JSON.stringify(authData))
    window.location.href = "/admin" // Always go to /admin for admin
  }

  const handleCustomerLogin = () => {
    const authData = {
      userId: "customer-001",
      name: "Customer 1",
      role: "customer" as const,
      email: "customer1@naturex.test",
      orgId: "org-customer-001",
      isMock: true,
    }
    localStorage.setItem("naturex_auth", JSON.stringify(authData))
    window.location.href = "/app" // Always go to /app for customer
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold text-[#111827]">NatureX</span>
          </div>
          <h1 className="text-xl font-bold text-[#111827] mb-2">로그인</h1>
          <p className="text-sm text-[#6B7280]">자연자산 관리 플랫폼에 로그인하세요</p>
        </div>

        {/* Sample Account Cards Section */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#374151] mb-4 text-center">샘플 계정</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
              {/* Top row: title + login button */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#118DFF]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#118DFF]" />
                  </div>
                  <h4 className="text-base font-semibold text-[#111827]">관리자 샘플</h4>
                </div>
                <Button
                  onClick={handleAdminLogin}
                  className="h-9 px-4 bg-[#118DFF] hover:bg-[#0D6FCC] text-white text-sm font-medium rounded-lg"
                >
                  로그인
                </Button>
              </div>

              {/* Credentials */}
              <div className="space-y-2 text-sm text-[#6B7280]">
                <div className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-[#9CA3AF]">이메일</span>
                  </div>
                  <div className="font-mono text-xs text-[#374151]">admin@naturex.test</div>
                </div>
                <div className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-[#9CA3AF]">비밀번호</span>
                  </div>
                  <div className="font-mono text-xs text-[#374151]">Admin1234!</div>
                </div>
                <div className="text-xs text-[#9CA3AF] pt-1">관리자는 모든 프로젝트와 고객을 관리할 수 있습니다.</div>
              </div>
            </div>

            {/* Customer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
              {/* Top row: title + login button */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-base font-semibold text-[#111827]">고객 샘플</h4>
                </div>
                <Button
                  onClick={handleCustomerLogin}
                  variant="outline"
                  className="h-9 px-4 border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] hover:border-[#118DFF] text-sm font-medium rounded-lg bg-transparent"
                >
                  로그인
                </Button>
              </div>

              {/* Credentials */}
              <div className="space-y-2 text-sm text-[#6B7280]">
                <div className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-[#9CA3AF]">이메일</span>
                  </div>
                  <div className="font-mono text-xs text-[#374151]">customer1@naturex.test</div>
                </div>
                <div className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-[#9CA3AF]">비밀번호</span>
                  </div>
                  <div className="font-mono text-xs text-[#374151]">Customer1234!</div>
                </div>
                <div className="text-xs text-[#9CA3AF] pt-1">고객은 자신의 조직에 속한 프로젝트만 볼 수 있습니다.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-xs text-[#9CA3AF]">위 샘플 계정 중 하나를 선택하여 플랫폼을 체험해보세요.</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
