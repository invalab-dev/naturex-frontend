"use client"

import type React from "react"
import { useRouter } from "next/navigation"

export function NatureXHeader({ children }: { children?: React.ReactNode }) {
  const router = useRouter()

  return (
    <header className="border-b border-blue-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          <div className="flex items-center gap-1.5">
            <div className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              NATURE
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              X
            </div>
          </div>
        </div>
        {children}
      </div>
    </header>
  )
}
