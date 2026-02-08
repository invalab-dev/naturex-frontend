import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SharedSidebarProps {
  /** Header section (logo, title, etc.) */
  header: ReactNode;
  /** Navigation section */
  navigation: ReactNode;
  /** Footer section */
  footer: ReactNode;
  /** Additional className for the container */
  className?: string;
  /** Whether the sidebar should be fixed positioned */
  fixed?: boolean;
}

/**
 * SharedSidebar - A presentation component for sidebar layout
 * This component only handles the UI structure and styling.
 * All logic (routing, auth, state) should be handled by the parent component.
 */
export function SharedSidebar({
  header,
  navigation,
  footer,
  className,
  fixed = false,
}: SharedSidebarProps) {
  return (
    <div
      className={cn(
        "w-64 bg-white border-r border-[#E5E7EB] h-screen flex flex-col",
        fixed && "fixed left-0 top-0",
        className,
      )}
    >
      {/* Header Section */}
      <div className="border-b border-[#E5E7EB]">{header}</div>

      {/* Navigation Section */}
      <nav className="flex-1 p-3 space-y-1">{navigation}</nav>

      {/* Footer Section */}
      <div className="border-t border-[#E5E7EB]">{footer}</div>
    </div>
  );
}

interface SidebarMenuItemProps {
  /** Whether the item is currently active */
  active: boolean;
  /** Icon component to render */
  icon: ReactNode;
  /** Label text */
  label: string;
  /** Click handler */
  onClick?: () => void;
  /** Variant style */
  variant?: "default" | "admin";
}

/**
 * SidebarMenuItem - A presentation component for sidebar menu items
 * This component only handles the UI styling for menu items.
 */
export function SidebarMenuItem({
  active,
  icon,
  label,
  onClick,
  variant = "default",
}: SidebarMenuItemProps) {
  if (variant === "admin") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors font-medium",
          active
            ? "bg-[#118DFF] text-white"
            : "text-[#4B5563] hover:bg-[#F5F7FB] hover:text-[#118DFF]",
        )}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        "text-slate-700 hover:bg-slate-50",
        active &&
          "bg-blue-50 text-[#118DFF] border-l-4 border-[#118DFF] pl-[8px]",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
