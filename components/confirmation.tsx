"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Car, MapPin, Clock, IndianRupee, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BookingDetails {
  sessionId: string
  amount: number
  currency: string
  carType: string
  transportName: string
  sourceLocation: string
  destination: string
  distance: string
  paymentStatus: string
  transactionId: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // Fetch booking details from Stripe session
      fetchBookingDetails(sessionId)
    }
  }, [sessionId])

  const fetchBookingDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/booking-details?session_id=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setBookingDetails(data)
      }
    } catch (error) {
      console.error("Failed to fetch booking details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your transport has been successfully booked. The driver will contact you shortly.
            </p>
          </div>

          {bookingDetails ? (
            <div className="space-y-6">
              {/* Booking Summary */}
              <Card className="shadow-lg border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Booking Summary
                  </CardTitle>
                  <CardDescription>Transaction ID: {bookingDetails.transactionId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transport Type</p>
                      <p className="font-semibold">{bookingDetails.transportName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vehicle</p>
                      <p className="font-semibold capitalize">{bookingDetails.carType}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium text-sm">From</p>
                        <p className="text-sm text-muted-foreground">{bookingDetails.sourceLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-red-600 mt-1" />
                      <div>
                        <p className="font-medium text-sm">To</p>
                        <p className="text-sm text-muted-foreground">{bookingDetails.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Paid</span>
                      <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                        <IndianRupee className="h-5 w-5" />
                        {bookingDetails.amount}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                      <span>Distance: {bookingDetails.distance} km</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {bookingDetails.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm text-blue-900">Driver Assignment</p>
                      <p className="text-sm text-blue-700">
                        Our team will assign a driver and contact you within 15 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Download className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm text-blue-900">Booking Receipt</p>
                      <p className="text-sm text-blue-700">A detailed receipt has been sent to your email address</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href="/">Book Another Trip</Link>
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Download Receipt
                </Button>
              </div>
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Unable to load booking details. Please contact support if you need assistance.
                </p>
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
