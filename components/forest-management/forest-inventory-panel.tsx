'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TreePine, Ruler, Activity, AlertCircle } from 'lucide-react';
import { ForestInventoryTable } from './forest-inventory-table';
import { TimberVolumeChart } from './timber-volume-chart';

interface ForestInventoryPanelProps {
  plotId: string | null;
}

const plotData = {
  'FP-001': {
    name: 'Plot A1',
    area: '42.5 acres',
    dominantSpecies: 'Pinus densiflora (소나무)',
    treeCount: 1247,
    avgHeight: '18.3 m',
    avgDbh: '32.5 cm',
    timberVolume: '3,240 m³',
    healthStatus: 'excellent',
    biodiversityIndex: 7.8,
    lastSurvey: '2025-11-15',
  },
};

export function ForestInventoryPanel({ plotId }: ForestInventoryPanelProps) {
  const data = plotId
    ? plotData[plotId as keyof typeof plotData]
    : plotData['FP-001'];

  const getHealthBadge = (status: string) => {
    const variants = {
      excellent: 'default',
      good: 'secondary',
      fair: 'outline',
      poor: 'destructive',
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{data.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Forest Inventory Data
            </p>
          </div>
          <Badge variant={getHealthBadge(data.healthStatus)}>
            {data.healthStatus.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TreePine size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">Tree Count</span>
            </div>
            <div className="text-2xl font-bold">
              {data.treeCount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.area}
            </div>
          </div>

          <div className="border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Ruler size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">Avg Height</span>
            </div>
            <div className="text-2xl font-bold">{data.avgHeight}</div>
            <div className="text-xs text-muted-foreground mt-1">
              DBH: {data.avgDbh}
            </div>
          </div>

          <div className="border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">
                Timber Volume
              </span>
            </div>
            <div className="text-2xl font-bold">{data.timberVolume}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Total standing volume
            </div>
          </div>

          <div className="border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">
                Biodiversity
              </span>
            </div>
            <div className="text-2xl font-bold">{data.biodiversityIndex}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Shannon Index
            </div>
          </div>
        </div>

        {/* Species Info */}
        <div className="mb-6 p-3 bg-muted/30 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">
            Dominant Species
          </div>
          <div className="font-medium">{data.dominantSpecies}</div>
          <div className="text-xs text-muted-foreground mt-2">
            Last Survey: {data.lastSurvey}
          </div>
        </div>

        {/* Tabs for detailed data */}
        <Tabs defaultValue="inventory" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-4">
            <ForestInventoryTable />
          </TabsContent>

          <TabsContent value="volume" className="mt-4">
            <TimberVolumeChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
