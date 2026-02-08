"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export interface StepItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  kr: string;
  en: string;
  description: { kr: string; en: string };
}

export interface MultiStepSidebarTheme {
  /** Container background */
  containerBg: string;
  /** Container border */
  containerBorder: string;
  /** Header title text color */
  headerTitleColor: string;
  /** Header subtitle text color */
  headerSubtitleColor: string;
  /** Toggle button color */
  toggleButtonColor: string;
  /** Toggle button hover color */
  toggleButtonHoverColor: string;
  /** Active step background */
  activeStepBg: string;
  /** Hover step background */
  hoverStepBg: string;
  /** Active icon ring color */
  activeIconRing: string;
  /** Active icon background */
  activeIconBg: string;
  /** Active icon text color */
  activeIconText: string;
  /** Completed icon background */
  completedIconBg: string;
  /** Completed icon text color */
  completedIconText: string;
  /** Inactive icon background */
  inactiveIconBg: string;
  /** Inactive icon text color */
  inactiveIconText: string;
  /** Active step label text color */
  activeStepText: string;
  /** Inactive step label text color */
  inactiveStepText: string;
  /** Step number text color */
  stepNumberText: string;
  /** Description text color */
  descriptionText: string;
}

interface SharedMultiStepSidebarProps<T extends string> {
  /** Current active step */
  currentStep: T;
  /** Callback when step changes */
  onStepChange: (step: T) => void;
  /** Current language */
  language: "kr" | "en";
  /** Steps configuration */
  steps: StepItem[];
  /** Header title */
  title: { kr: string; en: string };
  /** Header subtitle */
  subtitle?: { kr: string; en: string };
  /** Theme configuration */
  theme: MultiStepSidebarTheme;
}

/**
 * SharedMultiStepSidebar - A presentation component for multi-step sidebar layout
 * This component handles the UI structure and styling for step-based navigation.
 */
export function SharedMultiStepSidebar<T extends string>({
  currentStep,
  onStepChange,
  language,
  steps,
  title,
  subtitle,
  theme,
}: SharedMultiStepSidebarProps<T>) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen flex flex-col transition-all duration-300",
        theme.containerBg,
        theme.containerBorder,
        collapsed ? "w-20" : "w-[260px]",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "p-4 border-b flex items-center justify-between",
          theme.containerBorder.replace("border-r", ""),
        )}
      >
        {!collapsed && (
          <div>
            <h2 className={cn("text-sm font-semibold", theme.headerTitleColor)}>
              {language === "kr" ? title.kr : title.en}
            </h2>
            {subtitle && (
              <p className={cn("text-xs", theme.headerSubtitleColor)}>
                {language === "kr" ? subtitle.kr : subtitle.en}
              </p>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "h-8 w-8 p-0",
            theme.toggleButtonColor,
            theme.toggleButtonHoverColor,
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Step List */}
      <nav className="flex-1 p-3 space-y-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted =
            steps.findIndex((s) => s.id === currentStep) > index;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id as T)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 text-left h-20",
                isActive && theme.activeStepBg,
                !isActive && theme.hoverStepBg,
                collapsed && "justify-center",
              )}
            >
              {/* Step Number & Icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isActive &&
                    cn(
                      theme.activeIconBg,
                      theme.activeIconText,
                      theme.activeIconRing,
                    ),
                  isCompleted &&
                    !isActive &&
                    cn(theme.completedIconBg, theme.completedIconText),
                  !isActive &&
                    !isCompleted &&
                    cn(theme.inactiveIconBg, theme.inactiveIconText),
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Step Info */}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        theme.stepNumberText,
                      )}
                    >
                      STEP {index + 1}
                    </span>
                  </div>
                  <h3
                    className={cn(
                      "font-semibold text-sm mt-1",
                      isActive ? theme.activeStepText : theme.inactiveStepText,
                    )}
                  >
                    {language === "kr" ? step.kr : step.en}
                  </h3>
                  <p className={cn("text-xs mt-0.5", theme.descriptionText)}>
                    {language === "kr"
                      ? step.description.kr
                      : step.description.en}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// Pre-defined themes for different modules
export const efficiencyTheme: MultiStepSidebarTheme = {
  containerBg: "bg-gradient-to-b from-blue-50 to-indigo-50 shadow-lg",
  containerBorder: "border-r border-blue-200",
  headerTitleColor:
    "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
  headerSubtitleColor: "text-blue-600",
  toggleButtonColor: "text-blue-500",
  toggleButtonHoverColor: "hover:text-blue-700 hover:bg-blue-100",
  activeStepBg:
    "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md border-0 text-white",
  hoverStepBg: "hover:bg-white/60 hover:shadow-sm",
  activeIconRing: "ring-2 ring-white/50",
  activeIconBg: "bg-white",
  activeIconText: "text-blue-600",
  completedIconBg: "bg-blue-100",
  completedIconText: "text-blue-600",
  inactiveIconBg: "bg-white/80",
  inactiveIconText: "text-gray-500",
  activeStepText: "text-white",
  inactiveStepText: "text-gray-900",
  stepNumberText: "text-white/90",
  descriptionText: "text-white/80",
};

export const assetsTheme: MultiStepSidebarTheme = {
  containerBg: "bg-slate-900/90",
  containerBorder: "border-r border-slate-800",
  headerTitleColor: "text-slate-200",
  headerSubtitleColor: "text-slate-400",
  toggleButtonColor: "text-slate-400",
  toggleButtonHoverColor: "hover:text-slate-200",
  activeStepBg: "bg-slate-800 shadow-lg",
  hoverStepBg: "hover:bg-slate-800/50",
  activeIconRing: "ring-2 ring-emerald-500/50",
  activeIconBg: "bg-emerald-500/20",
  activeIconText: "text-emerald-400",
  completedIconBg: "bg-emerald-500/10",
  completedIconText: "text-emerald-500",
  inactiveIconBg: "bg-slate-800",
  inactiveIconText: "text-slate-400",
  activeStepText: "text-emerald-400",
  inactiveStepText: "text-slate-200",
  stepNumberText: "text-slate-400",
  descriptionText: "text-slate-400",
};

export const reportingTheme: MultiStepSidebarTheme = {
  containerBg: "bg-slate-900/90",
  containerBorder: "border-r border-slate-800",
  headerTitleColor: "text-slate-200",
  headerSubtitleColor: "text-slate-400",
  toggleButtonColor: "text-slate-400",
  toggleButtonHoverColor: "hover:text-slate-200",
  activeStepBg: "bg-slate-800 shadow-lg",
  hoverStepBg: "hover:bg-slate-800/50",
  activeIconRing: "ring-2 ring-blue-500/50",
  activeIconBg: "bg-blue-500/20",
  activeIconText: "text-blue-400",
  completedIconBg: "bg-blue-500/10",
  completedIconText: "text-blue-500",
  inactiveIconBg: "bg-slate-800",
  inactiveIconText: "text-slate-400",
  activeStepText: "text-blue-400",
  inactiveStepText: "text-slate-200",
  stepNumberText: "text-slate-400",
  descriptionText: "text-slate-400",
};

export const riskTheme: MultiStepSidebarTheme = {
  containerBg: "bg-slate-900/90",
  containerBorder: "border-r border-slate-800",
  headerTitleColor: "text-slate-200",
  headerSubtitleColor: "text-slate-400",
  toggleButtonColor: "text-slate-400",
  toggleButtonHoverColor: "hover:text-slate-200",
  activeStepBg: "bg-slate-800 shadow-lg",
  hoverStepBg: "hover:bg-slate-800/50",
  activeIconRing: "ring-2 ring-red-500/50",
  activeIconBg: "bg-red-500/20",
  activeIconText: "text-red-400",
  completedIconBg: "bg-red-500/10",
  completedIconText: "text-red-500",
  inactiveIconBg: "bg-slate-800",
  inactiveIconText: "text-slate-400",
  activeStepText: "text-red-400",
  inactiveStepText: "text-slate-200",
  stepNumberText: "text-slate-400",
  descriptionText: "text-slate-400",
};
