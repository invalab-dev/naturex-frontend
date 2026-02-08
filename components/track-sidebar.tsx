"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  BarChart3,
  Settings,
  FileText,
  Map,
  Activity,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrackSidebarProps {
  projectId: string;
  track: "efficiency" | "asset-value" | "esg-tnfd";
}

const trackConfigs = {
  efficiency: {
    title: "Efficiency",
    items: [
      { href: "", label: "Home", icon: Home },
      { href: "/planning", label: "Planning", icon: FolderOpen },
      { href: "/analysis", label: "Analysis", icon: BarChart3 },
      { href: "/management", label: "Management", icon: Settings },
    ],
  },
  "asset-value": {
    title: "Asset Value",
    items: [
      { href: "", label: "Home", icon: Home },
      { href: "/analysis", label: "Analysis", icon: BarChart3 },
      { href: "/scenario", label: "Scenario", icon: Zap },
      { href: "/reporting", label: "Reporting", icon: FileText },
    ],
  },
  "esg-tnfd": {
    title: "ESG & TNFD",
    items: [
      { href: "", label: "Home", icon: Home },
      { href: "/data-mapping", label: "Data Mapping", icon: Map },
      { href: "/leap-analysis", label: "LEAP Analysis", icon: Activity },
      { href: "/reporting", label: "Reporting", icon: FileText },
    ],
  },
};

export function TrackSidebar({ projectId, track }: TrackSidebarProps) {
  const pathname = usePathname();
  const config = trackConfigs[track];
  const baseUrl = `/app/projects/${projectId}/${track}`;

  const isActive = (path: string) => {
    if (path === "") {
      return pathname === baseUrl;
    }
    return (
      pathname === baseUrl + path || pathname.startsWith(baseUrl + path + "/")
    );
  };

  return (
    <div className="w-56 h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Track Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {config.title}
        </h3>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {config.items.map((item) => {
          const Icon = item.icon;
          const href = baseUrl + item.href;
          return (
            <Link key={item.href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                  isActive(item.href) &&
                    "bg-blue-50 dark:bg-blue-950/30 text-[#118DFF] dark:text-[#118DFF] font-medium",
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
