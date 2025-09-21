"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiButtonProps {
  children: React.ReactNode
  onClick: () => Promise<void>
  maxClicks: number
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

export function ApiButton({
                            children,
                            onClick,
                            maxClicks,
                            className,
                            variant = "default",
                            size = "default",
                            disabled = false,
                          }: ApiButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const isMaxReached = clickCount >= maxClicks
  const isDisabled = disabled || isLoading || isMaxReached

  const handleClick = async () => {
    if (isMaxReached) {
      alert(`이 버튼은 최대 ${maxClicks}번까지만 클릭할 수 있습니다.`)
      return
    }

    if (isLoading) return

    try {
      setIsLoading(true)
      await onClick()
      setClickCount((prev) => prev + 1)
    } catch (error) {
      console.error("API 호출 중 오류가 발생했습니다:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className={cn("relative", isMaxReached && "opacity-50 cursor-not-allowed", className)}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </Button>
      <div className="text-xs text-muted-foreground">
        {clickCount}/{maxClicks} 클릭
        {isMaxReached && <span className="text-destructive ml-2">• 제한 도달</span>}
      </div>
    </div>
  )
}
