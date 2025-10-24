"use client"

import { LocationInput } from "@/components/location-input"
import { MapModal } from "@/components/map-modal"
import { TransportOptions } from "@/components/transport-options"
import { BookingHistory } from "@/components/booking-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Mountain, Camera, History } from "lucide-react"
import { useBookingState } from "@/hooks/use-booking-state"

export default function TravelBookingPage() {
  const {
    sourceLocation,
    destination,
    isMapOpen,
    showTransportOptions,
    bookingHistory,
    setSourceLocation,
    setDestination,
    openMap,
    closeMap,
    canProceed,
    isMapMinimized,
    onRouteDrawn,
    toggleMapSize,
  } = useBookingState()

  const handleLocationSet = () => {
    if (canProceed) {
      openMap()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">SikkimGo</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Sikkim & Northeast India</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4 text-balance">
            Discover Sacred Monasteries & Hidden Gems
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Book your transport for monastery sightseeing and regional travel across the beautiful landscapes of Sikkim
            and Northeast India
          </p>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Book Journey
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Booking History ({bookingHistory.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="space-y-8">
              {/* Location Input Section */}
              <Card className="max-w-2xl mx-auto shadow-lg border-green-100">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Camera className="h-5 w-5 text-secondary" />
                    Plan Your Journey
                  </CardTitle>
                  <CardDescription>
                    Enter your starting point and destination to find the best transport options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationInput
                    sourceLocation={sourceLocation}
                    destination={destination}
                    onSourceChange={setSourceLocation}
                    onDestinationChange={setDestination}
                    onLocationSet={handleLocationSet}
                  />
                </CardContent>
              </Card>

              {/* Popular Destinations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
                  <CardContent className="p-6">
                    <div className="w-full h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-4 flex items-center justify-center">
                      <Mountain className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="font-semibold text-primary mb-2">Rumtek Monastery</h3>
                    <p className="text-sm text-muted-foreground">
                      One of the most significant monasteries in Sikkim, known for its stunning architecture
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
                  <CardContent className="p-6">
                    <div className="w-full h-32 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg mb-4 flex items-center justify-center">
                      <Mountain className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="font-semibold text-primary mb-2">Pemayangtse Monastery</h3>
                    <p className="text-sm text-muted-foreground">
                      Ancient monastery offering breathtaking views of the Kanchenjunga range
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
                  <CardContent className="p-6">
                    <div className="w-full h-32 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg mb-4 flex items-center justify-center">
                      <Mountain className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="font-semibold text-primary mb-2">Tashiding Monastery</h3>
                    <p className="text-sm text-muted-foreground">
                      Sacred site believed to cleanse sins, perched on a hilltop with panoramic views
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <BookingHistory bookings={bookingHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Map Modal */}
      <MapModal
        isOpen={isMapOpen}
        onClose={closeMap}
        sourceLocation={sourceLocation}
        destination={destination}
        isMapMinimized={isMapMinimized}
        onRouteDrawn={onRouteDrawn}
        onToggleMapSize={toggleMapSize}
      >
        <TransportOptions sourceLocation={sourceLocation} destination={destination} isVisible={showTransportOptions} />
      </MapModal>
    </div>
  )
}
