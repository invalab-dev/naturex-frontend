'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Camera,
  Leaf,
  Grid3x3,
  Route,
  Scale,
  FileText,
  Download,
} from 'lucide-react';

interface EIASidebarProps {
  onGenerateReport?: () => void;
}

const navItems = [
  { id: 'overview', label: 'Project Overview', icon: LayoutDashboard },
  { id: 'drone', label: 'Drone Imagery', icon: Camera },
  { id: 'ndvi', label: 'NDVI / NDRE Maps', icon: Leaf },
  { id: 'habitat', label: 'Habitat Classification', icon: Grid3x3 },
  { id: 'corridor', label: 'Ecological Corridor', icon: Route },
  { id: 'legal', label: 'Legal Evaluation', icon: Scale },
  { id: 'report', label: 'Export Report', icon: FileText },
];

export function EIASidebar({ onGenerateReport }: EIASidebarProps) {
  const [activeNav, setActiveNav] = useState('overview');

  return (
    <aside className="w-56 border-r border-border bg-muted/30">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">EIA</h2>
        <p className="text-xs text-muted-foreground mt-0.5">자연환경영향평가</p>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveNav(item.id)}
              className={cn(
                'w-full justify-start gap-2 h-9 text-sm',
                isActive && 'bg-secondary font-medium',
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border mt-4">
        <Button
          variant="default"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onGenerateReport}
        >
          <Download size={16} />
          <span>Generate Report</span>
        </Button>
      </div>
    </aside>
  );
}
