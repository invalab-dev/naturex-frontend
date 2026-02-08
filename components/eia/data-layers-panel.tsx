"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DataLayersPanelProps {
  enabledLayers: string[];
  onToggleLayer: (layerId: string) => void;
}

const dataLayers = [
  { id: "satellite", label: "Satellite Base", color: "bg-blue-500" },
  { id: "boundaries", label: "Project Boundaries", color: "bg-red-500" },
  { id: "ndvi", label: "NDVI Map", color: "bg-green-500" },
  { id: "ndre", label: "NDRE Map", color: "bg-lime-500" },
  { id: "habitat-forest", label: "Forest Habitat", color: "bg-emerald-600" },
  { id: "habitat-grassland", label: "Grassland", color: "bg-yellow-500" },
  { id: "habitat-wetland", label: "Wetland", color: "bg-cyan-500" },
  { id: "habitat-urban", label: "Urban Area", color: "bg-gray-500" },
  { id: "corridor-main", label: "Main Corridor", color: "bg-purple-500" },
  { id: "corridor-buffer", label: "Buffer Zone", color: "bg-orange-400" },
  { id: "species-grade1", label: "Grade I Species", color: "bg-red-600" },
  { id: "species-grade2", label: "Grade II Species", color: "bg-orange-500" },
  { id: "protected-area", label: "Protected Area", color: "bg-pink-500" },
];

export function DataLayersPanel({
  enabledLayers,
  onToggleLayer,
}: DataLayersPanelProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Data Layers</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {dataLayers.map((layer) => (
              <div key={layer.id} className="flex items-center gap-2">
                <Checkbox
                  id={layer.id}
                  checked={enabledLayers.includes(layer.id)}
                  onCheckedChange={() => onToggleLayer(layer.id)}
                />
                <div className={cn("w-3 h-3 rounded-sm", layer.color)} />
                <Label
                  htmlFor={layer.id}
                  className="text-sm cursor-pointer flex-1"
                >
                  {layer.label}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
