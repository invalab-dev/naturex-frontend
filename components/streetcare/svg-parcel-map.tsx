'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';

type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

interface Parcel {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  points: { x: number; y: number }[];
}

interface Tree {
  id: string;
  parcelId: string;
  species: string;
  x: number;
  y: number;
  height: number;
  dbh: number;
  risk: RiskLevel;
}

const getParcelColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'High':
      return '#f97316';
    case 'Critical':
      return '#ef4444';
    case 'Medium':
      return '#eab308';
    default:
      return '#22c55e';
  }
};

const getTreeColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'High':
    case 'Critical':
      return '#ef4444';
    case 'Medium':
      return '#eab308';
    default:
      return '#22c55e';
  }
};

interface SvgParcelMapProps {
  parcels: Parcel[];
  trees: Tree[];
  selectedParcelId?: string;
  onSelectParcel: (id: string) => void;
  selectedTreeId?: string;
  onSelectTree: (id: string) => void;
}

export function SvgParcelMap({
  parcels,
  trees,
  selectedParcelId,
  onSelectParcel,
  selectedTreeId,
  onSelectTree,
}: SvgParcelMapProps) {
  const [baseLayer, setBaseLayer] = useState<
    'street' | 'satellite' | 'terrain'
  >('street');
  const [hoveredItem, setHoveredItem] = useState<{
    type: 'parcel' | 'tree';
    id: string;
  } | null>(null);

  const getBackground = () => {
    if (baseLayer === 'satellite') return 'bg-emerald-900';
    if (baseLayer === 'terrain') return 'bg-amber-900';
    return 'bg-slate-800';
  };

  const getGridColor = () => {
    if (baseLayer === 'satellite') return '#065f46';
    if (baseLayer === 'terrain') return '#78350f';
    return '#334155';
  };

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden ${getBackground()}`}
    >
      {/* Layer Switcher */}
      <div className="absolute z-10 right-4 top-3 flex gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white shadow-lg">
        <Button
          variant={baseLayer === 'street' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setBaseLayer('street')}
          className="h-7 px-3 text-xs rounded-full"
        >
          <Layers className="h-3 w-3 mr-1" />
          일반지도
        </Button>
        <Button
          variant={baseLayer === 'satellite' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setBaseLayer('satellite')}
          className="h-7 px-3 text-xs rounded-full"
        >
          <Layers className="h-3 w-3 mr-1" />
          위성지도
        </Button>
        <Button
          variant={baseLayer === 'terrain' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setBaseLayer('terrain')}
          className="h-7 px-3 text-xs rounded-full"
        >
          <Layers className="h-3 w-3 mr-1" />
          지형지도
        </Button>
      </div>

      {/* SVG Parcel Map */}
      <svg viewBox="0 0 1000 600" className="w-full h-full">
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
              stroke={getGridColor()}
              strokeWidth="0.5"
              opacity="0.4"
            />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1000" height="600" fill="url(#grid)" />

        {/* Parcels */}
        {parcels.map((parcel) => {
          const pointsAttr = parcel.points
            .map((p) => `${p.x},${p.y}`)
            .join(' ');
          const isSelected = parcel.id === selectedParcelId;
          const isHovered =
            hoveredItem?.type === 'parcel' && hoveredItem.id === parcel.id;
          const color = getParcelColor(parcel.riskLevel);

          return (
            <g key={parcel.id}>
              {(isSelected || isHovered) && (
                <polygon
                  points={pointsAttr}
                  fill={color}
                  fillOpacity="0.15"
                  stroke={color}
                  strokeWidth="6"
                  filter="url(#glow)"
                  className="pointer-events-none"
                />
              )}
              <polygon
                points={pointsAttr}
                fill={color}
                fillOpacity={isSelected ? 0.5 : isHovered ? 0.4 : 0.35}
                stroke={
                  isSelected ? '#ffffff' : isHovered ? '#ffffff' : '#0f172a'
                }
                strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectParcel(parcel.id)}
                onMouseEnter={() =>
                  setHoveredItem({ type: 'parcel', id: parcel.id })
                }
                onMouseLeave={() => setHoveredItem(null)}
              />
              <text
                x={
                  parcel.points.reduce((sum, p) => sum + p.x, 0) /
                  parcel.points.length
                }
                y={
                  parcel.points.reduce((sum, p) => sum + p.y, 0) /
                  parcel.points.length
                }
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                className="pointer-events-none"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                  filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))',
                }}
              >
                {parcel.name}
              </text>
            </g>
          );
        })}

        {/* Trees */}
        {trees.map((tree) => {
          const isSelected = tree.id === selectedTreeId;
          const isHovered =
            hoveredItem?.type === 'tree' && hoveredItem.id === tree.id;
          const radius = isSelected ? 10 : isHovered ? 8 : 6;
          const color = getTreeColor(tree.risk);

          return (
            <g key={tree.id}>
              {(isSelected || isHovered) && (
                <circle
                  cx={tree.x}
                  cy={tree.y}
                  r={radius + 4}
                  fill={color}
                  opacity="0.3"
                  filter="url(#glow)"
                  className="pointer-events-none"
                />
              )}
              <circle
                cx={tree.x}
                cy={tree.y}
                r={radius}
                fill={color}
                stroke={isSelected ? '#ffffff' : isHovered ? '#ffffff' : 'none'}
                strokeWidth={isSelected || isHovered ? 2 : 0}
                className="cursor-pointer transition-all duration-200"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}
                onClick={() => {
                  onSelectParcel(tree.parcelId);
                  onSelectTree(tree.id);
                }}
                onMouseEnter={() =>
                  setHoveredItem({ type: 'tree', id: tree.id })
                }
                onMouseLeave={() => setHoveredItem(null)}
              />
              {isHovered && (
                <g>
                  <rect
                    x={tree.x + 12}
                    y={tree.y - 28}
                    width="120"
                    height="50"
                    fill="rgba(15, 23, 42, 0.95)"
                    rx="4"
                    stroke={color}
                    strokeWidth="1.5"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}
                  />
                  <text
                    x={tree.x + 18}
                    y={tree.y - 12}
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {tree.id}
                  </text>
                  <text
                    x={tree.x + 18}
                    y={tree.y + 2}
                    fill="white"
                    fontSize="10"
                  >
                    {tree.species}
                  </text>
                  <text
                    x={tree.x + 18}
                    y={tree.y + 16}
                    fill={color}
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {tree.risk} Risk
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
