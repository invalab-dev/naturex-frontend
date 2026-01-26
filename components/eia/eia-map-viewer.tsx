"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EIAChartsView } from "./eia-charts-view"
import { EIARawDataView } from "./eia-raw-data-view"
import { MapPin } from "lucide-react"

interface EIAMapViewerProps {
  enabledLayers: string[]
}

export function EIAMapViewer({ enabledLayers }: EIAMapViewerProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Site Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Tabs defaultValue="map" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="flex-1 mt-4 data-[state=inactive]:hidden">
            <div className="relative h-full bg-muted rounded-lg overflow-hidden border border-border">
              <img
                src="/aerial-satellite-view-of-forest-development-site-w.jpg"
                alt="EIA Site Aerial View"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              {enabledLayers.includes("ndvi") && (
                <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 border border-border">
                  <div className="text-xs font-medium mb-2">NDVI Legend</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-2 bg-green-700 rounded" />
                      <span>High (0.6-1.0)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-2 bg-green-400 rounded" />
                      <span>Medium (0.3-0.6)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-2 bg-yellow-400 rounded" />
                      <span>Low (0.0-0.3)</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                  <div className="text-xs text-muted-foreground">Project Area</div>
                  <div className="text-sm font-semibold">127.4 ha</div>
                </div>
                <div className="bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                  <div className="text-xs text-muted-foreground">Avg NDVI</div>
                  <div className="text-sm font-semibold text-primary">0.68</div>
                </div>
              </div>

              {/* Sample markers */}
              <MapPin className="absolute top-1/3 left-1/2 w-6 h-6 text-red-500 -translate-x-1/2 -translate-y-full drop-shadow-lg" />
              <MapPin className="absolute top-2/3 left-1/3 w-6 h-6 text-yellow-500 -translate-x-1/2 -translate-y-full drop-shadow-lg" />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="flex-1 mt-4 data-[state=inactive]:hidden">
            <EIAChartsView />
          </TabsContent>

          <TabsContent value="data" className="flex-1 mt-4 data-[state=inactive]:hidden">
            <EIARawDataView />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
