"use client"

import { useEffect } from "react"
import { initializeDefaultData } from "@/lib/data-service"

// Data version - increment to force re-initialization
const DATA_VERSION = "3.0.0-deliverables"

export function DataInitializer() {
  useEffect(() => {
    initializeDefaultData()
  }, [])

  return null
}
