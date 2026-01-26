"use client"

import { useEffect } from "react"
import { initializeDefaultData, migrateProjectsToDeliveryStage } from "@/lib/data-service"
import { initializeWidgetCatalog } from "@/lib/widget-catalog"

export function DataInitializer() {
  useEffect(() => {
    initializeDefaultData()
    initializeWidgetCatalog()
    migrateProjectsToDeliveryStage()
  }, [])

  return null
}
