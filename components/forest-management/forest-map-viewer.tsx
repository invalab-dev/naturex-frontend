'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Layers, ZoomIn, ZoomOut } from 'lucide-react';

interface ForestMapViewerProps {
  selectedPlotId: string | null;
  onPlotSelect: (id: string) => void;
}

const forestPlots = [
  {
    id: 'FP-001',
    name: 'Plot A1',
    x: 25,
    y: 30,
    health: 'excellent',
    acres: 42.5,
  },
  { id: 'FP-002', name: 'Plot A2', x: 45, y: 25, health: 'good', acres: 38.2 },
  { id: 'FP-003', name: 'Plot B1', x: 65, y: 40, health: 'fair', acres: 51.7 },
  {
    id: 'FP-004',
    name: 'Plot B2',
    x: 30,
    y: 60,
    health: 'excellent',
    acres: 46.3,
  },
  { id: 'FP-005', name: 'Plot C1', x: 70, y: 70, health: 'good', acres: 33.8 },
];

export function ForestMapViewer({
  selectedPlotId,
  onPlotSelect,
}: ForestMapViewerProps) {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Forest Map Viewer</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">산림 구획 지도</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Layers size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomIn size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomOut size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="relative w-full h-full bg-gradient-to-br from-green-900/20 via-green-800/10 to-green-700/20">
          <img
            src="/aerial-view-of-dense-forest-with-roads-and-clearin.jpg"
            alt="Forest aerial view"
            className="w-full h-full object-cover opacity-60"
          />

          {forestPlots.map((plot) => (
            <button
              key={plot.id}
              onClick={() => onPlotSelect(plot.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                selectedPlotId === plot.id
                  ? 'scale-125 z-10'
                  : 'hover:scale-110'
              }`}
              style={{ left: `${plot.x}%`, top: `${plot.y}%` }}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full ${getHealthColor(plot.health)} ${
                    selectedPlotId === plot.id
                      ? 'ring-4 ring-white shadow-lg'
                      : 'ring-2 ring-white/50'
                  } flex items-center justify-center`}
                >
                  <MapPin size={16} className="text-white" />
                </div>
                {selectedPlotId === plot.id && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-background border border-border rounded px-2 py-1 text-xs font-medium whitespace-nowrap shadow-lg">
                    {plot.name}
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/95 border border-border rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold mb-2">Forest Health</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs">Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs">Poor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs">Critical</span>
            </div>
          </div>

          {/* Total Plots Info */}
          <div className="absolute top-4 right-4 bg-background/95 border border-border rounded-lg px-3 py-2">
            <div className="text-xs text-muted-foreground">Total Plots</div>
            <div className="text-2xl font-bold">{forestPlots.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
