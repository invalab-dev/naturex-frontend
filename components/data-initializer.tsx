"use client"

import { useEffect } from "react"
import { initializeDefaultData } from "@/lib/data-service"

// Data version - increment to force re-initialization
const DATA_VERSION = "3.0.0-deliverables"

function checkAndMigrateDataVersion() {
  const currentVersion = localStorage.getItem("naturex_data_version")
  if (currentVersion !== DATA_VERSION) {
    // Clear old data to force re-initialization with new schema
    localStorage.removeItem("naturex_projects")
    localStorage.removeItem("naturex_widget_catalog")
    // Clear any old widget config keys
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes("widget") || key.includes("_widget_"))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
    localStorage.setItem("naturex_data_version", DATA_VERSION)
    console.log("[Migration] Data version updated to", DATA_VERSION)
  }
}

export function DataInitializer() {
  useEffect(() => {
    checkAndMigrateDataVersion()
    initializeDefaultData()
  }, [])

  return null
}
