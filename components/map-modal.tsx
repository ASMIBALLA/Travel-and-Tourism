"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Maximize2, Minimize2 } from "lucide-react"


interface Location {
  name: string
  lat: number
  lng: number
}

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  sourceLocation: Location | null
  destination: Location | null
  children?: React.ReactNode
  isMapMinimized: boolean
  /** NEW: receive live route metrics from the map */
  onRouteDrawn: (metrics: { distanceKm: number; durationMin: number }) => void
  onToggleMapSize: () => void
}


export function MapModal({
  isOpen,
  onClose,
  sourceLocation,
  destination,
  children,
  isMapMinimized,
  onRouteDrawn,
  onToggleMapSize,
}: MapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const routeLayerRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const computeCenter = (a: Location, b: Location) => ({
    lat: (a.lat + b.lat) / 2,
    lng: (a.lng + b.lng) / 2,
  })

  useEffect(() => {
    if (!isOpen || !sourceLocation || !destination) return

    let cancelled = false

    const initializeMap = async () => {
      // Import Leaflet ONCE here
      const L = await import("leaflet").then((m) => m.default ?? m)

      // Inject CSS once
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Create map once
      if (mapRef.current && !mapInstanceRef.current) {
        const center = computeCenter(sourceLocation, destination)
        mapInstanceRef.current = L.map(mapRef.current).setView([center.lat, center.lng], 10)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(mapInstanceRef.current)

        routeLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current)
        markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current)

        setIsMapLoaded(true)
      }

      // Helpers use the same L captured above — no await inside
      const drawMarkers = () => {
        if (!markersLayerRef.current) return
        markersLayerRef.current.clearLayers()

        const sourceIcon = L.divIcon({
          html: `<div class="w-6 h-6 bg-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                   <div class="w-2 h-2 bg-white rounded-full"></div>
                 </div>`,
          className: "custom-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const destinationIcon = L.divIcon({
          html: `<div class="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                   <div class="w-2 h-2 bg-white rounded-full"></div>
                 </div>`,
          className: "custom-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const s = L.marker([sourceLocation.lat, sourceLocation.lng], { icon: sourceIcon })
          .bindPopup(`<strong>Starting Point</strong><br/>${sourceLocation.name}`)
        const d = L.marker([destination.lat, destination.lng], { icon: destinationIcon })
          .bindPopup(`<strong>Destination</strong><br/>${destination.name}`)

        markersLayerRef.current.addLayer(s)
        markersLayerRef.current.addLayer(d)
      }

      const fitTo = (layers: any[]) => {
        const group = L.featureGroup(layers)
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [24, 24] })
      }

      const drawStraightFallback = () => {
        if (!routeLayerRef.current) return
        routeLayerRef.current.clearLayers()

        const line = L.polyline(
          [
            [sourceLocation.lat, sourceLocation.lng],
            [destination.lat, destination.lng],
          ],
          { color: "#15803d", weight: 4, opacity: 0.8, dashArray: "10,5" },
        )
        routeLayerRef.current.addLayer(line)

        fitTo([...markersLayerRef.current.getLayers(), line])
      }

      const drawOsrmRoute = async () => {
        if (!routeLayerRef.current) return
        routeLayerRef.current.clearLayers()

        const s = `${sourceLocation.lng},${sourceLocation.lat}`
        const d = `${destination.lng},${destination.lat}`
        const url = `https://router.project-osrm.org/route/v1/driving/${s};${d}?overview=full&geometries=geojson&alternatives=false&steps=false`

        try {
          const resp = await fetch(url, { cache: "no-store" })
          if (!resp.ok) throw new Error(`OSRM error ${resp.status}`)
          const data = await resp.json()

          if (cancelled || !data?.routes?.[0]) {
            drawStraightFallback()
            return
          }

          // ✅ OSRM success -> compute metrics and send to parent
          const meters = data.routes[0].distance as number        // meters
          const seconds = data.routes[0].duration as number       // seconds
          const distanceKm = meters / 1000
          const durationMin = Math.round(seconds / 60)
          onRouteDrawn({ distanceKm, durationMin })

          // Draw geometry
          const coords = (data.routes[0].geometry.coordinates as [number, number][])
            .map(([lng, lat]) => [lat, lng] as [number, number])

          const routeLine = L.polyline(coords, { color: "#15803d", weight: 5, opacity: 0.9 })
          routeLayerRef.current.addLayer(routeLine)

          fitTo([...markersLayerRef.current.getLayers(), routeLine])
        } catch {
          drawStraightFallback()
        }
      }


      drawMarkers()
      await drawOsrmRoute()
    }

    initializeMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        setIsMapLoaded(false)
      }
    }
  }, [isOpen, sourceLocation, destination, onRouteDrawn])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div
        className={`fixed bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-700 ease-in-out ${
          isMapMinimized ? "top-4 left-4 right-4 h-64" : "inset-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-primary">Route Map</h3>
            <p className="text-sm text-muted-foreground">
              {sourceLocation?.name} → {destination?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onToggleMapSize}>
              {isMapMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full rounded-b-lg" />

          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMapMinimized && children && (
        <div className="fixed top-72 left-4 right-4 bottom-4 overflow-y-auto">{children}</div>
      )}

      {!isMapMinimized && children && <div className="fixed bottom-8 left-8 right-8">{children}</div>}
    </div>
  )
}
