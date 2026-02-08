"use client";
import { Trees, FileCheck, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProductMode = "streetcare" | "eia" | "custom";

interface ProductModeSelectorProps {
  value: ProductMode;
  onChange: (mode: ProductMode) => void;
}

const modes = [
  {
    id: "streetcare" as const,
    label: "StreetCare",
    koreanLabel: "가로수 관리",
    icon: Trees,
    description: "Tree structure analysis with drone & LiDAR",
  },
  {
    id: "eia" as const,
    label: "EIA",
    koreanLabel: "자연환경영향평가",
    icon: FileCheck,
    description: "Environmental impact assessment",
  },
  {
    id: "custom" as const,
    label: "Custom Projects",
    koreanLabel: "맞춤형 프로젝트",
    icon: Palette,
    description: "Restoration & monitoring solutions",
  },
];

export function ProductModeSelector({
  value,
  onChange,
}: ProductModeSelectorProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.id;

        return (
          <Button
            key={mode.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange(mode.id)}
            className={cn(
              "flex items-center gap-2 transition-all",
              isActive && "bg-primary text-primary-foreground",
            )}
          >
            <Icon size={16} />
            <span className="font-medium">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
