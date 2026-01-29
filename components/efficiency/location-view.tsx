'use client';

import { useState } from 'react';
import { Map, Layers, TreeDeciduous, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const treeData = [
  {
    id: 'T001',
    lat: 37.5665,
    lng: 126.978,
    height: 12.4,
    dbh: 35,
    health: 82,
    risk: 'Low',
    crown: 145,
    ndvi: 0.78,
    ndre: 0.65,
  },
  {
    id: 'T002',
    lat: 37.567,
    lng: 126.979,
    height: 15.2,
    dbh: 42,
    health: 45,
    risk: 'High',
    crown: 98,
    ndvi: 0.42,
    ndre: 0.38,
  },
  {
    id: 'T003',
    lat: 37.5668,
    lng: 126.98,
    height: 11.8,
    dbh: 38,
    health: 68,
    risk: 'Medium',
    crown: 132,
    ndvi: 0.65,
    ndre: 0.58,
  },
];

export function EfficiencyLocationView() {
  const [mapLayer, setMapLayer] = useState<
    'standard' | 'satellite' | 'terrain'
  >('standard');
  const [selectedTree, setSelectedTree] = useState(treeData[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Map Controls */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Map size={20} />
            지도 기반 위치 분석
          </h3>
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-muted-foreground" />
            <div className="flex rounded-lg overflow-hidden border border-slate-700">
              <Button
                size="sm"
                variant={mapLayer === 'standard' ? 'secondary' : 'ghost'}
                className="rounded-none text-xs"
                onClick={() => setMapLayer('standard')}
              >
                일반지도
              </Button>
              <Button
                size="sm"
                variant={mapLayer === 'satellite' ? 'secondary' : 'ghost'}
                className="rounded-none text-xs"
                onClick={() => setMapLayer('satellite')}
              >
                위성지도
              </Button>
              <Button
                size="sm"
                variant={mapLayer === 'terrain' ? 'secondary' : 'ghost'}
                className="rounded-none text-xs"
                onClick={() => setMapLayer('terrain')}
              >
                지형지도
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
          <svg viewBox="0 0 800 600" className="w-full h-[600px]">
            {/* Background based on map type */}
            <rect
              width="800"
              height="600"
              fill={
                mapLayer === 'satellite'
                  ? '#1a2332'
                  : mapLayer === 'terrain'
                    ? '#2d3a2e'
                    : '#1e293b'
              }
            />

            {/* Grid lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={i}>
                <line
                  x1={i * 40}
                  y1="0"
                  x2={i * 40}
                  y2="600"
                  stroke="#334155"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1={i * 30}
                  x2="800"
                  y2={i * 30}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              </g>
            ))}

            {/* Parcel polygons */}
            <polygon
              points="100,100 300,120 280,250 120,240"
              fill="#10b98130"
              stroke="#10b981"
              strokeWidth="2"
            />
            <polygon
              points="320,100 520,110 500,260 310,250"
              fill="#eab30830"
              stroke="#eab308"
              strokeWidth="2"
            />
            <polygon
              points="540,120 720,130 700,280 530,270"
              fill="#ef444430"
              stroke="#ef4444"
              strokeWidth="2"
            />

            {/* Road/Administrative layers */}
            <path
              d="M 0,300 L 800,300"
              stroke="#64748b"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
            <path
              d="M 400,0 L 400,600"
              stroke="#64748b"
              strokeWidth="3"
              strokeDasharray="10,5"
            />

            {/* Tree markers with color-coded risk */}
            {treeData.map((tree, idx) => {
              const x = 150 + idx * 200;
              const y = 180 + idx * 50;
              const color =
                tree.risk === 'High'
                  ? '#ef4444'
                  : tree.risk === 'Medium'
                    ? '#eab308'
                    : '#10b981';

              return (
                <g
                  key={tree.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedTree(tree)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill={color}
                    opacity="0.7"
                    stroke={color}
                    strokeWidth="2"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                  <text
                    x={x}
                    y={y - 20}
                    fill="#e2e8f0"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {tree.id}
                  </text>
                </g>
              );
            })}

            {/* NDVI/Height layer toggle legend */}
            <g transform="translate(650, 20)">
              <rect
                width="120"
                height="80"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1"
                rx="4"
              />
              <text
                x="10"
                y="20"
                fill="#94a3b8"
                fontSize="11"
                fontWeight="bold"
              >
                Layer
              </text>
              <text x="10" y="40" fill="#10b981" fontSize="10">
                ● NDVI
              </text>
              <text x="10" y="60" fill="#3b82f6" fontSize="10">
                ● Height
              </text>
            </g>
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TreeDeciduous size={20} />
              Tree Details
            </h3>
            <Badge
              variant={
                selectedTree.risk === 'High'
                  ? 'destructive'
                  : selectedTree.risk === 'Medium'
                    ? 'secondary'
                    : 'default'
              }
            >
              {selectedTree.risk}
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <p className="text-xs text-muted-foreground">Tree ID</p>
              <p className="text-lg font-bold text-foreground">
                {selectedTree.id}
              </p>
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="text-xl font-semibold text-foreground">
                  {selectedTree.height}m
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">DBH</p>
                <p className="text-xl font-semibold text-foreground">
                  {selectedTree.dbh}cm
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Crown Volume</p>
                <p className="text-xl font-semibold text-foreground">
                  {selectedTree.crown}m³
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Health Score</p>
                <p className="text-xl font-semibold text-emerald-400">
                  {selectedTree.health}
                </p>
              </div>
            </div>

            {/* Risk Score */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Risk Assessment
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Overall Risk</span>
                  <Badge
                    variant={
                      selectedTree.risk === 'High' ? 'destructive' : 'secondary'
                    }
                  >
                    {selectedTree.risk}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle size={16} />
                근거 지표
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300">LiDAR Analysis</span>
                    <Badge variant="outline" className="text-xs">
                      LiDAR
                    </Badge>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400 ml-2">
                    <li>• Slope/Tilt: 8.2° (양호)</li>
                    <li>• Crown Ratio: 0.65</li>
                    <li>• Structural Integrity: Good</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300">RGB Imaging</span>
                    <Badge variant="outline" className="text-xs">
                      RGB
                    </Badge>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400 ml-2">
                    <li>• Crown Anomaly: None detected</li>
                    <li>• Discoloration: Minimal</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300">Multispectral</span>
                    <Badge variant="outline" className="text-xs">
                      Multispectral
                    </Badge>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400 ml-2">
                    <li>• NDVI: {selectedTree.ndvi} (건강)</li>
                    <li>• NDRE: {selectedTree.ndre} (정상)</li>
                    <li>• Stress Level: Low</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
