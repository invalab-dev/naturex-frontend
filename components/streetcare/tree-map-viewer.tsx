'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface TreeMapViewerProps {
  selectedTreeId: string | null;
  onTreeSelect: (id: string) => void;
}

const treeData = [
  { id: 'TR-001', x: 25, y: 30, risk: 'Low', species: 'Ginkgo' },
  { id: 'TR-002', x: 45, y: 20, risk: 'Medium', species: 'Cherry' },
  { id: 'TR-003', x: 60, y: 50, risk: 'High', species: 'Pine' },
  { id: 'TR-004', x: 15, y: 70, risk: 'Low', species: 'Maple' },
  { id: 'TR-005', x: 75, y: 65, risk: 'Medium', species: 'Oak' },
  { id: 'TR-006', x: 35, y: 80, risk: 'Low', species: 'Birch' },
  { id: 'TR-007', x: 85, y: 35, risk: 'High', species: 'Willow' },
  { id: 'TR-008', x: 50, y: 45, risk: 'Medium', species: 'Ash' },
];

export function TreeMapViewer({
  selectedTreeId,
  onTreeSelect,
}: TreeMapViewerProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Map Viewer</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Tree locations with risk indicators
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            <MapPin size={12} className="mr-1" />
            {treeData.length} Trees
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div
          className="relative w-full h-full bg-muted/20"
          style={{ minHeight: '500px' }}
        >
          {/* Map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Tree markers */}
          {treeData.map((tree) => {
            const isSelected = selectedTreeId === tree.id;
            const riskColor =
              tree.risk === 'High'
                ? 'bg-destructive'
                : tree.risk === 'Medium'
                  ? 'bg-warning'
                  : 'bg-primary';

            return (
              <button
                key={tree.id}
                onClick={() => onTreeSelect(tree.id)}
                className={cn(
                  'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all',
                  isSelected && 'scale-125 z-10',
                )}
                style={{ left: `${tree.x}%`, top: `${tree.y}%` }}
              >
                <div
                  className={cn(
                    'w-3 h-3 rounded-full',
                    riskColor,
                    isSelected && 'ring-4 ring-primary/30',
                  )}
                />
                {isSelected && (
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                    {tree.id}
                  </div>
                )}
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg">
            <p className="text-xs font-medium mb-2">Risk Level</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-warning" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
