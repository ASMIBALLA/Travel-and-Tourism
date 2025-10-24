"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, X } from "lucide-react"

interface ItineraryPageProps {
  prefill?: string
  onClose?: () => void
}

export default function ItineraryPage({ prefill = "", onClose }: ItineraryPageProps) {
  const [preference, setPreference] = useState(prefill)
  const [itinerary, setItinerary] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPreference(prefill)
  }, [prefill])

  const generateItinerary = async () => {
    if (!preference) return
    setLoading(true)
    setItinerary("")

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPreference: preference }),
      })
      const data = await res.json()
      setItinerary(data.itinerary)
    } catch (err) {
      console.error(err)
      setItinerary("Failed to generate itinerary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-4 space-y-6">
          <h1 className="text-2xl font-bold text-center">Sikkim Travel Itinerary Generator</h1>

          <Card>
            <CardHeader>
              <CardTitle>Enter your preference</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Input
                placeholder="e.g., Visit Rumtek Monastery in the morning"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
              />
              <Button onClick={generateItinerary} disabled={loading}>
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                Generate Itinerary
              </Button>
            </CardContent>
          </Card>

          {itinerary && (
            <Card>
              <CardHeader>
                <CardTitle>Your Generated Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                {itinerary.split("\n\n").map((block, idx) => (
                  <div key={idx} className="mb-4">
                    {block.split("\n").map((line, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
