import type React from "react"
import { GlobalSidebar } from "@/components/global-sidebar"
import { GlobalHeader } from "@/components/global-header"
import { ImpersonationBanner } from "@/components/impersonation-banner"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <ImpersonationBanner />

      <GlobalHeader />

      <div className="flex pt-14 w-full h-full">
        <GlobalSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
