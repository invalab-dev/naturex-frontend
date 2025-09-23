"use client"

import { useEffect, useRef, useState } from "react"
import { VegetationDataSidebar } from "./components/vegetation-data-sidebar";
import { MapOverlayControls } from "./components/map-overlay-controls";
import { VegetationDetailModal } from "./components/vegetation-detail-modal";

interface VegetationPoint {
  id: string
  coordinates: [number, number]
  address: string
  vegetationType: string
  coverage: number
  lastSurvey: string
  elevation: number
  soilType: string
  climateZone: string
}

export default function VegetationMapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedPoint, setSelectedPoint] = useState<VegetationPoint | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for demonstration
  const mockVegetationPoint: VegetationPoint = {
    id: "veg_001",
    coordinates: [37.5665, 126.978],
    address: "서울특별시 중구 명동2가",
    vegetationType: "활엽수림",
    coverage: 78,
    lastSurvey: "2024-08-15",
    elevation: 125,
    soilType: "갈색산림토",
    climateZone: "온대습윤기후",
  }

  useEffect(() => {
    // Initialize Leaflet map
    const initMap = async () => {
      if (typeof window !== "undefined" && mapRef.current) {
        const L = (await import("leaflet")).default

        // Fix for default markers in Leaflet
        // delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        const map = L.map(mapRef.current, { zoomControl: false }).setView([37.5665, 126.978], 10)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        // Add sample vegetation layer
        const vegetationLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: "© Esri",
          },
        )

        // Layer control
        const baseMaps = {
          "기본 지도": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
          "위성 이미지": vegetationLayer,
        }

        // L.control.layers(baseMaps).addTo(map)

        // Add sample markers with click events
        const marker = L.marker([37.5665, 126.978]).addTo(map)
        marker.on("click", () => {
          setSelectedPoint(mockVegetationPoint)
          setIsModalOpen(true)
        })

        // Add more sample markers
        const samplePoints = [
          { lat: 37.5565, lng: 126.988, type: "침엽수림" },
          { lat: 37.5765, lng: 126.968, type: "혼효림" },
          { lat: 37.5465, lng: 126.998, type: "초지" },
        ]

        samplePoints.forEach((point, index) => {
          const sampleMarker = L.marker([point.lat, point.lng]).addTo(map)
          sampleMarker.on("click", () => {
            setSelectedPoint({
              ...mockVegetationPoint,
              id: `veg_00${index + 2}`,
              coordinates: [point.lat, point.lng],
              vegetationType: point.type,
              coverage: Math.floor(Math.random() * 40) + 60,
            })
            setIsModalOpen(true)
          })
        })
      }
    }

    initMap()
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 z-0" style={{ height: "100vh", width: "100vw" }} />

      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      {/* Top Navigation Bar */}

      {/* Left Sidebar - Data Query Panel */}
      <VegetationDataSidebar className="absolute top-20 left-4 z-10" />

      <MapOverlayControls className="absolute top-20 right-4 z-10" />


      <VegetationDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} point={selectedPoint} />
    </div>
  )
}
