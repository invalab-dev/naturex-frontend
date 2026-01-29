'use client';

import { useEffect, useState } from 'react';

interface TreeData {
  id: string;
  name: string;
  species: string;
  riskLevel: string;
  lat: number;
  lng: number;
  height: number;
  dbh: number;
  crownWidth: number;
  lastInspection: string;
  location: string;
  dataSource: string;
}

interface InteractiveMapProps {
  onTreeSelect: (tree: TreeData) => void;
}

export function InteractiveMap({ onTreeSelect }: InteractiveMapProps) {
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Map dimensions and bounds
  const mapWidth = 1000;
  const mapHeight = 600;
  const centerLat = 37.5665;
  const centerLng = 126.978;
  const latRange = 0.02; // degrees
  const lngRange = 0.03; // degrees

  useEffect(() => {
    fetch('/api/trees')
      .then((res) => res.json())
      .then((data) => {
        setTrees(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('[v0] Error fetching tree data:', error);
        setIsLoading(false);
      });
  }, []);

  // Convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng - (centerLng - lngRange / 2)) / lngRange) * mapWidth;
    const y =
      mapHeight - ((lat - (centerLat - latRange / 2)) / latRange) * mapHeight;
    return { x, y };
  };

  const getMarkerColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical':
        return '#ef4444';
      case 'High':
        return '#f97316';
      case 'Medium':
        return '#f59e0b';
      default:
        return '#22c55e';
    }
  };

  const handleMarkerClick = (tree: TreeData) => {
    setSelectedId(tree.id);
    onTreeSelect(tree);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-full"
        style={{
          background: 'linear-gradient(to bottom, #e5e7eb 0%, #f3f4f6 100%)',
        }}
      >
        {/* Background street grid pattern */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="streets"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="6" y="47" fill="#9ca3af" opacity="0.3" />
            <rect width="6" height="100" x="47" fill="#9ca3af" opacity="0.3" />
          </pattern>
        </defs>

        <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />
        <rect width={mapWidth} height={mapHeight} fill="url(#streets)" />

        {/* Simulated building blocks */}
        {Array.from({ length: 20 }).map((_, i) => {
          const x = (i % 5) * 200 + 50;
          const y = Math.floor(i / 5) * 150 + 40;
          return (
            <rect
              key={`building-${i}`}
              x={x}
              y={y}
              width={100}
              height={80}
              fill="#cbd5e1"
              opacity="0.4"
              rx="2"
            />
          );
        })}

        {/* Tree markers */}
        {trees.map((tree) => {
          const { x, y } = latLngToXY(tree.lat, tree.lng);
          const isSelected = selectedId === tree.id;
          const isHovered = hoveredId === tree.id;
          const markerColor = getMarkerColor(tree.riskLevel);
          const markerSize = isSelected ? 16 : isHovered ? 14 : 12;

          return (
            <g
              key={tree.id}
              onMouseEnter={() => setHoveredId(tree.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleMarkerClick(tree)}
              style={{ cursor: 'pointer' }}
            >
              {/* Marker shadow */}
              <circle cx={x} cy={y + 2} r={markerSize} fill="rgba(0,0,0,0.2)" />

              {/* Marker outer ring */}
              <circle
                cx={x}
                cy={y}
                r={markerSize}
                fill="white"
                stroke={markerColor}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Marker inner circle */}
              <circle
                cx={x}
                cy={y}
                r={markerSize - 4}
                fill={markerColor}
                opacity={0.9}
              />

              {/* Selection pulse animation */}
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r={markerSize + 4}
                  fill="none"
                  stroke={markerColor}
                  strokeWidth="2"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from={markerSize}
                    to={markerSize + 8}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x + 20}
                    y={y - 30}
                    width="120"
                    height="50"
                    fill="white"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    rx="4"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  />
                  <text
                    x={x + 30}
                    y={y - 15}
                    fontSize="11"
                    fontWeight="600"
                    fill="#111827"
                  >
                    {tree.id}
                  </text>
                  <text x={x + 30} y={y - 3} fontSize="9" fill="#6b7280">
                    {tree.name}
                  </text>
                  <text
                    x={x + 30}
                    y={y + 9}
                    fontSize="9"
                    fill={markerColor}
                    fontWeight="500"
                  >
                    {tree.riskLevel} Risk
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
        NatureX Interactive Map
      </div>
    </div>
  );
}
