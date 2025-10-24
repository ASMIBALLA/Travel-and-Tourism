"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation } from "lucide-react"

interface Location {
  name: string
  lat: number
  lng: number
}

interface LocationInputProps {
  sourceLocation: Location | null
  destination: Location | null
  onSourceChange: (location: Location | null) => void
  onDestinationChange: (location: Location | null) => void
  onLocationSet: () => void
}

// Sample locations for Sikkim/Northeast India (fallbacks)
const sampleLocations: Location[] = [
  { name: "Gangtok", lat: 27.3389, lng: 88.6065 },
  { name: "Pelling", lat: 27.2152, lng: 88.2426 },
  { name: "Namchi", lat: 27.1663, lng: 88.3639 },
  { name: "Yuksom", lat: 27.3628, lng: 88.2119 },
  { name: "Rumtek Monastery", lat: 27.3019, lng: 88.6411 },
  { name: "Pemayangtse Monastery", lat: 27.2152, lng: 88.2426 },
  { name: "Tashiding Monastery", lat: 27.3333, lng: 88.2667 },
]

export function LocationInput({
  sourceLocation,
  destination,
  onSourceChange,
  onDestinationChange,
  onLocationSet,
}: LocationInputProps) {
  const [sourceInput, setSourceInput] = useState("")
  const [destinationInput, setDestinationInput] = useState("")
  const [sourceSuggestions, setSourceSuggestions] = useState<Location[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<Location[]>([])

  // Debounce timers (keep logic internal; no UI change)
  const sourceTimer = useRef<number | null>(null)
  const destTimer = useRef<number | null>(null)

  // --- Helpers: online geocoding (Nominatim) ---
  const searchPlaces = async (query: string): Promise<Location[]> => {
    if (!query?.trim()) return []
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        query,
      )}&limit=6&addressdetails=0`
      const resp = await fetch(url, {
        headers: {
          // being polite to Nominatim
          "Accept-Language": "en",
        },
        cache: "no-store",
      })
      if (!resp.ok) throw new Error("geocode failed")
      const data: Array<{ display_name: string; lat: string; lon: string }> = await resp.json()
      return data.map((p) => ({
        name: p.display_name,
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lon),
      }))
    } catch {
      // fallback to local samples on error
      return sampleLocations.filter((loc) =>
        loc.name.toLowerCase().includes(query.toLowerCase()),
      )
    }
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      const resp = await fetch(url, {
        headers: { "Accept-Language": "en" },
        cache: "no-store",
      })
      if (!resp.ok) throw new Error("reverse geocode failed")
      const data: { display_name?: string } = await resp.json()
      return data.display_name ?? null
    } catch {
      return null
    }
  }

  // --- Input handlers (dynamic suggestions) ---
  const handleSourceInputChange = (value: string) => {
    setSourceInput(value)
    if (sourceTimer.current) window.clearTimeout(sourceTimer.current)
    if (!value) {
      setSourceSuggestions([])
      onSourceChange(null)
      return
    }
    sourceTimer.current = window.setTimeout(async () => {
      const results = await searchPlaces(value)
      setSourceSuggestions(results)
    }, 300)
  }

  const handleDestinationInputChange = (value: string) => {
    setDestinationInput(value)
    if (destTimer.current) window.clearTimeout(destTimer.current)
    if (!value) {
      setDestinationSuggestions([])
      onDestinationChange(null)
      return
    }
    destTimer.current = window.setTimeout(async () => {
      const results = await searchPlaces(value)
      setDestinationSuggestions(results)
    }, 300)
  }

  const selectSourceLocation = (location: Location) => {
    setSourceInput(location.name)
    onSourceChange(location)
    setSourceSuggestions([])
  }

  const selectDestinationLocation = (location: Location) => {
    setDestinationInput(location.name)
    onDestinationChange(location)
    setDestinationSuggestions([])
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const display = (await reverseGeocode(lat, lng)) || "Current Location"
        const currentLocation: Location = { name: display, lat, lng }
        setSourceInput(display)
        onSourceChange(currentLocation)
        setSourceSuggestions([])
      },
      () => {
        // Fallback to Gangtok on error
        const gangtok = sampleLocations[0]
        setSourceInput(gangtok.name)
        onSourceChange(gangtok)
        setSourceSuggestions([])
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  const canProceed = sourceLocation && destination

  return (
    <div className="space-y-6">
      {/* Source Location */}
      <div className="space-y-2">
        <Label htmlFor="source" className="text-sm font-medium">
          Starting Point (Hotel/Current Location)
        </Label>
        <div className="relative">
          <Input
            id="source"
            placeholder="Enter your starting location..."
            value={sourceInput}
            onChange={(e) => handleSourceInputChange(e.target.value)}
            className="pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4" />
          </Button>

          {sourceSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-border rounded-md shadow-lg z-10 mt-1">
              {sourceSuggestions.map((location, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 text-sm"
                  onClick={() => selectSourceLocation(location)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {location.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <Label htmlFor="destination" className="text-sm font-medium">
          Destination
        </Label>
        <div className="relative">
          <Input
            id="destination"
            placeholder="Where would you like to go?"
            value={destinationInput}
            onChange={(e) => handleDestinationInputChange(e.target.value)}
          />

          {destinationSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-border rounded-md shadow-lg z-10 mt-1">
              {destinationSuggestions.map((location, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 text-sm"
                  onClick={() => selectDestinationLocation(location)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {location.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={onLocationSet}
        disabled={!canProceed}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        <MapPin className="h-4 w-4 mr-2" />
        Show Route & Transport Options
      </Button>
    </div>
  )
}
