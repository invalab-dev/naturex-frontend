"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  fallbackRoute?: string
  language?: "ko" | "en"
}

export function BackButton({ fallbackRoute = "/", language = "ko" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Try to go back in history
    if (window.history.length > 1) {
      router.back()
    } else {
      // No history, use fallback route
      router.push(fallbackRoute)
    }
  }

  const label = language === "ko" ? "뒤로가기" : "Back"

  return (
    <Button
      onClick={handleBack}
      variant="ghost"
      size="sm"
      className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm flex items-center gap-1.5 hover:bg-slate-800 hover:border-slate-600"
    >
      <ArrowLeft size={16} />
      {label}
    </Button>
  )
}
